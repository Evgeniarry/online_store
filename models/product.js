const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/dbname');

const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT
});

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        }
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    Product.associate = models => {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
    };
  
    return Product;
  };