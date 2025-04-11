import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { query } from './db.js'; // Предполагая, что query находится здесь

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Настройка сессии
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Настройка Passport
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// В middleware или конкретных роутах
app.use((req, res, next) => {
  res.locals.user = req.user; // Passport сохраняет пользователя в req.user
  res.locals.cartCount = req.session.cart?.length || 0;
  next();
});

// Настройка шаблонизатора
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Импорт роутеров
import indexRouter from './routes/index.js';
import cartRouter from './routes/cart.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import checkoutRouter from './routes/checkout.js';

// Подключение роутеров
app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/auth', authRouter);
app.use(profileRouter);
app.use('/checkout', checkoutRouter);

// Middleware для проверки авторизации
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Защищенный маршрут (один экземпляр)
app.get('/protected-route', checkAuth, (req, res) => {
  res.send('Только для авторизованных');
});

// Обработка ошибок
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
});