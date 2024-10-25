const Joi = require('joi');
const { createPII, getAllPIIs } = require('../controllers/PIIController');

module.exports = [
  {
    method: 'POST',
    path: '/pii',
    options: {
      auth: 'jwt',
      description: 'Create PII entry',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          type: Joi.string()
            .valid('aadhar', 'pan', 'driving_licence', 'passport')
            .required(),
          value: Joi.string().required(),
        }),
      },
    },
    handler: createPII,
  },
  {
    method: 'GET',
    path: '/pii',
    options: {
      auth: 'jwt',
      description: 'Get all PII',
      tags: ['api'],
    },
    handler: getAllPIIs,
  },
];
