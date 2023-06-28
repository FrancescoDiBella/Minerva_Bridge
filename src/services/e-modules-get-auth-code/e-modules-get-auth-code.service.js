// Initializes the `e-modulesGetAuthCode` service on path `/e-modules/getAuthCode`
const { EModulesGetAuthCode } = require('./e-modules-get-auth-code.class');
const hooks = require('./e-modules-get-auth-code.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/e-modules/getAuthCode', new EModulesGetAuthCode(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('e-modules/getAuthCode');

  service.hooks(hooks);
};
