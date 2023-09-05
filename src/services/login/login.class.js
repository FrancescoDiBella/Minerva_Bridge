/* eslint-disable no-unused-vars */
const admin = require("../../models/admin.model");
const bcrypt = require("bcrypt");
const { BadRequest } = require("@feathersjs/errors");

exports.Login = class Login {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const { email, password } = data;
    const adminsModel = admin(this.app);

    const user = await adminsModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequest("L'email non risulta associata a nessun admin");
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (passwordIsCorrect) {
      return { statusMsg: "Login effettuato con successo", role: user.role };
    }

    throw new BadRequest("Password sbagliata, ritenta");
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
};
