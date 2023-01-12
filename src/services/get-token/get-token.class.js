/* eslint-disable no-unused-vars */
const getAuth = require('../../models/get-auth-code.model');
const utenti = require('../../models/access.model');

exports.GetToken = class GetToken {
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
    const { idLms, idUsr, authCode, idApp3d} = data;
    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if exists a user with idLms and idUsr
    const user = await utentiModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr
      }
    });

    if(!user){
      return "Utente non presente";
    }
    //check if there is a authCode assigned at user and if is the authCode passed
    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr
      }
    });

    if(_utente){
      if(_utente.authCode !== authCode){
        //return the status of the operation, the authCode was never emitted or the authCode is not correct
        return "Errore, l'authCode è errato, ritenta";
      }

      if(_utente.validated === false){
        return "L'authCode non è stato validato attraverso la piattaforma di e-learning!"
      }

      const token = idUsr + '-' + idLms + '-' + authCode + '-' + idApp3d;

      return {token};
    }

    //return the status of the operation, authCodes were never been emitted for that specific user
    return "Errore, non è stato emesso nessun authCode per l'utente indicato";
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
