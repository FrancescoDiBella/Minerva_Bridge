// Initializes the `getAuthCode` service on path `/3d-modules/getAuthCode`
const { GetAuthCode } = require("./get-auth-code.class");
const createModel = require("../../models/get-auth-code.model");
const hooks = require("./get-auth-code.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/getAuthCode", new GetAuthCode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("3d-modules/getAuthCode");

  service.hooks(hooks);
};
