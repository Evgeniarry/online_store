import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    if (!req.session.cart) {
      req.session.cart = [];
    }

    const total = req.session.cart.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    res.render('pages/cart', {
      title: 'Корзина',
      cartItems: req.session.cart, // Изменили имя переменной
      total,
      cartCount: req.session.cart.reduce((count, item) => count + item.quantity, 0)
    });

  } catch (err) {
    console.error('Ошибка загрузки корзины:', err);
    res.status(500).render('pages/500', { title: 'Ошибка сервера' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Необходим ID товара' });

    const { rows } = await query(
      'SELECT id, name, price, image_url FROM products WHERE id = $1', 
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const product = rows[0];
    const existingItem = req.session.cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/images/placeholder.jpg',
        quantity: 1
      });
    }

    req.session.save();
    res.json({ success: true, cart: req.session.cart });

  } catch (err) {
    console.error('Cart error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/update', (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || !quantity) return res.status(400).json({ error: 'Недостаточно данных' });

    if (!req.session.cart) return res.json({ success: false });

    const item = req.session.cart.find(item => item.id === id);
    if (item) item.quantity = parseInt(quantity);

    res.json({ success: true, cart: req.session.cart });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/remove', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Не указан ID товара' });

    if (!req.session.cart) return res.json({ success: false });

    req.session.cart = req.session.cart.filter(item => item.id !== id);
    res.json({ success: true, cart: req.session.cart });

  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Явно экспортируем router как default
export default router;