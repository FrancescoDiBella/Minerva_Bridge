// Initializes the `statements` service on path `/statements`
const { Statements } = require("./statements.class");
const hooks = require("./statements.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/statements", new Statements(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("/3d-modules/statements");

  service.hooks(hooks);
};
