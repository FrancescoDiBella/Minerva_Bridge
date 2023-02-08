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
    const { idApp3D } = data;
    const getAuthModel = getAuth(this.app);
    const utentiModel = utenti(this.app);

    //Check if user exists;
    const user = await utentiModel.findOne({
      where: {
        idApp3D: idApp3D
      }
    });

    if(!user){
      return {statusMsg:"Non c'è nessun utente registrato realtivamente all'App3D."};
    }

    const code = this.generateAuth();

    await getAuthModel.create({
      idApp3D,
      authCode:code.toString(),
      validated: false
    })

    this.deleteAuthCode(code.toString(), idApp3D)

    return {authCode:code};
  }

  deleteAuthCode(authCode, idApp3D){
    setTimeout(()=>{
      const getAuthModel = getAuth(this.app);
      getAuthModel.destroy({
        where :{
          idApp3D,
          authCode,
          validated: false
        }
      })
      console.log("Eliminato")
    }, 10000*6)
  }

  generateAuth(){
    return crypto.randomBytes(2).toString('hex');
  }
};

