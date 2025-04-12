import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'categories',
    timestamps: false
  });

  return Category;
};