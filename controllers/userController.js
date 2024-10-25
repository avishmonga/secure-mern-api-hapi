const db = require('../models');
const User = db.User;
exports.getUsers = async (request, h) => {
  // Fetch all users (admin-only)
  const users = await User.findAll({
    attributes: ['id', 'name', 'email', 'userType'],
  });
  return h.response(users).code(200);
};
