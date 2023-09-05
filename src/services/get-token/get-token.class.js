/* eslint-disable no-unused-vars */
const { Service } = require("feathers-sequelize");
const lms = require("../../models/_lms.model");
const { BadRequest } = require("@feathersjs/errors");
const jwt = require("jsonwebtoken");

exports.GetToken = class GetToken {
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
    const { idLms, secret } = data;
    const lmsModel = lms(this.app);

    //Check if user exists;
    const user = await lmsModel.findOne({
      where: {
        id: idLms,
      },
    });

    if (!user) {
      throw new BadRequest("LMS non registrato.");
    }

    const secretIsCorrect = secret == user.secret ? true : false;
    if (secretIsCorrect) {
      // Generate the JWT using the user data and a secret key
      const userData = {
        idLms: user.id,
        secret: user.secret,
      };

      const secret_ = this.app.get("authentication").secret;
      //set the token expiration time to 1 minute
      const options = { expiresIn: "1m" };
      // Generate a new JWT and send it to the client
      const token = jwt.sign(userData, secret_, options);
      const { iat, exp } = jwt.decode(token);
      // Return the JWT to the client
      return { token, iat, exp };
    } else {
      throw new BadRequest("Secret errato, riprovare");
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
