const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'Главная',
        products: [
            { 
                name: 'Минималистичные часы', 
                price: 12500,
                image: '/images/watch.jpg'
            },
            { 
                name: 'Скандинавский светильник', 
                price: 8700,
                image: '/images/lamp.jpg'
            },
            { 
                name: 'Деревянная подставка', 
                price: 3400,
                image: '/images/stand.jpg'
            },
            { 
                name: 'Керамическая кружка', 
                price: 2100,
                image: '/images/cup.jpg'
            }
        ]
    });
});

// Временные данные для товаров
const mockProducts = [
  {
    id: 1,
    name: 'Смартфон Xiaomi',
    price: 19990,
    category_id: '1',
    image: '/images/phone.jpg',
    description: 'Новый флагман с камерой 108 МП',
    rating: 4,
    is_new: true
  },
  {
    id: 2,
    name: 'Ноутбук ASUS',
    price: 54990,
    category_id: '1',
    image: '/images/laptop.jpg',
    description: '16 ГБ RAM, SSD 512 ГБ',
    rating: 5
  },
  {
    id: 3,
    name: 'Футболка мужская',
    price: 1990,
    category_id: '2',
    image: '/images/tshirt.jpg',
    description: '100% хлопок',
    rating: 3
  }
];

// Временные данные для категорий
const mockCategories = [
  { id: '1', name: 'Электроника' },
  { id: '2', name: 'Одежда' },
  { id: '3', name: 'Для дома' }
];

// Каталог товаров
router.get('/catalog', (req, res) => {
  // Получаем параметры из URL
  const { categories, sort, search } = req.query;
  
  // Копируем товары для фильтрации
  let products = [...mockProducts];
  
  // Фильтрация по категориям
  if (categories) {
    const selectedCategories = categories.split(',');
    products = products.filter(p => selectedCategories.includes(p.category_id));
  }
  
  // Поиск по названию
  if (search) {
    const searchTerm = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Сортировка
  switch(sort) {
    case 'price_asc': 
      products.sort((a, b) => a.price - b.price); 
      break;
    case 'price_desc': 
      products.sort((a, b) => b.price - a.price); 
      break;
    case 'name_asc': 
      products.sort((a, b) => a.name.localeCompare(b.name)); 
      break;
  }
  
  // Добавляем количество товаров в категориях
  const categoriesWithCount = mockCategories.map(category => ({
    ...category,
    count: mockProducts.filter(p => p.category_id === category.id).length
  }));
  
  res.render('pages/catalog', {
    title: 'Каталог',
    products,
    categories: categoriesWithCount,
    selectedCategories: categories ? categories.split(',') : [],
    currentSort: sort || 'default',
    searchQuery: search || '',
    minPrice: 0,
    maxPrice: 100000
  });
});

// Добавление в корзину
router.post('/cart/add', (req, res) => {
    try {
      // Инициализация корзины, если её нет
      if (!req.session.cart) {
        req.session.cart = [];
      }
  
      const { id, name, price, image } = req.body;
      
      // Валидация данных
      if (!id || !name || !price) {
        return res.status(400).json({ 
          success: false,
          error: 'Необходимы id, name и price товара'
        });
      }
  
      // Поиск существующего товара
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
      
      // Сохраняем сессию явно
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

// Страница товара
router.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).render('pages/404', { title: 'Товар не найден' });
    }
    
    res.render('pages/product', {
      title: product.name,
      product,
      mockCategories, // Передаем mockCategories в шаблон
      relatedProducts: mockProducts.filter(p => 
        p.category_id === product.category_id && p.id !== product.id
      ).slice(0, 3)
    });
  });

module.exports = router;