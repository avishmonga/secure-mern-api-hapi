const { createPII, getAllPIIs } = require('../controllers/PIIController');
const db = require('../models');
const { encryptString, decryptString } = require('../utils/functions');
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
    findAll: jest.fn(),
  },
}));
jest.mock('../utils/functions', () => ({
  encryptString: jest.fn(),
  decryptString: jest.fn(),
}));

describe('PII Controller', () => {
  const h = {
    response: jest.fn().mockReturnValue({
      code: jest.fn(),
    }),
  };
  beforeAll(() => {
    require('dotenv').config(); // Ensure dotenv is loaded
  });
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });
  describe('createPII', () => {
    it('should create a new PII entry and return it', async () => {
      const request = {
        auth: {
          credentials: {
            userId: 1,
          },
        },
        payload: {
          type: 'email',
          value: 'test@example.com',
        },
      };

      // Mock encryption and model creation
      const encryptedValue = 'encryptedValue';
      encryptString.mockReturnValue(encryptedValue);
      const createdPII = {
        userId: 1,
        type: 'email',
        value: encryptedValue,
      };
      db.PII.create.mockResolvedValue(createdPII);

      // Adjust h.response to return the created PII
      h.response.mockReturnValue({
        code: jest.fn().mockReturnValue(createdPII), // Mock the code method to return the created PII
      });

      const result = await createPII(request, h);

      expect(db.PII.create).toHaveBeenCalledWith({
        userId: 1,
        type: 'email',
        value: encryptedValue,
      });
      expect(result).toEqual(createdPII); // Check that the result is equal to the created PII
      expect(h.response).toHaveBeenCalledWith(createdPII); // Check that h.response was called with the created PII
      expect(h.response().code).toHaveBeenCalledWith(201); // Ensure the code method was called with 201
    });
  });
  describe('getAllPIIs', () => {
    it('should return all PII entries for the user', async () => {
      const request = {
        auth: {
          credentials: {
            userId: 1,
          },
        },
        params: {},
      };

      const mockPIIs = [
        {
          id: 1,
          value: 'encryptedEmail', // This should be the encrypted value
          toJSON: jest.fn().mockReturnValue({
            id: 1,
            value: 'encryptedEmail',
          }),
        },
        {
          id: 2,
          value: 'encryptedPhone', // This should be the encrypted value
          toJSON: jest.fn().mockReturnValue({
            id: 2,
            value: 'encryptedPhone',
          }),
        },
      ];

      // Mock the database response and the decryption
      db.PII.findAll.mockResolvedValue(mockPIIs);
      decryptString.mockImplementation((value) => {
        if (value === 'encryptedEmail') return 'test@example.com';
        if (value === 'encryptedPhone') return '1234567890';
      });

      // Call the controller function
      await getAllPIIs(request, h);

      // Check that the response contains the decrypted PII entries
      const expectedResponse = [
        { id: 1, value: 'test@example.com' },
        { id: 2, value: '1234567890' },
      ];

      expect(h.response).toHaveBeenCalledWith(expectedResponse); // Check that h.response was called with the decrypted PII

      // Check the code method was called with 200
      expect(h.response().code).toHaveBeenCalledWith(200); // Ensure the code method was called with 200

      // Check that the correct decrypted values were returned
      const actualResponse = h.response.mock.calls[0][0]; // Get the first argument passed to h.response
      expect(actualResponse).toEqual(expectedResponse); // Ensure the response matches the expected structure
    });
  });
});
