/* eslint-disable no-unused-vars */
const getAuth = require('../../models/get-auth-code.model');
const utenti = require('../../models/access.model');

exports.ValidatePairing = class ValidatePairing {
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
    const { idLms, idUsr, idApp3D, authCode} = data;
    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if exists a user with idLms and idUsr
    const user = await utentiModel.findOne({
      where: {
        idLms,
        idUsr,
        idApp3D
      }
    });

    if(!user){
      return {statusMsg:"Utente non presente"};
    }
    //check if there is a authCode assigned at user and if is the authCode passed
    const _utente = await getAuthModel.findOne({
      where: {
        idApp3D,
        authCode
      }
    });

    if(_utente){
      //return the status of the operation, the authCode is correct
      await getAuthModel.update({idUsr, idLms, validated:true},{
        where:{
          idApp3D,
          authCode
        }
      })

      return {statusMsg:"authCode validato!"};
    }

    //return the status of the operation, authCodes were never been emitted for that specific user
    return {statusMsg:"Errore, non è stato emesso nessun authCode per l'utente indicato"};

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
