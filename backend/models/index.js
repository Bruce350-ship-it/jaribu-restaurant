const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import all models
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.MenuItem = require("./menuItem")(sequelize, Sequelize.DataTypes);
db.Order = require("./order")(sequelize, Sequelize.DataTypes);
db.OrderItem = require("./orderItem")(sequelize, Sequelize.DataTypes);
db.CateringRequest = require("./cateringRequest")(sequelize, Sequelize.DataTypes);
db.Feedback = require("./feedback")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment")(sequelize, Sequelize.DataTypes);

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
