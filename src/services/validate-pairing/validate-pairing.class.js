/* eslint-disable no-unused-vars */
const getAuth = require("../../models/get-auth-code.model");
const utenti = require("../../models/access.model");
const lms = require("../../models/_lms.model");
const { BadRequest } = require("@feathersjs/errors");
const { NotFound } = require("@feathersjs/errors");

exports.ValidatePairing = class ValidatePairing {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    const { idUsr, idApp3D } = params.query;
    const { idAdmin } = params;
    const { idLms } = params.route;
    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if exist an LMS with idLms under the admin idAdmin
    const lmsModel = lms(this.app);
    const _lms = await lmsModel.findOne({
      where: {
        id: idLms,
        idAdmin,
      },
    });

    if (!_lms) {
      throw new BadRequest(
        "Non esiste nessun LMS con tale idLms o tale LMS non è di proprietà dell'admin specificato."
      );
    }

    //Check if exists a user with idLms and idUsr and idApp3D
    const user = await utentiModel.findOne({
      where: {
        idLms,
        idUsr,
        idApp3D,
      },
    });

    if (!user) {
      throw new BadRequest("Non c'è nessun utente associato a tale idUsr");
    }

    //check if there is a record for authCode assigned at that specific 3DApplication and if is the authCode passed
    const _user = await getAuthModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
        validated: true,
        tokenRequested: true,
      },
    });

    if (_user) {
      return {
        statusMsg: "Il token è stato richiesto e generato correttamente!",
      };
    }

    throw new NotFound(
      "Non è stato ancora richiesto nessun token per l'utente specificato!"
    );
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with IDs: ${id}!`,
    };
  }

  async create(data, params) {
    const { idUsr, idApp3D, authCode, token, postfix } = data;
    const { idLms } = params.route;
    const { idAdmin } = params.route;

    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);
    const lmsModel = lms(this.app);

    //Check if exist an LMS with idLms under the admin idAdmin

    const _lms = await lmsModel.findOne({
      where: {
        id: idLms,
        idAdmin,
      },
    });

    if (!_lms) {
      throw new BadRequest(
        "Non esiste nessun LMS con tale idLms o tale LMS non è di proprietà dell'admin specificato."
      );
    }
    //Check if exists a user with idLms and idUsr and idApp3D
    const user = await utentiModel.findOne({
      where: {
        idLms,
        idUsr,
        idApp3D,
      },
    });

    if (!user) {
      throw new BadRequest("Non c'è nessun utente associato a tale idUsr");
    }
    //check if there is a record for authCode assigned at that specific 3DApplication and if is the authCode passed
    const _user = await getAuthModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
      },
    });

    if (_user) {
      throw new BadRequest("L'utente ha già associato un AuthCode");
    }

    if (postfix == undefined) {
      throw new BadRequest("Non è stato fornito il postfix!");
    }

    const _utente = await getAuthModel.findOne({
      where: {
        idApp3D,
        authCode,
      },
    });

    if (_utente) {
      //return the status of the operation, the authCode is correct
      await getAuthModel.update(
        { idUsr, idLms, validated: true, postfix, commitToken: token },
        {
          where: {
            idApp3D,
            authCode,
          },
        }
      );

      return { statusMsg: "authCode validato!" };
    } else {
      //return the status of the operation, authCodes were never been emitted for that specific user
      throw new BadRequest(
        "Non è stato emesso nessun authCode per l'app 3D indicata o l'authCode è errato"
      );
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
