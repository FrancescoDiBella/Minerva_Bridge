const lms = require('./lms/lms.service.js');
const access = require('./access/access.service.js');
const getAuthCode = require('./get-auth-code/get-auth-code.service.js');
const validatePairing = require('./validate-pairing/validate-pairing.service.js');
const saveDatas = require('./save-datas/save-datas.service.js');
const jwtService = require('./jwt-service/jwt-service.service.js');
const login = require('./login/login.service.js');
const mails = require('./mails/mails.service.js');
const verifyEmail = require('./verify-email/verify-email.service.js');
const resetSecret = require('./reset-secret/reset-secret.service.js');
const getSaveData = require('./get-save-data/get-save-data.service.js');
const statements = require('./statements/statements.service.js');
const getToken = require('./get-token/get-token.service.js');
const eModulesGetAuthCode = require('./e-modules-get-auth-code/e-modules-get-auth-code.service.js');
const lmsOnboarding = require('./lms-onboarding/lms-onboarding.service.js');
const storeSaveDatas = require('./store-save-datas/store-save-datas.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(lms);
  app.configure(access);
  app.configure(getAuthCode);
  app.configure(validatePairing);
  app.configure(saveDatas);
  app.configure(jwtService);
  app.configure(login);
  app.configure(mails);
  app.configure(verifyEmail);
  app.configure(resetSecret);
  app.configure(getSaveData);
  app.configure(statements);
  app.configure(getToken);
  app.configure(eModulesGetAuthCode);
  app.configure(lmsOnboarding);
  app.configure(storeSaveDatas);
};
