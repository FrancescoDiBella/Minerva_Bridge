const lms = require('./lms/lms.service.js');
const access = require('./access/access.service.js');
const getAuthCode = require('./get-auth-code/get-auth-code.service.js');
const getToken = require('./get-token/get-token.service.js');
const validatePairing = require('./validate-pairing/validate-pairing.service.js');
const saveDatas = require('./save-datas/save-datas.service.js');
const jwtService = require('./jwt-service/jwt-service.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(lms);
  app.configure(access);
  app.configure(getAuthCode);
  app.configure(getToken);
  app.configure(validatePairing);
  app.configure(saveDatas);
  app.configure(jwtService);
};
