// Initializes the `mails` service on path `/mails`
const { Mails } = require("./mails.class");
const hooks = require("./mails.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/mails", new Mails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("mails");

  service.hooks(hooks);
};
