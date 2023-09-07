/* eslint-disable no-unused-vars */
const admins = require("../../models/admin.model");
const { BadRequest } = require("@feathersjs/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.AdminGetToken = class AdminGetToken {
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
    //codice che controlla se data.idLms e data.secret sono corretti
    const { email, password } = data;
    const adminsModel = admins(this.app);

    //Check if user exists;
    const _admin = await adminsModel.findOne({
      where: {
        email,
      },
    });

    if (!_admin) {
      throw new BadRequest("Admin non registrato.");
    }

    const passwordIsCorrect = await bcrypt.compare(password, _admin.password);
    if (passwordIsCorrect) {
      // Generate the JWT using the user data and a secret key
      const userData = {
        idAdmin: _admin.id,
      };

      const secret_ = this.app.get("authentication").secret;
      //set the token expiration time to 1 minute
      const options = { expiresIn: "1m" };
      // Generate a new JWT and send it to the client
      const token = jwt.sign(userData, secret_, options);
      const { iat, exp } = jwt.decode(token);
      // Return the JWT to the client
      return { token, iat, exp, idAdmin: _admin.id, role: _admin.role};
    } else {
      throw new BadRequest("Password errata, riprovare");
    }
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
