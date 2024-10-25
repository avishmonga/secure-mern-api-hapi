const db = require('../models');
const User = db.User;
exports.getUsers = async (request, h) => {
  try {
    // Fetch all users (admin-only)
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'userType'],
    });
    return h.response(users).code(200);
  } catch (error) {
    console.error('Error fetching users:', error);
    return h.response({ message: 'Server error' }).code(500);
  }
};
