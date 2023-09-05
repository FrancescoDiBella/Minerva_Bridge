// Initializes the `lmsOnboarding` service on path `/lms-onboard`
const { LmsOnboarding } = require("./lms-onboarding.class");
const hooks = require("./lms-onboarding.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/e-modules/lms-onboard", new LmsOnboarding(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("/e-modules/lms-onboard");

  service.hooks(hooks);
};
