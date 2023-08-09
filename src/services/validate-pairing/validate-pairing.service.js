// Initializes the `validatePairing` service on path `/e-modules/validatePairing`
const { ValidatePairing } = require('./validate-pairing.class');
const hooks = require('./validate-pairing.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/lms/:idLms/validatePairing', new ValidatePairing(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/lms/:idLms/validatePairing');

  service.hooks(hooks);
};
