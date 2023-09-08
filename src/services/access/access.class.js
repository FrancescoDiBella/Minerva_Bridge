const { Service } = require("feathers-sequelize");
const lms = require("../../models/_lms.model");
const _utenti = require("../../models/access.model");
const auth = require("../../models/get-auth-code.model");
const { BadRequest } = require("@feathersjs/errors");
const { NotAuthenticated } = require("@feathersjs/errors");
const admins = require("../../models/admin.model");

exports.Access = class Access extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }

  async find(params) {
    const utentiModel = _utenti(this.app);
    const { idApp3D } = params.query;
    var query = {
      idLms: params.route.idLms,
    };

    if (
      idApp3D != undefined &&
      idApp3D != null &&
      idApp3D != "" &&
      idApp3D != "null" &&
      idApp3D != "undefined"
    ) {
      query.idApp3D = idApp3D;
    }

    const _users = await utentiModel.findAll({
      where: {
        ...query,
      }
    });

    return _users;
  }

  async get(id, params) {
    const utentiModel = _utenti(this.app);
    const { idApp3D } = params.query;
    var query = {
      idLms: params.route.idLms,
      idUsr: id,
    };

    if (
      idApp3D != undefined &&
      idApp3D != null &&
      idApp3D != "" &&
      idApp3D != "null" &&
      idApp3D != "undefined"
    ) {
      query.idApp3D = idApp3D;
    }

    const _users = await utentiModel.findAll({
      where: {
        ...query,
      }
    });

    return _users;
  }

  async create(data, params) {
    const { idUsr, idApp3D } = data;
    const { idLms } = params.route;
    var { idAdmin } = params;

    const lmsModel = lms(this.app);
    const utentiModel = _utenti(this.app);
    const authModel = auth(this.app);
    //Check if data.idLms and data.secret are correct

    //resituisce tutti gli admin solo se l'utente è superadmin
    const adminsModel = admins(this.app);
    const _admin = await adminsModel.findOne({
      where: {
        id: idAdmin,
        role: "superadmin",
      },
    });

    if (_admin) {
      idAdmin = data.idAdmin;
    }

    //Check if user exists;
    const user = await lmsModel.findOne({
      where: {
        id: parseInt(idLms),
        idAdmin: idAdmin,
      },
    });

    if (!user) {
      throw new BadRequest(
        "Non esiste nessun LMS con tale idLms o tale LMS non è di proprietà dell'admin specificato."
      );
    }

    const _user = await utentiModel.findOne({
      where: {
        idLms: parseInt(idLms),
        idUsr: idUsr,
        idApp3D: idApp3D,
      },
    });

    if (_user) {
      const hasAuth = await authModel.findOne({
        where: {
          idLms: idLms,
          idUsr: idUsr,
          idApp3D: idApp3D,
        },
      });

      if (hasAuth) {
        await authModel.destroy({
          where: {
            idLms: idLms,
            idUsr: idUsr,
            idApp3D: idApp3D,
          },
        });

        return {
          statusMsg:
            "Sessione utente resettata, è ora possibile associare un nuovo authCode.",
        };
      }
      return { statusMsg: "Utente già registrato." };
    }

    await utentiModel.create({
      idUsr,
      idLms: parseInt(idLms),
      idApp3D,
    });
    return { statusMsg: "Utente registrato con successo" };
  }
};
