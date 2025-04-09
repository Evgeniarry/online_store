const express = require('express');
const router = express.Router();

// Middleware для инициализации корзины
router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

// Страница корзины
router.get('/', (req, res) => {
  res.render('pages/cart', {
    title: 'Корзина',
    cartItems: req.session.cart || []
  });
});

// Добавление в корзину
router.post('/add', (req, res) => {
  try {
    const { id, name, price, image } = req.body;
    
    const existingItem = req.session.cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        id,
        name,
        price: Number(price),
        image: image || '/images/placeholder.jpg',
        quantity: 1
      });
    }
    
    res.json({ success: true, cart: req.session.cart });
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;