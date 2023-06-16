// Initializes the `storeSaveData` service on path `/storeSaveData`
const { StoreSaveData } = require('./store-save-data.class');
const hooks = require('./store-save-data.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/storeSaveData', new StoreSaveData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('storeSaveData');

  service.hooks(hooks);
};
