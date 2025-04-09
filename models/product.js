const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/dbname');

const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
});

module.exports = Product;