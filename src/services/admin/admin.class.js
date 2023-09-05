const { Service } = require("feathers-sequelize");
const admins = require("../../models/admin.model");
const {
  BadRequest,
  NotAuthenticated,
  Conflict,
} = require("@feathersjs/errors");
const bcrypt = require("bcrypt");

exports.Admin = class Admin extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async find(params) {
    const { idAdmin } = params.payload;
    //resituisce tutti gli admin solo se l'utente è superadmin
    const adminsModel = admins(this.app);
    const _admin = await adminsModel.findOne({
      where: {
        id: idAdmin,
        role: "superadmin",
      },
    });

    if (!_admin) {
      throw new NotAuthenticated(
        "Non sei autorizzato a visualizzare gli admin"
      );
    }

    //restituisci id, username, email, role, verified di tutti gli admin
    const _admins = await adminsModel.findAll({
      where: {
        role: "admin",
      },
      attributes: ["id", "username", "email", "role", "verified"],
    });

    return _admins;
  }

  async create(data, params) {
    const { username, email, password } = data;
    const adminsModel = admins(this.app);
    //creare il secret SOLO se si conferma email
    try {
      var _admin = await adminsModel.create({
        username,
        email,
        password,
        verified: true,
        role: "admin",
      });
      const id = _admin.id;
      const created_at = _admin.createdAt;
      const updated_at = _admin.updatedAt;
      /*await this.app.service('mails').create({
            from: this.app.get("mailer").email,
            to: email,
        })*/

      return {
        id: id,
        username,
        email,
        updatedAt: updated_at,
        createdAt: created_at,
      };
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        throw new Conflict("Utente già registrato.");
      }

      throw new BadRequest(
        "Errore nella creazione utente admin, ricontrollare i dati."
      );
    }
  }
};
