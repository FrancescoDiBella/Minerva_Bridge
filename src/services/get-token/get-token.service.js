// Initializes the `getToken` service on path `/e-modules/getToken`
const { GetToken } = require("./get-token.class");
const hooks = require("./get-token.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/e-modules/getToken", new GetToken(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("e-modules/getToken");

  service.hooks(hooks);
};
