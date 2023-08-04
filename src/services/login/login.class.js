/* eslint-disable no-unused-vars */
const lms = require('../../models/_lms.model');
const bcrypt = require('bcrypt');
const { BadRequest } = require('@feathersjs/errors');

exports.Login = class Login {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    const {email, password} = data;
    const lmsModel = lms(this.app);

    const user = await lmsModel.findOne({
      where: {
        email
      }
    });

    if(!user){
      throw new BadRequest("L'email non risulta associata a nessun LMS");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    if(passwordIsCorrect){
      return {secret: user.secret, idLms: user.id}
    }

    throw new BadRequest("Password sbagliata, ritenta");
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
};
