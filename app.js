const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const session = require('express-session');

// Добавьте ПЕРЕД роутами
app.use(session({
  secret: 'your-secret-key', // Замените на реальный секрет
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Для HTTPS установите true
}));

app.use(express.json()); // для Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // для форм

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключение роутера (ДОЛЖНО БЫТЬ ПОСЛЕ настройки EJS и static)
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Middleware для проверки инициализации корзины
app.use((req, res, next) => {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    next();
  });

  const cartRouter = require('./routes/cart'); // Добавьте эту строку

  // Подключение роутов (после middleware)
  app.use('/cart', cartRouter); // Добавьте эту строку

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});