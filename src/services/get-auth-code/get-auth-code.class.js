const { Service } = require('feathers-sequelize');
const getAuth = require('../../models/get-auth-code.model');
const utenti = require('../../models/access.model');
const crypto = require('crypto');

exports.GetAuthCode = class GetAuthCode extends Service {
  constructor(options, app){
    super(options);
    this.app = app;
  }

  async create(data, params){
    const { idUsr,idLms } = data;
    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if user exists;
    const user = await utentiModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr
      }
    });

    if(!user){
      return {statusMsg:"Utente non registrato."};
    }

    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr
      }
    });

    if(_utente){
      return {authCode:_utente.authCode};
    }


    const code = this.generateAuth();

    await getAuthModel.create({
      idUsr,
      idLms,
      authCode:code.toString(),
      validated: false
    })

    return {authCode:code};
  }

  generateAuth(){
    return crypto.randomBytes(2).toString('hex');
  }
};

