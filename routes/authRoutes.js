const Joi = require('joi');
const { signup, login } = require('../controllers/authController');

module.exports = [
  {
    method: 'POST',
    path: '/signup',
    options: {
      auth: false,
      description: 'User signup',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          name: Joi.string().min(3).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        }),
      },
    },
    handler: signup,
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
      description: 'User login',
      tags: ['api', 'auth'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        }),
      },
    },
    handler: login,
  },
];
