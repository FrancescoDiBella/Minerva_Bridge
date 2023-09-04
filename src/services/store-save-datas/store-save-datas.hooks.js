const jwt = require("jsonwebtoken");
const internalOnly = require("../../internal-only");
const { NotAuthenticated, BadRequest } = require("@feathersjs/errors");
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
        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated("Token non valido!");
        }

        //converti base64_data da base64 a json
        try {
          const base64_data = context.data.data;
          //converti base64_data da base64 a json
          const buff = Buffer.from(base64_data, "base64");
          const string_data = buff.toString("utf-8");

          const _buff = Buffer.from(string_data);
          const _base64_data = _buff.toString("base64");

          context.data = { data: _base64_data };
          return context;
        } catch {
          throw new BadRequest("I dati non sono in base64!");
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
