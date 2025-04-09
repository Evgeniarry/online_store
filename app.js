const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Настройка шаблонизатора EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Измените роут главной страницы:
app.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'Главная',
        products: [
            { 
                name: 'Минималистичные часы', 
                price: 12500,
                image: '/images/watch.jpg'
            },
            { 
                name: 'Скандинавский светильник', 
                price: 8700,
                image: '/images/lamp.jpg'
            },
            { 
                name: 'Деревянная подставка', 
                price: 3400,
                image: '/images/stand.jpg'
            },
            { 
                name: 'Керамическая кружка', 
                price: 2100,
                image: '/images/cup.jpg'
            }
        ]
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});