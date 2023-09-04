// Initializes the `getSaveData` service on path `/getSaveData`
const { GetSaveData } = require("./get-save-data.class");
const hooks = require("./get-save-data.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/getSaveData", new GetSaveData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service("/3d-modules/getSaveData");

  service.hooks(hooks);
};
