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
    const {name, email, password, baseURL, statementsType} = data;
    const lmsModel = lms(this.app);

    const secret =  crypto.randomBytes(6).toString('hex');
    //criptare anche il secret
    //creare il secret SOLO se si conferma email
    try{

    const _lms = await lmsModel.create({
      name,
      email,
      password,
      secret,
      verified: true,
      baseURL,
      statementsType
    })

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
