const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize({
  dialect: config.database.dialect,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
});

const db = {
  sequelize,
  Sequelize,
  User: require('./userModel')(sequelize, DataTypes),
  PII: require('./PIIModel')(sequelize, DataTypes),
};

// Define associations after all models are loaded
db.User.hasMany(db.PII, { foreignKey: 'userId' });
db.PII.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
