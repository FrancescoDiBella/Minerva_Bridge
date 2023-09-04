const jwt = require("jsonwebtoken");
const lms = require("../../models/_lms.model");
const crypto = require("crypto");
const { NotAuthenticated } = require("@feathersjs/errors");
const { hasHeader } = require("../../hasHeader");

module.exports = {
  before: {
    all: [],
    find: [
      async (context) => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        const lmsModel = lms(context.app);

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
          context.data = clientData;
        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated("Token non valido!");
        }

        const user = await lmsModel.findOne({
          where: {
            email: context.data.payload.email,
            password: context.data.payload.password,
          },
        });

        if (!user) {
          context.params = { statusMsg: "email" };
          return context;
        }

        const secret = crypto.randomBytes(6).toString("hex");
        await lmsModel.update(
          { secret },
          {
            where: {
              verified: true,
              email: context.data.payload.email,
              password: context.data.payload.password,
            },
          }
        );
        context.params = { statusMsg: "Secret resettato", secret };
        return context;
      },
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
