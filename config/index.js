require('dotenv').config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  redisHost: process.env.REDIS_HOST || 'localhost',
  database: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
};
