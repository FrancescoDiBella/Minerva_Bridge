/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");
const { BadRequest } = require("@feathersjs/errors");
const admins = require("../../models/admin.model");

exports.RefreshAdminToken = class RefreshAdminToken {
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
    try{
      const {refresh_token} = data;

      const refresh_secret = this.app.get("authentication").refreshSecret;

      const decoded = jwt.verify(refresh_token, refresh_secret);

      if (!decoded) {
        throw new BadRequest("Refresh Token non valido.");
      }

      const adminsModel = admins(this.app);

      //Check if user exists;
      const _admin = await adminsModel.findOne({
        where: {
          id: decoded.idAdmin,
        },
      });
      //genera nuovo token e refresh token
      const secret_ = this.app.get("authentication").secret;
      //set the token expiration time to 1 minute
      const options = { expiresIn: "1m" };
      // Generate a new JWT and send it to the client
      const userData = {
        idAdmin: decoded.idAdmin,
        role: _admin.role
      };
      const token = jwt.sign(userData, secret_, options);
      const { iat, exp } = jwt.decode(token);

      //generate refresh token
      const refresh_options = { expiresIn: "1d"};
      const _refresh_token = jwt.sign(userData, refresh_secret, refresh_options);
      const refresh_times = {
          refresh_iat: jwt.decode(_refresh_token).iat,
          refresh_exp: jwt.decode(_refresh_token).exp
        };


      // Return the JWT to the client
      return {
                token, iat, exp,
                refresh_token: _refresh_token,
                refresh_iat: refresh_times.refresh_iat,
                refresh_exp: refresh_times.refresh_exp,
                idAdmin: decoded.idAdmin, role: _admin.role
              };
    }catch(e){
      console.log(e);
      return BadRequest("Errore imprevisto, riprovare.");
    }

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
