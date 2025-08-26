module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    role: { type: DataTypes.ENUM("admin", "customer"), defaultValue: "customer" }
  });

  User.associate = (models) => {
    User.hasMany(models.Order);
    User.hasMany(models.CateringRequest);
    User.hasMany(models.Feedback);
    User.hasMany(models.Payment);
  };

  return User;
};
