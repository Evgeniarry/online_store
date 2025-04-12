import { Router } from 'express';
import { query } from '../db.js';
const router = Router();

// Вспомогательные функции
function calculateTotalPrice(cart) {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTotalItems(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save(err => {
      if (err) {
        console.error('Ошибка сохранения сессии:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Инициализация корзины для всех маршрутов
router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

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

// Добавление в корзину
router.post('/add', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: 'Необходим ID товара'
      });
    }
    
    const { rows } = await query(`
      SELECT id, name, price, image_url 
      FROM products 
      WHERE id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Товар не найден'
      });
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
    
    await saveSession(req);
    
    res.json({ 
      success: true,
      cart: req.session.cart,
      totalItems: calculateTotalItems(req.session.cart),
      totalPrice: calculateTotalPrice(req.session.cart)
    });
    
  } catch (err) {
    console.error('Ошибка добавления в корзину:', err);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Обновление количества
router.post('/update', async (req, res) => {
  try {
    const { id, quantity } = req.body;
    
    // 1. Проверим, есть ли корзина в сессии
    if (!req.session.cart) {
      return res.status(400).json({ 
        success: false, 
        error: 'Корзина не инициализирована' 
      });
    }

    // 2. Найдём товар (приведём id к числу, если нужно)
    const item = req.session.cart.find(item => item.id == id); // Используем == вместо ===
    
    if (!item) {
      console.error('Товар не найден. Ищем id:', id, 'В корзине:', req.session.cart);
      return res.status(404).json({ 
        success: false, 
        error: 'Товар не найден в корзине' 
      });
    }

    // 3. Обновим количество
    item.quantity = parseInt(quantity);
    
    // 4. Сохраним сессию
    await new Promise((resolve, reject) => {
      req.session.save(err => {
        if (err) {
          console.error('Ошибка сохранения сессии:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // 5. Отправим обновлённые данные
    res.json({ 
      success: true,
      cart: req.session.cart,
      totalItems: calculateTotalItems(req.session.cart),
      totalPrice: calculateTotalPrice(req.session.cart)
    });

  } catch (err) {
    console.error('Ошибка обновления корзины:', err);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

router.post('/remove', async (req, res) => {
  try {
    console.log('=== START REMOVE ===');
    console.log('Request body:', req.body);
    const { id } = req.body;
    
    if (!id) {
      console.log('Ошибка: ID не указан');
      return res.status(400).json({ 
        success: false,
        error: 'Не указан ID товара'
      });
    }

    if (!req.session.cart) {
      console.log('Ошибка: Корзина не инициализирована');
      return res.status(400).json({
        success: false,
        error: 'Корзина не инициализирована'
      });
    }

    console.log('Корзина до удаления:', req.session.cart);
    console.log('Пытаемся удалить товар с ID:', id);
    
    const initialLength = req.session.cart.length;
    req.session.cart = req.session.cart.filter(item => {
      console.log(`Проверка товара: ${item.id} (${typeof item.id}) vs ${id} (${typeof id})`);
      return item.id != id; // Используем != для гибкого сравнения
    });
    
    console.log('Корзина после удаления:', req.session.cart);
    
    if (initialLength === req.session.cart.length) {
      console.log('Товар не найден в корзине');
      return res.status(404).json({
        success: false,
        error: 'Товар не найден в корзине'
      });
    }

    try {
      console.log('Пытаемся сохранить сессию...');
      await saveSession(req);
      console.log('Сессия успешно сохранена');
      
      const responseData = {
        success: true, 
        cart: req.session.cart,
        totalPrice: calculateTotalPrice(req.session.cart),
        totalItems: calculateTotalItems(req.session.cart)
      };
      
      console.log('Отправляем ответ:', responseData);
      res.json(responseData);
      
    } catch (saveErr) {
      console.error('Ошибка сохранения сессии:', saveErr);
      throw new Error('Не удалось сохранить изменения');
    }
    
  } catch (err) {
    console.error('Ошибка удаления из корзины:', err);
    res.status(500).json({ 
      success: false,
      error: err.message || 'Ошибка сервера'
    });
  } finally {
    console.log('=== END REMOVE ===');
  }
});

export default router;