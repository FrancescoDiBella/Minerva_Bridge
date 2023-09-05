// Initializes the `getSaveData` service on path `/getSaveData`
const { GetSaveData } = require("./get-save-data.class");
const hooks = require("./get-save-data.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  const getSaveDataService = new GetSaveData(options, app);

  getSaveDataService.docs = {
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
  app.use("/3d-modules/getSaveData", getSaveDataService);

  // Get our initialized service so that we can register hooks
  const service = app.service("/3d-modules/getSaveData");

  service.hooks(hooks);
};
