module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define("Feedback", {
    message: DataTypes.TEXT
  });

  Feedback.associate = (models) => {
    Feedback.belongsTo(models.User);
  };

  return Feedback;
};
