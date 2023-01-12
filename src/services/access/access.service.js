// Initializes the `access` service on path `/e-modules/access`
const { Access } = require('./access.class');
const createModel = require('../../models/access.model');
const hooks = require('./access.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/e-modules/access', new Access(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('e-modules/access');

  service.hooks(hooks);
};
