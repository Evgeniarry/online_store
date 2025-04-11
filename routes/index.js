import { Router } from 'express';
import { query, fixEncoding } from '../db.js';

const router = Router();

// Главная страница
router.get('/', async (req, res) => {
    try {
        const { rows: products } = await query(`
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT 5
        `);
        
        const fixedProducts = products.map(product => ({
            id: product.id,
            name: fixEncoding(product.name),
            price: product.price,
            image: product.image_url || '/images/placeholder.jpg',
            category: fixEncoding(product.category_name)
        }));

        res.render('pages/index', { 
            title: 'Главная',
            products: fixedProducts
        });
    } catch (err) {
        console.error('Ошибка при загрузке товаров:', err);
        res.render('pages/index', { 
            title: 'Главная',
            products: [],
            error: 'Не удалось загрузить товары'
        });
    }
});

// Каталог товаров
router.get('/catalog', async (req, res) => {
  try {
    const { categories: categoryParam, sort, search } = req.query;
    
    let sqlQuery = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.image_url as image,
        p.description,
        p.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Фильтрация по категориям (переименована переменная)
    if (categoryParam) {
      const categoryIds = categoryParam.split(',').map(Number);
      sqlQuery += ` AND p.category_id = ANY($${params.length + 1}::int[])`;
      params.push(categoryIds);
    }
    
    // Поиск по названию
    if (search) {
      sqlQuery += ` AND LOWER(p.name) LIKE LOWER($${params.length + 1})`;
      params.push(`%${search.toLowerCase()}%`);
    }
    
    // Сортировка
    const sortOptions = {
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      name_asc: 'p.name ASC',
      rating_desc: 'p.rating DESC'
    };
    
    sqlQuery += ` ORDER BY ${sortOptions[sort] || 'p.created_at DESC'}`;
    
    // Получаем товары (используем другое имя для деструктуризации)
    const { rows: productItems } = await query(sqlQuery, params);
    
    // Получаем категории (переименована переменная)
    const { rows: categoryList } = await query(`
      SELECT c.id, c.name, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY c.name
    `);
    
    // Исправляем кодировку
    const fixedProducts = productItems.map(p => ({
      ...p,
      name: fixEncoding(p.name),
      description: fixEncoding(p.description),
      category_name: fixEncoding(p.category_name)
    }));
    
    const fixedCategories = categoryList.map(c => ({
      ...c,
      name: fixEncoding(c.name)
    }));
    
    res.render('pages/catalog', {
      title: 'Каталог',
      products: fixedProducts,
      categories: fixedCategories,
      selectedCategories: categoryParam ? categoryParam.split(',') : [],
      currentSort: sort || 'default',
      searchQuery: search || '',
      minPrice: 0,
      maxPrice: 100000
    });
    
  } catch (err) {
    console.error('Ошибка при загрузке каталога:', err);
    res.render('pages/catalog', {
      title: 'Каталог',
      products: [],
      categories: [],
      error: 'Не удалось загрузить каталог'
    });
  }
});

// Страница товара
router.get('/product/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Получаем товар из БД
    const { rows: productRows } = await query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [productId]);
    
    if (productRows.length === 0) {
      return res.status(404).render('pages/404', { title: 'Товар не найден' });
    }
    
    // Получаем похожие товары
    const { rows: relatedProducts } = await query(`
      SELECT p.* 
      FROM products p
      WHERE p.category_id = $1 AND p.id != $2
      LIMIT 3
    `, [productRows[0].category_id, productId]);
    
    // Получаем категории
    const { rows: categories } = await query('SELECT * FROM categories');
    
    // Исправляем кодировку
    const product = {
      ...productRows[0],
      name: fixEncoding(productRows[0].name),
      description: fixEncoding(productRows[0].description),
      category_name: fixEncoding(productRows[0].category_name)
    };
    
    const fixedRelatedProducts = relatedProducts.map(p => ({
      ...p,
      name: fixEncoding(p.name),
      description: fixEncoding(p.description)
    }));
    
    const fixedCategories = categories.map(c => ({
      ...c,
      name: fixEncoding(c.name)
    }));
    
    res.render('pages/product', {
      title: product.name,
      product,
      categories: fixedCategories,
      relatedProducts: fixedRelatedProducts
    });
    
  } catch (err) {
    console.error('Ошибка при загрузке товара:', err);
    res.status(500).render('pages/500', { title: 'Ошибка сервера' });
  }
});

// Добавление в корзину
router.post('/cart/add', async (req, res) => {
  try {
    // Инициализация корзины
    if (!req.session.cart) {
      req.session.cart = [];
    }

    const { id } = req.body;
    
    // Валидация
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: 'Необходим ID товара'
      });
    }
    
    // Получаем товар из БД
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
    
    // Поиск существующего товара в корзине
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
    
    // Сохраняем сессию
    req.session.save(err => {
      if (err) {
        console.error('Ошибка сохранения сессии:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Ошибка сервера'
        });
      }
      
      res.json({ 
        success: true,
        cart: req.session.cart
      });
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
  router.post('/cart/update', (req, res) => {
    try {
      const { id, quantity } = req.body;
      
      if (!id || !quantity) {
        return res.status(400).json({ error: 'Недостаточно данных' });
      }
  
      if (!req.session.cart) {
        return res.json({ success: false });
      }
  
      const item = req.session.cart.find(item => item.id === id);
      if (item) {
        item.quantity = parseInt(quantity);
      }
      
      res.json({ success: true, cart: req.session.cart });
    } catch (err) {
      console.error('Ошибка обновления корзины:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
  
  // Удаление из корзины
  router.post('/cart/remove', (req, res) => {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Не указан ID товара' });
      }
  
      if (!req.session.cart) {
        return res.json({ success: false });
      }
  
      req.session.cart = req.session.cart.filter(item => item.id !== id);
      
      res.json({ success: true, cart: req.session.cart });
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });

  export default router;