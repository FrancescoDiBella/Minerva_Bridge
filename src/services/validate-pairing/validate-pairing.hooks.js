const internalOnly = require('../../internal-only');
const jwt = require('jsonwebtoken');
const { NotAuthenticated } = require('@feathersjs/errors')
const { hasHeader } = require('../../hasHeader');

module.exports = {
  before: {
    all: [],
    find: [
      async context => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);
          context.params.idAdmin = payload.idAdmin.toString();
          return context;
        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated('Token non valido.');
        }
      }
    ],
    get: [internalOnly],
    create:[
        async context => {
          const hasHeaderObj = new hasHeader();
          const { headers } = context.params;
          const data = context.data;
          // Check if the `Authorization` header is present
          await hasHeaderObj.hasAuthorization(headers);
          // Extract the JWT from the `Authorization` header
          const [, token] = headers.authorization.split(' ');

          // Verify the JWT using the secret key
          try {
            const secret = context.app.get('authentication').secret;
            const payload = jwt.verify(token, secret);
            context.params.idAdmin = payload.idAdmin.toString();
            context.data = data;
            return context;

          } catch (error) {
            // If the JWT is invalid, throw an error
            throw new NotAuthenticated('Token non valido.');
          }
        }
      ],
      update: [internalOnly],
      patch: [internalOnly],
      remove: [internalOnly]
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
