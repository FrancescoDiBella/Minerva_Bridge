// Initializes the `adminGetToken` service on path `/admin/getToken`
const { AdminGetToken } = require("./admin-get-token.class");
const hooks = require("./admin-get-token.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };
  const adminGetTokenService = new AdminGetToken(options, app);
  adminGetTokenService.docs = {
    operations: {
      find: false,
      create: {
        summary: "Genera un token di autenticazione per un utente admin.",
        description:
"Endpoint che permette di ottenere un token valido per le \
richieste successive alla registrazione dell'admin quali:\n\n\
* __POST /admin/:idAdmin/lms/:id/user__\n\n__PS: Se l'admin che richiede \
il token è il superadmin allora tale token permette di richiamare \
ad esempio:__\n\n* __GET /admin (lista di tutti gli utenti admin)__\n\n\
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
                  email: {
                    type: "string",
                    example: "test@test.com",
                  },
                  password: {
                    type: "string",
                    example: "test",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Token di autenticazione valido per un minuto.",
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
            description: "Utente admin non registrato o password errata.",
            summary: "Utente admin non registrato.",
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
  app.use("/admin/getToken", adminGetTokenService);

  // Get our initialized service so that we can register hooks
  const service = app.service("admin/getToken");

  service.hooks(hooks);
};
