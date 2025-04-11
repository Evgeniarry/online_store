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
export default router;