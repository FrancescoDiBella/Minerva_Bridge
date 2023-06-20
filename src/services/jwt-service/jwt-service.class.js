/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { AuthenticationService } = require('@feathersjs/authentication');
const getAuth = require('../../models/get-auth-code.model');
const utenti = require('../../models/access.model');
const { BadRequest } = require('@feathersjs/errors');

exports.JwtService = class JwtService extends AuthenticationService {
  constructor (options, app) {
    super(app);
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
    // Get the user data from the request body
    const { authCode, idApp3D} = data;
    const getAuthModel = getAuth(this.app);

    //check if there is a authCode assigned at user and if is the authCode passed
    const _utente = await getAuthModel.findOne({
      where: {
        authCode,
        idApp3D
      }
    });

    if(_utente){
      if(_utente.validated === false){
        //return the status of the operation, the authCode is not validated
        throw new BadRequest("L'authCode non è stato validato attraverso la piattaforma di e-learning!")
      }

      const userData = data;

      // Generate the JWT using the user data and a secret key
      const secret = this.app.get('authentication').secret;
      const token = jwt.sign(userData, secret);

      // Return the JWT to the client
      return { token };
    }

    //return the status of the operation, authCodes were never been emitted for that specific user
    throw new BadRequest("Errore, non è stato emesso nessun authCode per l'app 3D indicata o l'authCode è errato")

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
