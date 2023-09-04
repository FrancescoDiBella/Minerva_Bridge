const { NotAuthenticated } = require("@feathersjs/errors");

module.exports = async (context) => {
  if (!context.params.provider) return context;
  throw new NotAuthenticated("Unauthorized");
};
