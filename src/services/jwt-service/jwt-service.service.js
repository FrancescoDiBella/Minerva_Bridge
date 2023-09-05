// Initializes the `JWTService` service on path `/3d-modules/GetToken`
const { JwtService } = require("./jwt-service.class");
const hooks = require("./jwt-service.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  //app.use('/3d-modules/GetToken', new JwtService(options, app));

  // Get our initialized service so that we can register hooks
  //const service = app.service('3d-modules/GetToken');

  //service.hooks(hooks);
};
