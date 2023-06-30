const internalOnly = require('../../internal-only');
const jwt = require('jsonwebtoken');
const {BadRequest} = require('@feathersjs/errors');
const { NotAuthenticated } = require('@feathersjs/errors')
const {hasHeader} = require('../../hasHeader');

module.exports = {
  before: {
    all: [],
    find: [internalOnly],
    get: [internalOnly],
    create:[
      async context => {
        const { headers } = context.params;
        //console.log("DATA:", context.data)
        const data = context.data;
        // Check if the `Authorization` header is present
        await hasHeader(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);
          data.idLms = payload.idLms.toString();
          data.secret = payload.secret;
          context.data = data;
          return context;

        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated('Token non valido!');
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
