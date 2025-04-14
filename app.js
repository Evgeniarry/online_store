import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import listEndpoints from 'express-list-endpoints';
import { query } from './db.js';
import { isAuthenticated } from './middleware/auth.js'; 
import cors from 'cors';
import {
  getTotalStats,
  getMonthlyStats,
  getTopProducts,
  getRecentOrders,
  getVisitorStats,
  getMonthlyStat
} from './queries.js';
// Добавляем после других импортов
import fs from 'fs';
import { createLogger } from './utils/analyticsLogger.js';
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// 1. Базовые middleware (самые первые)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser()); // Добавьте эту строку

// 2. Настройка сессии (до passport)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    sameSite: 'lax',
    maxAge: 86400000
  }
}));


// 3. Настройка Passport
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
      if (!rows.length) return done(null, false);
      
      const user = rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) return done(null, false);
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  done(null, rows[0]);
});

app.use(passport.initialize());
app.use(passport.session());

// После app.use(passport.session());
app.use((req, res, next) => {
  // Установка cookies для трекинга
  if (!req.cookies?.visitor_id) {
    const visitorId = generateUUID();
    res.cookie('visitor_id', visitorId, { 
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax'
    });
    req.cookies = req.cookies || {};
    req.cookies.visitor_id = visitorId;
  }

  // Логирование основных данных о запросе
  const analyticsData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    userId: req.user?.id || null,
    sessionId: req.sessionID,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referer'),
    visitorId: req.cookies?.visitor_id || 'unknown'
  };
  
  createLogger('access').log(analyticsData);
  next();
});

// Middleware для сбора аналитики
app.use((req, res, next) => {
  // Пропускаем статические файлы и API-запросы
  if (req.path.startsWith('/static') || req.path.startsWith('/api')) {
    return next();
  }

  const analyticsData = {
    event_type: 'pageview',
    user_id: req.user?.id || null,
    session_id: req.sessionID,
    client_id: req.cookies?.visitor_id || 'unknown',
    data: {
      url: req.path,
      method: req.method,
      referrer: req.get('Referer'),
      user_agent: req.get('User-Agent'),
      ip: req.ip
    },
    created_at: new Date()
  };

  // Асинхронная запись в БД без блокировки основного потока
  query(
    `INSERT INTO analytics_events 
     (event_type, user_id, session_id, client_id, data, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    Object.values(analyticsData)
  ).catch(err => console.error('Analytics error:', err));

  next();
});

// 4. Общие middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  if (!req.session.cart) req.session.cart = [];
  res.locals.cartCount = req.session.cart.length;
  next();
});

app.use((req, res, next) => {
  // Проверяем согласие на cookies
  const cookiesAccepted = req.cookies['cookies-accepted'] === 'true';
  res.locals.cookiesAccepted = cookiesAccepted;
  
  // Если согласия нет и это не API запрос - устанавливаем только essential cookies
  if (!cookiesAccepted && !req.path.startsWith('/api')) {
    res.cookie('session-temp', generateUUID(), { 
      httpOnly: true,
      sameSite: 'lax'
    });
  }
  
  next();
});

// 5. Настройка шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Подключение роутеров (после ВСЕХ middleware)
import indexRouter from './routes/index.js';
import cartRouter from './routes/cart.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import checkoutRouter from './routes/checkout.js';
import ordersRouter from './routes/orders.js';

app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use(profileRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', isAuthenticated, ordersRouter);

app.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const [totalStats, monthlyStats, topProducts, recentOrders, visitorStats, monthlyStat] = await Promise.all([
      getTotalStats(),
      getMonthlyStats(),
      getTopProducts(),
      getRecentOrders(),
      getVisitorStats(),
      getMonthlyStat() // Новый метод
    ]);
    
    res.render('pages/stats', {
      title: 'Статистика продаж',
      user: req.user,
      totalStats: totalStats || { total_revenue: 0, total_orders: 0, avg_order_value: 0 },
      monthlyStats: monthlyStats || [],
      monthlyStat: monthlyStat || [],
      topProducts: topProducts || [],
      recentOrders: recentOrders || [],
      visitorStats: visitorStats || { totalVisitors: 0, uniqueVisitors: 0, bounceRate: 0 } // Новые данные
    });
  } catch (err) {
    console.error('Ошибка при загрузке статистики:', err);
    res.status(500).render('pages/500', { title: 'Ошибка сервера' });
  }
});

app.post('/analytics/track', express.json(), async (req, res) => {
  try {
    await query(
      `INSERT INTO analytics_events 
       (event_type, user_id, session_id, client_id, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.body.type,
        req.user?.id || null,
        req.sessionID,
        req.cookies?.visitor_id || 'unknown',
        JSON.stringify(req.body)
      ]
    );
    res.status(200).end();
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).end();
  }
});

// 8. Обработка ошибок (самые последние)
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { title: 'Ошибка сервера' });
});

// Генератор UUID (добавить в helpers)
function generateUUID() {
  return crypto.randomUUID?.() || 
         ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
           (c ^ crypto.getRandomValues(new Uint8Array(1))[0]).toString(16)
         );
}

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  
  // Альтернативный способ вывода роутов после запуска
  setTimeout(() => {
    console.log('\nFinal routes:');
    console.log(listEndpoints(app));
  }, 100);
});