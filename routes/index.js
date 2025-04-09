const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Подключите модель товара

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().limit(3); // Получаем 3 товара из БД
        res.render('pages/index', { 
            title: 'Главная',
            products 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;