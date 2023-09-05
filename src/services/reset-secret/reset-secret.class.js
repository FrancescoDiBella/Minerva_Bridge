/* eslint-disable no-unused-vars */
const { BadRequest } = require("@feathersjs/errors");

exports.ResetSecret = class ResetSecret {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    if (params.statusMsg == "email") {
      throw new BadRequest("L'email non è associata a nessun utente");
    }
    return params;
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {}

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
