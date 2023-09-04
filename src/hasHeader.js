const { NotAuthenticated } = require("@feathersjs/errors");

exports.hasHeader = class hasHeader {
  constructor() {}
  async hasAuthorization(headers) {
    if (!headers.authorization) {
      throw new NotAuthenticated("Manca l'header `Authorization`");
    }
  }
};
