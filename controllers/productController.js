import { models } from '../models/index.js';
import { Op } from 'sequelize';

const { Product, Category } = models;

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      raw: true,
      nest: true
    });

    if (!product) {
      return res.status(404).render('pages/404', { title: 'Товар не найден' });
    }

    // Получаем похожие товары
    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        id: { [Op.ne]: product.id }
      },
      limit: 3,
      raw: true
    });

    // Получаем категории для меню
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      raw: true
    });

    res.render('pages/product', {
      title: product.name,
      product,
      categories,
      relatedProducts
    });

  } catch (err) {
    console.error('Ошибка при загрузке товара:', err);
    res.status(500).render('pages/500', { title: 'Ошибка сервера' });
  }
};