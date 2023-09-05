// Initializes the `e-modulesGetAuthCode` service on path `/e-modules/getAuthCode`
const { EModulesGetAuthCode } = require("./e-modules-get-auth-code.class");
const hooks = require("./e-modules-get-auth-code.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };
  const EModulesGetAuthCodeService = new EModulesGetAuthCode(options, app);
  EModulesGetAuthCodeService.docs = {
    operations: {
      create: {
        summary: "Genera un codice di autenticazione utente per app 3D.",
        description:
          "Nuovo endpoint richiamato dalla piattaforma di e-learning per ottenere un authCode per app 3D che non girano su Visore (Oculus). \
          A fronte di un idApp3D valido (vedi chiamata /createUser precedente), viene generato un authCode univoco, una stringa randomica per \
          l'app3D (tale authCode rimane pendente fin quando non viene validato), dopo un certo periodo di tempo se l'authCode non è stato \
          redento esso viene invalidato. Viene restituito tale authCode. Il bridge mantiene in tabella una associazione fra idApp3D e authCode \
          generato, attendendo che venga redento/utilizzato.",
        parameters: [
          {
            in: "path",
            name: "idAdmin",
            schema: {
              type: "integer",
              example: 1,
            },
          },
          {
            in: "path",
            name: "idLms",
            schema: {
              type: "integer",
              example: 1,
            },
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idApp3D: {
                    type: "string",
                    example: "12",
                  },
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "AuthCode generato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    authCode: {
                      type: "string",
                      example: "e7aa",
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "idApp3D mancante o non valido!",
          },
          401: {
            description: "Auth Token mancante o non valido!",
          },
          404: {
            description: "Non esiste nessun LMS con tale idLms, l'LMS non è associato all'Admin, non c'è nessun utente associato all'App3D o non esiste nessun App3D con tale id.",
          }
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
  };

  // Initialize our service with any options it requires
  app.use("/admin/:idAdmin/lms/:idLms/getAuthCode", EModulesGetAuthCodeService);

  // Get our initialized service so that we can register hooks
  const service = app.service("admin/:idAdmin/lms/:idLms/getAuthCode");

  service.hooks(hooks);
};
