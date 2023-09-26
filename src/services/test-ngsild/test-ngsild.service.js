// Initializes the `test-ngsild` service on path `/test-ngsild`
const { TestNgsild } = require('./test-ngsild.class');
const hooks = require('./test-ngsild.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test-ngsild', new TestNgsild(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test-ngsild');

  service.hooks(hooks);
};
