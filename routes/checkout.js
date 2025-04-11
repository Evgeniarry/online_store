import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Проверка авторизации
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login?returnTo=/checkout');
  }
  next();
};

// Страница оформления
router.get('/', requireAuth, async (req, res) => {
  try {
    if (!req.session.cart?.length) {
      return res.redirect('/cart');
    }

    const total = req.session.cart.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    res.render('pages/checkout', {
      title: 'Подтверждение заказа',
      cartItems: req.session.cart,
      total,
      user: req.user
    });

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).render('pages/500', { title: 'Ошибка сервера' });
  }
});

router.post('/', requireAuth, async (req, res) => {
    try {
      if (!req.session.cart?.length) {
        return res.status(400).json({ error: 'Корзина пуста' });
      }
  
      const total = req.session.cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
  
      await query('BEGIN');
  
      // Создаем заказ
      const { rows: [order] } = await query(
        `INSERT INTO orders (user_id, total) 
         VALUES ($1, $2) 
         RETURNING id`,
        [req.user.id, total]
      );
  
      // Добавляем товары
      for (const item of req.session.cart) {
        await query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.id, item.quantity, item.price]
        );
      }
  
      await query('COMMIT');
  
      // Очищаем корзину
      req.session.cart = [];
      req.session.save();
  
      res.json({ 
        success: true,
        orderId: order.id,
        cartCleared: true // Флаг, что корзина очищена
      });
  
    } catch (err) {
      await query('ROLLBACK');
      console.error('Order error:', err);
      res.status(500).json({ error: 'Ошибка при создании заказа' });
    }
  });

export default router;