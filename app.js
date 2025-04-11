import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import indexRouter from './routes/index.js';
import cartRouter from './routes/cart.js'; // Теперь импорт будет работать

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

app.use('/', indexRouter);
app.use('/cart', cartRouter); // Теперь маршруты cart будут работать

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Страница не найдена' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { title: 'Ошибка сервера' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});