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
const RateLimiter = require('hapi-rate-limitor');

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

const swaggerOpts = {
  info: {
    title: 'Secure MERN API documentation',
    description:
      'This API has a rate limit of 10 request per minute for login and signup and  50 requests per hour per user for other routes. If the limit is exceeded, a 429 Too Many Requests response will be returned.',
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
const rateLimiterOpts = {
  redis: {
    port: 6379,
    host: config.redisHost,
  },
  userAttribute: 'id',
  userLimitAttribute: 'rateLimit',
  max: 50,
  duration: 60 * 60 * 1000, // per hour
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

  await server.register([
    Inert,
    Vision,
    {
      plugin: Hapiswagger,
      options: swaggerOpts,
    },
    {
      plugin: RateLimiter,
      options: rateLimiterOpts,
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
