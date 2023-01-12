// Initializes the `saveDatas` service on path `/3d-modules/saveDatas`
const { SaveDatas } = require('./save-datas.class');
const hooks = require('./save-datas.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/3d-modules/saveDatas', new SaveDatas(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('3d-modules/saveDatas');

  service.hooks(hooks);
};
