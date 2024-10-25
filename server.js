'use strict';
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Hapiswagger = require('hapi-swagger');
const Jwt = require('hapi-auth-jwt2');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const db = require('./models');
const User = db.User;
const Joi = require('joi');

const registerRoutes = async (server) => {
  const routesPath = path.join(__dirname, 'routes');
  const routeFiles = fs.readdirSync(routesPath);

  for (const file of routeFiles) {
    if (file.endsWith('.js')) {
      const route = require(path.join(routesPath, file));
      server.route(route);
    }
  }
};
const validate = async (decoded, request, h) => {
  try {
    // Verify if the user ID from the token exists in the database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return { isValid: false };
    }

    // Add user info to request for further use in the handler if needed
    request.user = user;

    // Return valid if user exists and token is valid
    return { isValid: true };
  } catch (err) {
    console.error('Token validation error:', err);
    return { isValid: false };
  }
};
const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
  });
  await server.register(Jwt);

  server.auth.strategy('jwt', 'jwt', {
    key: config.jwtSecret,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  const swaggerOpts = {
    info: {
      title: 'Secure MERN API documentation',
      version: '1.0.0',
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ jwt: [] }],
  };
  await server.register([
    Inert,
    Vision,
    {
      plugin: Hapiswagger,
      options: swaggerOpts,
    },
  ]);

  // Health check route
  server.route({
    method: 'GET',
    path: '/health',
    options: {
      auth: false,
      tags: ['api', 'health'], // Swagger tags
      description: 'Health check endpoint',
      response: {
        schema: Joi.object({
          status: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      return h.response({ status: 'OK' }).code(200);
    },
  });
  await registerRoutes(server);
  await db.sequelize.sync(); // Sync  database models

  // Global error handling
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return h
        .response(response.output.payload)
        .code(response.output.statusCode);
    }
    return h.continue;
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
  console.log('Documentation is running on %s/documentation', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
