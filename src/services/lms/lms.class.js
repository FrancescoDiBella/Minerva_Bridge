const { Service } = require("feathers-sequelize");
const lms = require("../../models/_lms.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict } = require("@feathersjs/errors");
const admins = require("../../models/admin.model");

exports.Lms = class Lms extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async find(params) {
    const lmsModel = lms(this.app);
    //controlla se idAdmin è superadmin
    const adminsModel = admins(this.app);
    const idAdmin = params.idAdmin;
    const query = params.query;

    const _admin = await adminsModel.findOne({
      where: {
        id: idAdmin,
        role: "superadmin",
      },
    });

    let _lms;
    try{
      if (!_admin) {
        _lms = await lmsModel.findAll({
          where: {
            idAdmin,
            ...query,
          },
        });
      } else {
        _lms = await lmsModel.findAll({
          where:{
            ...query,
          },
          attributes: ["id", "name", "baseURL", "statementsType", "idAdmin", "authUsername", "authPassword", "createdAt", "updatedAt"],
        });
      }

      return _lms;
    }catch(e){
      return [];
    }
  }

  async create(data, params) {
    const {
      name,
      baseURL,
      statementsType,
      authUsername,
      authPassword,
      idAdmin,
    } = data;
    const lmsModel = lms(this.app);
    //Elimina al baseURL il / alla fine
    const _baseURL =
      toString(baseURL).lastIndexOf("/") == baseURL.length - 1
        ? baseURL.substring(0, baseURL.length - 1)
        : baseURL;
    const secret = crypto.randomBytes(6).toString("hex");
    //criptare anche il secret
    //creare il secret SOLO se si conferma email
    try {
      var _lms;
      if (authUsername == undefined || authPassword == undefined) {
        _lms = await lmsModel.create({
          name,
          secret,
          baseURL: _baseURL,
          statementsType,
          idAdmin,
        });
      } else if (authUsername != undefined && authPassword != undefined) {
        _lms = await lmsModel.create({
          name,
          secret,
          baseURL: _baseURL,
          statementsType,
          authUsername,
          authPassword,
          idAdmin,
        });
      }
      const id = _lms.id;
      const created_at = _lms.createdAt;
      const updated_at = _lms.updatedAt;
      /*await this.app.service('mails').create({
        from: this.app.get("mailer").email,
        to: email,
    })*/

      return {
        idLms: id,
        name,
        idAdmin,
        updatedAt: updated_at,
        createdAt: created_at,
      };
    } catch (e) {
      if(e.name == "SequelizeUniqueConstraintError") {
        throw new Conflict("Un LMS con questo nome è già esistente");
      }
      throw new BadRequest(
        "Errore nella creazione utente LMS, ricontrollare i dati."
      );
    }
  }
};
