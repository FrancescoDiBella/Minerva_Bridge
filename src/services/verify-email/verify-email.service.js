// Initializes the `verify-email` service on path `/verify-email`
const { VerifyEmail } = require("./verify-email.class");
const hooks = require("./verify-email.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/verify-email", new VerifyEmail(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("verify-email");

  service.hooks(hooks);
};
