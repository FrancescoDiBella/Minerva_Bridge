// Initializes the `resetSecret` service on path `/resetSecret`
const { ResetSecret } = require("./reset-secret.class");
const hooks = require("./reset-secret.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/e-modules/resetSecret", new ResetSecret(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("/e-modules/resetSecret");

  service.hooks(hooks);
};
