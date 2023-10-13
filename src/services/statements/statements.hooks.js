const jwt = require("jsonwebtoken");
const internalOnly = require("../../internal-only");
const { NotAuthenticated } = require("@feathersjs/errors");
const { hasHeader } = require("../../hasHeader");

module.exports = {
  before: {
    all: [],
    find: [internalOnly],
    get: [internalOnly],
    create: [
      async (context) => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        //console.log("DATA:", context.data)
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(" ");

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get("authentication").secret;
          const payload = jwt.verify(token, secret);
          const clientData = {
            payload,
          };
          context.params.clientData = clientData;
          return context;
        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated("Token non valido!");
        }
      },
    ],
    update: [internalOnly],
    patch: [internalOnly],
    remove: [internalOnly],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
