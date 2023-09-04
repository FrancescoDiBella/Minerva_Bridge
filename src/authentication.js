const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const { expressOauth } = require("@feathersjs/authentication-oauth");
const { JwtService } = require("./services/jwt-service/jwt-service.class");

module.exports = (app) => {
  const options = {
    paginate: app.get("paginate"),
  };

  const authentication = new JwtService(options, app);
  const localAuth = new AuthenticationService(app);

  authentication.register("jwt", new JWTStrategy());
  localAuth.register("local", new LocalStrategy());

  app.use("/3d-modules/getToken", authentication);
  app.use("/authentication", localAuth);
};
