module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    amount: DataTypes.DECIMAL(10, 2),
    status: { type: DataTypes.STRING, defaultValue: "unpaid" },
    paymentMethod: DataTypes.STRING,
    transactionRef: DataTypes.STRING
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order);
    Payment.belongsTo(models.User);
  };

  return Payment;
};
