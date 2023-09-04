const _saveDatas = require("../../models/_store-save-datas.model");
const _auth = require("../../models/get-auth-code.model");
const { BadRequest } = require("@feathersjs/errors");
const _utenti = require("../../models/access.model");
/* eslint-disable no-unused-vars */
exports.GetSaveData = class GetSaveData {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    const { idUsr, idLms, idApp3D, authCode } = params.clientData.payload;

    const _saveDatasModel = _saveDatas(this.app);
    const _authModel = _auth(this.app);
    const _utentiModel = _utenti(this.app);

    const _Auth = await _authModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
        authCode,
      },
    });

    if (!_Auth) {
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    const user = await _utentiModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
      },
    });

    if (!user) {
      throw new BadRequest("Errore, utente non trovato");
    }

    const _savedData = await _saveDatasModel.findOne({
      where: {
        id_utenza: user.id,
      },
    });

    if (!_savedData) {
      throw new BadRequest(
        "Errore, dati non trovati! Salvare i dati prima di poterli recuperare"
      );
    }

    return {
      data: _savedData.data,
    };
  }

  async get(id, params) {
    const { idUsr, idLms, idApp3D, authCode } = params.clientData.payload;

    const _saveDatasModel = _saveDatas(this.app);
    const _authModel = _auth(this.app);
    const _utentiModel = _utenti(this.app);

    const _Auth = await _authModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
        authCode,
      },
    });

    if (!_Auth) {
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    const user = await _utentiModel.findOne({
      where: {
        idUsr,
        idLms,
        idApp3D,
      },
    });

    if (!user) {
      throw new BadRequest("Errore, utente non trovato");
    }

    const _savedData = await _saveDatasModel.findOne({
      where: {
        id_utenza: user.id,
      },
    });

    return {
      data: _savedData.data,
    };
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
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
