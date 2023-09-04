/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");
const lms = require("../../models/_lms.model");

exports.VerifyEmail = class VerifyEmail {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    const email = await this.verifyToken(params.query.token);
    const lmsService = lms(this.app);
    //console.log(email)
    if (email) {
      await lmsService.update({ verified: true }, { where: { email } });
      return "<h1>Email Verificata</h1>";
    } else {
      return "Errore";
    }
  }

  async get(token, params) {}

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.app.get("authentication").secret);
      return decoded.email;
    } catch (error) {
      console.error("Errore durante la verifica del token", error);
      return null;
    }
  }
};
