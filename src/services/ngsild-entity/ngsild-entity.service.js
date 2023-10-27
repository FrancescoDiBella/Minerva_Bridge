// Initializes the `ngsild-entity` service on path `/entity`
const { NgsildEntity } = require('./ngsild-entity.class');
const hooks = require('./ngsild-entity.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/entity', new NgsildEntity(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('entity');

  service.hooks(hooks);
};
