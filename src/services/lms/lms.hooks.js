const { authenticate } = require('@feathersjs/authentication').hooks;
const bcrypt = require('bcrypt');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const{hasHeader} = require('../../hasHeader');
const { NotAuthenticated } = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      async (context) => {
        const { password } = context.data;
        console.log("DATA:", context.data)
        const hashedPassword = await bcrypt.hash(password, 10);
        context.data.password = hashedPassword;

        //aggiugnere controllo header authorization e token jwt
        //console.log("DATA:", context.data)
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        //console.log("DATA:", context.data)
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');
        console.log(token)
        // Verify the JWT using the secret key
        try {
          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);
          context.data.email = payload.email;
          console.log("payload", payload)
          return context;
        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated('Token non valido!');
        }

      }
    ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
