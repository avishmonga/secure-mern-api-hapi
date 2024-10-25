const { signup, login } = require('../controllers/authController');
const bcrypt = require('bcrypt');

const db = require('../models');
const User = db.User;

// Mock the models
jest.mock('../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    hasMany: jest.fn(),
  },
  PII: {
    create: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  beforeAll(() => {
    require('dotenv').config(); // Ensure dotenv is loaded
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  describe('Signup', () => {
    it('Should create a new user when the payload is valid and user does not exist', async () => {
      // Mock request and response
      const request = {
        payload: {
          name: 'Avish kumar',
          email: 'testavish@gmail.com',
          password: 'testpassword',
        },
      };

      // Adjusted mock for response
      const h = {
        response: jest.fn().mockReturnThis(), // Mock response chaining
        code: jest.fn().mockReturnThis(), // Ensure code() is also mockable
      };

      // Mock User.create() and User.findOne() behavior
      User.findOne = jest.fn().mockResolvedValue(null); // No existing user
      User.create = jest.fn().mockResolvedValue({
        id: 1,
        name: 'Avish kumar',
        email: 'testavish@gmail.com',
      });

      // Call the signup handler
      await signup(request, h);

      // Check response
      expect(h.response).toHaveBeenCalledWith({
        message: 'User created successfully',
        token: expect.any(String), // Check for any string value
      });

      // Ensure code() method was called with the correct status
      expect(h.code).toHaveBeenCalledWith(201);

      // Check that User.create was called with the correct arguments
      expect(User.create).toHaveBeenCalledWith({
        name: 'Avish kumar',
        email: 'testavish@gmail.com',
        password: expect.any(String), // Ensure the password is hashed
      });
    });
    it('should return 409 conflict if user already exists', async () => {
      const request = {
        payload: {
          name: 'Avish Kumar',
          email: 'testavish@gmail.com',
          password: 'testpassword',
        },
      };

      // Mock existing user
      User.findOne.mockResolvedValue({ email: 'testavish@gmail.com' }); // Existing user

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn(),
        }),
      };

      // Use try/catch to handle the expected Boom error
      let result;
      try {
        result = await signup(request, h);
      } catch (error) {
        result = error; // Capture the error thrown by Boom
      }

      // Expect the findOne method to have been called with the correct email
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'testavish@gmail.com' }, // Ensure it matches the format
      });

      // Check that the result is a Boom error
      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(409); // Check for conflict status
      expect(result.output.payload.message).toBe('user already exists'); // Check for correct error message
    });
  });

  describe('Login', () => {
    it('should login successfully when email and password are correct', async () => {
      const request = {
        payload: {
          email: 'testavish@gmail.com',
          password: 'testpassword',
        },
      };

      // Mock the user data
      const mockUser = {
        id: 1,
        email: 'testavish@gmail.com',
        password: await bcrypt.hash('testpassword', 10), // Use a hashed password
      };

      // Mock User.findOne to return the mock user
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return true
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(), // Chainable code method
        }),
      };

      // Call the login function
      const result = await login(request, h);

      // Check if the findOne was called with the correct email
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'testavish@gmail.com' },
      });

      // Check if the response is set correctly
      expect(h.response).toHaveBeenCalledWith({
        message: 'Login successful',
        token: expect.any(String), // Ensure a token is returned
      });

      // Ensure the result is defined
      expect(result).toBeDefined(); // Ensure result is defined
    });

    it('should return 401 when password is invalid', async () => {
      const request = {
        payload: {
          email: 'testavish@gmail.com',
          password: 'wrongpassword', // The incorrect password
        },
      };

      // Simulating a user with a known password
      const mockUser = {
        id: 1,
        email: 'testavish@gmail.com',
        password: await bcrypt.hash('correctpassword', 10), // Store the correct password
      };

      // Mock User.findOne to return the mock user
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      // Mock bcrypt.compare to return false for the wrong password
      bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate password mismatch

      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(),
        }),
      };

      let result;
      try {
        result = await login(request, h);
      } catch (error) {
        result = error; // Capture the error thrown by Boom
      }
      // Execute the login function and assert that it throws an error
      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(401); // Check for conflict status
      expect(result.output.payload.message).toBe('Invalid password'); // Check for correct error message
    });
  });
});
