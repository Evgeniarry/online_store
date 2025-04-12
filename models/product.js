import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('price')) || 0;
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    image_url: DataTypes.STRING
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'products'
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  };

  return Product;
};