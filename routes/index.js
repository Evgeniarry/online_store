import { Router } from 'express';
import { query, fixEncoding } from '../db.js';
import {getProduct} from '../controllers/productController.js';

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

router.get('/product/:id', getProduct);

export default router;