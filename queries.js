import { query } from './db.js';

export const getTotalStats = async () => {
    try {
      const { rows } = await query(`
        SELECT 
          COALESCE(SUM(total), 0) AS total_revenue,
          COALESCE(COUNT(*), 0) AS total_orders,
          COALESCE(AVG(total), 0) AS avg_order_value
        FROM orders
        WHERE status = 'completed'
      `);
      return rows[0];
    } catch (err) {
      console.error('Ошибка при получении общей статистики:', err);
      return { total_revenue: 0, total_orders: 0, avg_order_value: 0 };
    }
  };

export const getMonthlyStats = async () => {
  const { rows } = await query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
      SUM(total) AS revenue,
      COUNT(*) AS orders_count
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', created_at)
    ORDER BY month DESC
    LIMIT 12
  `);
  return rows;
};

export const getTopProducts = async () => {
  const { rows } = await query(`
    SELECT 
      p.name AS product_name,
      SUM(oi.quantity) AS total_sold,
      SUM(oi.quantity * oi.price) AS total_revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'completed'
    GROUP BY p.name
    ORDER BY total_sold DESC
    LIMIT 5
  `);
  return rows;
};

export const getRecentOrders = async () => {
  const { rows } = await query(`
    SELECT 
      o.id,
      o.total,
      o.created_at,
      u.username,
      COUNT(oi.id) AS items_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status = 'completed'
    GROUP BY o.id, u.username
    ORDER BY o.created_at DESC
    LIMIT 10
  `);
  return rows;
};