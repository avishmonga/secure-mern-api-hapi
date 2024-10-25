const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const config = require('../config');

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

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return h.response({ message: 'User already exists' }).code(409);
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

    return h
      .response({ message: 'User created successfully', token })
      .code(201);
  } catch (error) {
    return h.response({ message: 'Error creating user', error }).code(500);
  }
};

// Login
exports.login = async (request, h) => {
  const { email, password } = request.payload;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    // Generate token
    const token = generateToken(user);

    return h.response({ message: 'Login successful', token }).code(200);
  } catch (error) {
    return h.response({ message: 'Error logging in', error }).code(500);
  }
};
