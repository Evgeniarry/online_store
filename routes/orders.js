// routes/orders.js
import { Router } from 'express';
const router = Router();

import { query } from '../db.js';

// Middleware isAuthenticated уже применен в app.js, поэтому здесь не нужен
router.get('/', async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.render('pages/orders', { 
      user: req.user,
      orders: orders.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
    try {
      // Получаем данные заказа
      const order = await query(`
        SELECT * FROM orders 
        WHERE id = $1 AND user_id = $2`, 
        [req.params.id, req.user.id]
      );
  
      // Получаем товары в заказе
      const items = await query(`
        SELECT oi.*, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1`, 
        [req.params.id]
      );
  
      if (order.rows.length === 0) {
        return res.status(404).send('Заказ не найден');
      }
  
      res.render('pages/order-details', {
        order: order.rows[0],
        items: items.rows,
        user: req.user
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
    }
  });

export default router;