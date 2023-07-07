/* eslint-disable no-unused-vars */
const { BadRequest } = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');

exports.LmsOnboarding = class LmsOnboarding {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.reg = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
  }

  async find (params) {
    const {email} = params.query;

    if(this.reg.test(email)){
      const token = await this.createToken(email);
      return {token:token}
    }
    throw new BadRequest("Email non valida")
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }

  //createToken function using jwt that expires in 2 hours
  async createToken(email) {
    const payload = { email };
    const secret = this.app.get('authentication').secret;
    const options = { expiresIn: '2h' };
    return jwt.sign(payload, secret, options);
  }
};
