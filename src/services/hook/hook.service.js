// Initializes the `hook` service on path `/hook`
const { Hook } = require('./hook.class');
const createModel = require('../../models/hook.model');
const hooks = require('./hook.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    internal: true
  };

  // Initialize our service with any options it requires
  app.use('/hook', new Hook(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('hook');

  service.hooks(hooks);
};
