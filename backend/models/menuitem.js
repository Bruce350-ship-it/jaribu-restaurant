module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define("MenuItem", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    available: DataTypes.BOOLEAN
  });

  MenuItem.associate = (models) => {
    MenuItem.hasMany(models.OrderItem);
  };

  return MenuItem;
};
