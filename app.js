const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключение роутера (ДОЛЖНО БЫТЬ ПОСЛЕ настройки EJS и static)
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});