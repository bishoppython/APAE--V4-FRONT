
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database.js");

const sequelize = new Sequelize(config);

const db = {};

db.Child = require("./Child")(sequelize, DataTypes);
db.Game = require("./Game")(sequelize, DataTypes);
db.GameHistory = require("./GameHistory")(sequelize, DataTypes);

// associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
