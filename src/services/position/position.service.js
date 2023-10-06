// Initializes the `position` service on path `/admin/:idAdmin/lms/:idLms/users/position`
const { Position } = require('./position.class');
const hooks = require('./position.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/position', new Position(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('position');

  service.hooks(hooks);
};
