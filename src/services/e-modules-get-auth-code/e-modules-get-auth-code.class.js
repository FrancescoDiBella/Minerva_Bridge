const getAuth = require("../../models/get-auth-code.model");
const utenti = require("../../models/access.model");
const crypto = require("crypto");
const { BadRequest } = require("@feathersjs/errors");
const _lms = require("../../models/_lms.model");

exports.EModulesGetAuthCode = class EModulesGetAuthCode {
  constructor(options, app) {
    this.options = options;
    this.app = app;
  }

  async create(data, params) {
    const { idApp3D, idAdmin } = data;
    const { idLms } = params.route;
    if (
      idApp3D == null ||
      idApp3D == undefined ||
      idApp3D == "" ||
      idApp3D == " "
    ) {
      throw new BadRequest("Non è stato fornito l'idApp3D.");
    }

    //check if exists lms under the admin
    const lmsModel = _lms(this.app);
    console.log(idLms);
    console.log(data)

    const lms = await lmsModel.findOne({
      where: {
        id: idLms,
        idAdmin,
      },
    });

    if (!lms) {
      throw new BadRequest(
        "Non esiste nessun LMS con tale id o non è associato all'Admin."
      );
    }

    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if a user exists;
    const user = await utentiModel.findOne({
      where: {
        idApp3D: idApp3D,
        idLms,
      },
    });

    if (!user) {
      throw new BadRequest(
        "Non c'è nessun utente associato all'App3D o non esiste nessun App3D con tale id."
      );
    }

    const code = this.generateAuth();

    await getAuthModel.create({
      idApp3D,
      authCode: code.toString(),
      validated: false,
    });

    this.deleteAuthCode(code.toString(), idApp3D);

    return { authCode: code };
  }

  deleteAuthCode(authCode, idApp3D) {
    setTimeout(() => {
      const getAuthModel = getAuth(this.app);
      getAuthModel.destroy({
        where: {
          idApp3D,
          authCode,
          validated: false,
        },
      });
    }, 10000 * 6);
  }

  generateAuth() {
    return crypto.randomBytes(2).toString("hex");
  }
};
