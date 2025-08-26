module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2)
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.MenuItem);
  };

  return OrderItem;
};
