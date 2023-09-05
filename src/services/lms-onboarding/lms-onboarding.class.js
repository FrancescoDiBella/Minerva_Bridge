/* eslint-disable no-unused-vars */
const { BadRequest, NotAcceptable } = require("@feathersjs/errors");
const jwt = require("jsonwebtoken");
const admin = require("../../models/admin.model");
exports.LmsOnboarding = class LmsOnboarding {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    this.reg = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );
  }

  async find(params) {
    const { email } = params.query;

    if (this.reg.test(email)) {
      //controlla se esiste un lms con questa mail, se esiste ritorna un errore
      const adminModel = admin(this.app);
      const user = await adminModel.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new BadRequest("Email già presente");
      }
      const token = await this.createToken(email);
      return { token: token };
    }
    throw new NotAcceptable("Email non valida");
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

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

  async createToken(email) {
    const payload = { email: email };
    const secret = this.app.get("authentication").secret;
    return jwt.sign(payload, secret);
  }
};
