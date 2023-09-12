const internalOnly = require("../../internal-only");
const jwt = require("jsonwebtoken");
const { BadRequest } = require("@feathersjs/errors");
const { NotAuthenticated } = require("@feathersjs/errors");
const { hasHeader } = require("../../hasHeader");
const lms = require("../../models/_lms.model");
const admin = require("../../models/admin.model");

module.exports = {
  before: {
    all: [],
    find: [internalOnly],
    get: [internalOnly],
    create: [
      async (context) => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        const data = context.data;
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(" ");

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get("authentication").secret;
          const payload = jwt.verify(token, secret);

          //check if idAdmin is superadmin
          const adminModel = admin(context.app);
          const _admin = await adminModel.findOne({
            where: {
              id: context.params.route.idAdmin,
              role: "superadmin",
            },
          });

          if(!_admin){
            const lmsModel = lms(context.app);

            const _lms = await lmsModel.findOne({
              where: {
                id: context.params.route.idLms,
                idAdmin: context.params.route.idAdmin,
              },
            });

            if(!_lms){
              throw new NotAuthenticated(
                "Non sei autorizzato a richiedere un authCode"
              );
            }

            data.idAdmin = payload.idAdmin.toString();
          }else{
            data.idAdmin = context.params.route.idAdmin;
          }

          context.data = data;
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
