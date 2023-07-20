const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
const axios = require('axios')
const { BadRequest } = require('@feathersjs/errors');
/* eslint-disable no-unused-vars */
exports.StoreSaveData = class StoreSaveData {
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
    const {payload} = params.clientData;

    const {idUsr} = payload;
    const {idLms} = payload
    const {authCode} = payload
    const {idApp3D} = payload

    const save_data = data;

    console.log(idUsr, idLms, authCode, idApp3D, save_data);
    console.log("save_data:", save_data);

    const getAuthModel = getAuth(this.app);
    const lmsModel = _utenti(this.app);
    //const getHook = hook(this.app);
    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3D,
        authCode: authCode,
        validated: true
      }
    });

    if(!_utente){
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    //routine di salvataggio dati su database
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
