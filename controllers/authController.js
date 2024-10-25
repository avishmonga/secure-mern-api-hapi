const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const config = require('../config');
const Boom = require('@hapi/boom');

// Helper function to generate JWT token
const generateToken = (user) => {
  return JWT.sign(
    {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
};

// Signup
exports.signup = async (request, h) => {
  const { name, email, password } = request.payload;
  if (!name || !email || !password) {
    throw Boom.badRequest('All fields are required');
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw Boom.conflict('user already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken(newUser);

  return h.response({ message: 'User created successfully', token }).code(201);
};

// Login
exports.login = async (request, h) => {
  const { email, password } = request.payload;

  // Find the user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw Boom.notFound('User not found');
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw Boom.unauthorized('Invalid password');
  }

  // Generate token
  const token = generateToken(user);

  return h.response({ message: 'Login successful', token }).code(200);
};
