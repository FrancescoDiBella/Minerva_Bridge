const { authenticate } = require('@feathersjs/authentication').hooks;
const jwt = require('jsonwebtoken');

module.exports = {
  before: {
    all: [ // Manually check the JWT and throw an error if it is invalid
      async context => {
        const { headers } = context.params;
        const save_data = context.data.save_data;
        // Check if the `Authorization` header is present
        if (!headers.authorization) {
          throw new Error('Missing `Authorization` header');
        }

        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);

          const clientData = {
            save_data,
            payload
          }
          context.data = clientData;
          return context;

        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new Error('Invalid token');
        }
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
