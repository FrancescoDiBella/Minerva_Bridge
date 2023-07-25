const { Service } = require('feathers-sequelize');
const lms = require('../../models/lms.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { BadRequest } = require('@feathersjs/errors');

exports.Lms = class Lms extends Service {
  constructor(options, app){
    super(options);
    this.app = app;
  }

  async create(data, params){
    const {name, email, password, baseURL, statementsType, authUsername, authPassword} = data;
    const lmsModel = lms(this.app);
    //Elimina al baseURL il / alla fine
    const _baseURL = toString(baseURL).lastIndexOf('/') == baseURL.length-1 ? baseURL.substring(0, baseURL.length-1) : baseURL;
    const secret =  crypto.randomBytes(6).toString('hex');
    //criptare anche il secret
    //creare il secret SOLO se si conferma email
    try{
      var _lms;
      if(authUsername == undefined || authPassword == undefined){
        _lms = await lmsModel.create({
          name,
          email,
          password,
          secret,
          verified: true,
          baseURL: _baseURL,
          statementsType
        })
      }else if(authUsername != undefined && authPassword != undefined){
        _lms = await lmsModel.create({
          name,
          email,
          password,
          secret,
          verified: true,
          baseURL: _baseURL,
          statementsType,
          authUsername,
          authPassword
        })
      }
    const id = _lms.id;
    const created_at = _lms.createdAt;
    const updated_at = _lms.updatedAt;
    /*await this.app.service('mails').create({
        from: this.app.get("mailer").email,
        to: email,
    })*/

    return {
      idLms: id,
      name,
      email,
      updatedAt:updated_at,
      createdAt:created_at
    }}
    catch(e){
      throw new BadRequest("Errore nella creazione utente LMS, ricontrollare i dati.")
    }
  }
};
