// Initializes the `adminGetToken` service on path `/admin/getToken`
const { AdminGetToken } = require('./admin-get-token.class');
const hooks = require('./admin-get-token.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/admin/getToken', new AdminGetToken(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/getToken');

  service.hooks(hooks);
};
