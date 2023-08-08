const { Service } = require('feathers-sequelize');
const lms = require('../../models/_lms.model');
const _utenti = require('../../models/access.model');
const auth = require('../../models/get-auth-code.model');
const {BadRequest} = require('@feathersjs/errors');

exports.Access = class Access extends Service {
  constructor(options, app){
    super(options);
    this.app = app;
  }

  async find(params){
    const utentiModel = _utenti(this.app);
    const {idApp3D} = params.query;
    var query = {
      idLms: params.route.idLms
    }

    if(idApp3D != undefined && idApp3D != null
      && idApp3D != '' && idApp3D != 'null'
      && idApp3D != 'undefined'){
      query.idApp3D = idApp3D;
    }

    const _users = await utentiModel.findAll({
      where: {
        ...query
      },
      attributes: ['idUsr', 'idApp3D', 'idLms']
    });

    return _users;
  }

  async get(id, params){
    const utentiModel = _utenti(this.app);
    const {idApp3D} = params.query;
    var query = {
      idLms: params.route.idLms,
      idUsr: id
    }

    if(idApp3D != undefined && idApp3D != null
      && idApp3D != '' && idApp3D != 'null'
      && idApp3D != 'undefined'){
      query.idApp3D = idApp3D;
    }

    const _users = await utentiModel.findAll({
      where: {
        ...query
      },
      attributes: ['idUsr', 'idApp3D', 'idLms']
    });

    return _users;
  }

  async create(data, params){
    const {idUsr, idApp3D} = data;
    const {idLms} = params.route;

    const lmsModel = lms(this.app);
    const utentiModel = _utenti(this.app);
    const authModel = auth(this.app);
    //Check if data.idLms and data.secret are correct

    //Check if user exists;
    const user = await lmsModel.findOne({
      where: {
        id: parseInt(idLms)
      }
    });

    if(!user){
      throw new BadRequest("LMS non registrato.");
    }

    const _user = await utentiModel.findOne({
      where: {
        idLms:parseInt(idLms),
        idUsr: idUsr,
        idApp3D: idApp3D
      }
    });

    if(_user){
      const hasAuth = await authModel.findOne({
        where: {
          idLms:idLms,
          idUsr: idUsr,
          idApp3D: idApp3D
        }
      });

      if(hasAuth){
        await authModel.destroy({
          where: {
            idLms:idLms,
            idUsr: idUsr,
            idApp3D: idApp3D
          }});

        return {statusMsg:"Sessione utente resettata, è ora possibile associare un nuovo authCode."};
      }
      return {statusMsg:"Utente già registrato."};
    }

    await utentiModel.create({
      idUsr,
      idLms: parseInt(idLms),
      idApp3D
    })
    return {statusMsg:"Utente registrato con successo"};
    //throw new BadRequest("Secret errato, riprovare");
  }
};
