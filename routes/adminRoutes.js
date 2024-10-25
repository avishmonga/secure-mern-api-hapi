const { getAllPIIs } = require('../controllers/PIIController');
const UserController = require('../controllers/userController');
const { authorize } = require('../middleware/authMiddleware');
const Joi = require('joi');

module.exports = [
  {
    method: 'GET',
    path: '/users',
    handler: UserController.getUsers,
    options: {
      auth: 'jwt',
      description: 'Admin api to retrive users',
      tags: ['api', 'admin'],
      pre: [
        { method: authorize(['admin']) }, // Only admin can access
      ],
    },
  },
  {
    method: 'GET',
    path: '/pii/{userId}',
    handler: getAllPIIs,
    options: {
      auth: 'jwt',
      description: 'Admin api to retrive pii of an user',
      tags: ['api', 'admin'],
      validate: {
        params: Joi.object({
          userId: Joi.string()
            .required()
            .description('ID of the user whose PII is to be fetched'),
        }),
      },
      pre: [
        { method: authorize(['admin']) }, // Only admin can access
      ],
    },
  },
];
