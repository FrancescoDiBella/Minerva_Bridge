// Initializes the `storeSaveDatas` service on path `/3d-modules/storeSaveData`
const { StoreSaveDatas } = require("./store-save-datas.class");
const createModel = require("../../models/_store-save-datas.model");
const hooks = require("./store-save-datas.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  const storeSaveDatasService = new StoreSaveDatas(options, app);

  storeSaveDatasService.docs = {
    operations: {
      find: false,
      get: false,
      create: false,
      update: false,
      patch: false,
      remove: false,
    },
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/storeSaveData", storeSaveDatasService);

  // Get our initialized service so that we can register hooks
  const service = app.service("3d-modules/storeSaveData");

  service.hooks(hooks);
};
