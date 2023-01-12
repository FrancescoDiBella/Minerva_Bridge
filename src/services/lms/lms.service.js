// Initializes the `lms` service on path `/lms`
const { Lms } = require('./lms.class');
const createModel = require('../../models/lms.model');
const hooks = require('./lms.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/lms', new Lms(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lms');

  service.hooks(hooks);
};
