// Initializes the `refresh_admin_token` service on path `/admin/refreshToken`
const { RefreshAdminToken } = require('./refresh_admin_token.class');
const hooks = require('./refresh_admin_token.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  const adminRefreshTokenService = new RefreshAdminToken(options, app);

  adminRefreshTokenService.docs = {
    operations: {
      find: false,
      create: {
        summary: "Refresh del token di autenticazione per un utente admin tramite refreshToken generato precedentemente.",
        description:
"Endpoint che permette di fare refresh di un token valido per le richieste successive alla registrazione dell’admin\n\n\
Insieme al token vengono restituiti tempo emissione e tempo per la \
scadenza, il token è valido per un minuto. La chiamata restituisce il refreshToken (e rispettive iat e exp)\
che permette di richiedere un’altra coppia (token,refreshToken)\
valida senza inserire nuovamente le credenziali.\
Il refreshToken ha scadenza di un giorno (settabile liberamente)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: {
                    type: "String",
                    example: "eymKDjN2932HDNsdf2938mlLmmksmalpo2039u",
                  }
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Token di autenticazione valido per un minuto e refreshToken valido per un giorno.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "jK8sL9nRmT4oP5qA2cE7...",
                    },
                    iat: {
                      type: "integer",
                      example: 1693816119,
                    },
                    exp: {
                      type: "integer",
                      example: 1693816419,
                    },
                    refreshToken: {
                      type: "string",
                      example: "eymSsksdOOA05mmskd...",
                    },
                    refresh_iat: {
                      type: "integer",
                      example: 1693816119,
                    },
                    refresh_exp: {
                      type: "integer",
                      example: 1694234419,
                    },
                    idAdmin: {
                      type: "integer",
                      example: 1,
                    },
                    role: {
                      type: "string",
                      example: "admin",
                    }
                  },
                },
              },
            },
          },
          400: {
            description: "RefreshToken non valido o scaduto.",
            summary: "Il refresh token è scaduto o non è stato salcato correttamente.",
          },
        },
      },
      get: false,
      update: false,
      patch: false,
      remove: false,
    },
  };
  // Initialize our service with any options it requires
  app.use('/admin/refreshToken', adminRefreshTokenService);

  // Get our initialized service so that we can register hooks
  const service = app.service('admin/refreshToken');

  service.hooks(hooks);
};
