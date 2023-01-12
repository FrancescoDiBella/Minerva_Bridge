// Initializes the `getToken` service on path `/3d-modules/getToken`
const { GetToken } = require('./get-token.class');
const hooks = require('./get-token.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/3d-modules/getToken', new GetToken(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('3d-modules/getToken');

  service.hooks(hooks);
};
