module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  database: {
    dialect: 'sqlite',
    storage: './database.sqlite',
  },
};
