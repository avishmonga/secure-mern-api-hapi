const db = require('../models');
const PII = db.PII;
const Boom = require('@hapi/boom');
const { encryptString, decryptString } = require('../utils/functions');

const createPII = async (request, h) => {
  const { userId } = request.auth.credentials;
  const { type, value } = request.payload;
  //encrypt the value
  const encryptedValue = encryptString(value);
  const newPII = await PII.create({ userId, type, value: encryptedValue });
  return h.response(newPII).code(201);
};

const getAllPIIs = async (request, h) => {
  let { userId } = request.auth.credentials; // Get the user ID from the request
  if (request.params.userId) {
    userId = request.params.userId;
  }
  const allPIIs = await PII.findAll({ where: { userId } });

  // Decrypt the PII values before returning them
  const decryptedPIIs = allPIIs.map((pii) => ({
    ...pii.toJSON(), // Convert Sequelize model to plain JSON object
    value: decryptString(pii.value), // Decrypt the value
  }));
  return h.response(decryptedPIIs).code(200);
};

module.exports = { createPII, getAllPIIs };
