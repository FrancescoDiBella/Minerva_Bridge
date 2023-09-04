// Initializes the `login` service on path `/login`
const { Login } = require("./login.class");
const hooks = require("./login.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/login", new Login(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("/login");

  service.hooks(hooks);
};
