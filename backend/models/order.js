module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    status: { type: DataTypes.STRING, defaultValue: "Pending" },
    deliveryAddress: {type: DataTypes.STRING, allowNull: false},
    totalAmount: {type: DataTypes.INTEGER, allowNull: false}
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem);
    Order.hasOne(models.Payment);
  };

  return Order;
};
