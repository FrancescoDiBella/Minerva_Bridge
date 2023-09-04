const { Service } = require("feathers-sequelize");
const _utenti = require("../../models/access.model");
const getAuth = require("../../models/get-auth-code.model");
const axios = require("axios");
const { BadRequest } = require("@feathersjs/errors");
const _saveDatas = require("../../models/_store-save-datas.model");

exports.StoreSaveDatas = class StoreSaveDatas extends Service {
  constructor(options, app) {
    super(options);
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
    const { payload } = params.clientData;

    const { idUsr } = payload;
    const { idLms } = payload;
    const { authCode } = payload;
    const { idApp3D } = payload;

    const save_data = data.data;

    const getAuthModel = getAuth(this.app);
    const saveDatasModel = _saveDatas(this.app);
    const _user = _utenti(this.app);
    //const getHook = hook(this.app);
    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3D,
        authCode: authCode,
        validated: true,
      },
    });

    const user = await _user.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3D,
      },
    });

    if (!_utente) {
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }
    if (!user) {
      throw new BadRequest("Non c'è nessun utente associato a tale idUsr");
    }

    const _savedData = await saveDatasModel.findOne({
      where: {
        id_utenza: user.id,
      },
    });

    if (_savedData) {
      await saveDatasModel.update(
        {
          data: save_data,
        },
        {
          where: {
            id_utenza: user.id,
          },
        }
      );
      return { statusMsg: "Dati aggiornati correttamente!" };
    }

    //routine di salvataggio dati su database
    const savedData = await saveDatasModel.create({
      id_utenza: user.id,
      data: save_data,
    });

    if (savedData) {
      return { statusMsg: "Dati salvati correttamente!" };
    } else {
      throw new Error("Errore nel salvataggio dei dati!");
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
