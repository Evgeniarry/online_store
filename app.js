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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// 1. Базовые middleware (самые первые)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

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

// 4. Общие middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  if (!req.session.cart) req.session.cart = [];
  res.locals.cartCount = req.session.cart.length;
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

// 7. Вывод роутов (после подключения всех)
app.on('mount', () => {
  console.log('Registered routes:');
  console.log(listEndpoints(app));
});

// 8. Обработка ошибок (самые последние)
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { title: 'Ошибка сервера' });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  
  // Альтернативный способ вывода роутов после запуска
  setTimeout(() => {
    console.log('\nFinal routes:');
    console.log(listEndpoints(app));
  }, 100);
});