const internalOnly = require('../../internal-only');
const jwt = require('jsonwebtoken');
const {BadRequest} = require('@feathersjs/errors');
const { NotAuthenticated } = require('@feathersjs/errors')
const{hasHeader} = require('../../hasHeader');
const utenti = require('../../models/access.model');
const admin  = require('../../models/admin.model');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create:[
      async context => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        //console.log("DATA:", context.data)
        const data = context.data;
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');

        // Verify the JWT using the secret key
        try {
          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);
          context.params.idAdmin = payload.idAdmin.toString();
          context.data = data;
          return context;

        } catch (error) {
          // If the JWT is invalid, throw an error
          throw new NotAuthenticated('Token non valido!');
        }
      }
    ],
    update: [internalOnly],
    patch: [internalOnly],
    remove: [
      async context => {
        const hasHeaderObj = new hasHeader();
        const { headers } = context.params;
        //console.log("DATA:", context.data)
        const data = context.data;
        // Check if the `Authorization` header is present
        await hasHeaderObj.hasAuthorization(headers);
        // Extract the JWT from the `Authorization` header
        const [, token] = headers.authorization.split(' ');

        // Verify the JWT using the secret key
        try {
          //given the url of the serive /admin/lms/:idLms/users i want to console.log the idLms passed
          console.log(context.app);

          const secret = context.app.get('authentication').secret;
          const payload = jwt.verify(token, secret);
          const idAdmin = payload.idAdmin;
          const idLms = context.params.route.idLms;

          const lmsModel = context.app.service('/admin/lms').Model;
          const adminModel = admin(context.app);
          const _admin = await adminModel.findOne({
            where: {
              id: idAdmin
            }
          });

          if(_admin.role == 'admin'){
            const lms = await lmsModel.findOne({
              where: {
                id: idLms,
                idAdmin
              }
            });


            if(!lms){
              throw new BadRequest("Non hai i permessi per eliminare questo LMS");
            }
          }

          if(context.id != undefined){
            const userModel = utenti(context.app);
            const users = await userModel.findOne({
              where: {
                idLms,
                id: context.id
              }
            });

            if(!users){
              throw new BadRequest("Non esiste nessun utente con tale id");
            }
          }

          return context;

        } catch (error) {
          // If the JWT is invalid, throw an error
          console.log(error);
          throw new NotAuthenticated('Token non valido!');
        }
      }
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
