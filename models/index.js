import { Sequelize } from 'sequelize';
import productModel from './product.js';
import categoryModel from './category.js';

const sequelize = new Sequelize({
  username: 'postgres',
  host: 'localhost',
  database: 'online_store_new',
  password:'qwerty',
  port: 5432,
  client_encoding: 'UTF8',
  dialect: 'postgres', // явно указываем диалект
  logging: false // отключаем логирование SQL-запросов
});

const models = {
  Product: productModel(sequelize),
  Category: categoryModel(sequelize)
};

// Устанавливаем ассоциации
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };