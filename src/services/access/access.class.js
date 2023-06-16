const { Service } = require('feathers-sequelize');
const lms = require('../../models/lms.model');
const _utenti = require('../../models/access.model');
const bcrypt = require('bcrypt');

exports.Access = class Access extends Service {
  constructor(options, app){
    super(options);
    this.app = app;
  }

  async create(data, params){
    console.log(data)
    const {idLms, idUsr, idApp3D, secret} = data;

    const lmsModel = lms(this.app);
    const utentiModel = _utenti(this.app);
    //Check if data.idLms and data.secret are correct

    //Check if user exists;
    const user = await lmsModel.findOne({
      where: {
        id: idLms
      }
    });

    if(!user){
      return {errorMsg:"LMS non registrato."};
    }

    const secretIsCorrect = secret ==  user.secret ? true:false;
    if(secretIsCorrect){
      //secret is correct
      //Check if user already exists
      const _user = await utentiModel.findOne({
        where: {
          idLms:idLms,
          idUsr: idUsr,
          idApp3D: idApp3D
        }
      });

      if(_user){
        return {errorMsg:"Utente già presente"};
      }

      await utentiModel.create({
        idUsr,
        idLms,
        idApp3D
      })

      console.log("OK")
      return {statusMsg:"Utente registrato con successo"};

    }

    return {errorMsg:"Secret errato, riprovare"};

  }
};
