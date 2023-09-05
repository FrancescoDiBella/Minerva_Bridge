// Initializes the `getAuthCode` service on path `/3d-modules/getAuthCode`
const { GetAuthCode } = require("./get-auth-code.class");
const createModel = require("../../models/get-auth-code.model");
const hooks = require("./get-auth-code.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  const getAuthCodeService = new GetAuthCode(options, app);

  getAuthCodeService.docs = {
    summary: "Genera un codice di autenticazione utente per app 3D.",
    description: "Genera un codice di autenticazione utente per app 3D.",
    operations: {
      find: false,
      get: false,
      create: {
        summary: "Genera un codice di autenticazione utente per app 3D.",
        description:
          "A fronte di un idApp3D valido (si veda chiamata admin/lms/:idLms/user), \
                      viene generato un authCode univoco, una stringa randomica per l'app3D  \
                      (tale authCode rimane pendente fin quando non viene validato), dopo un certo \
                      periodo di tempo se l'authCode non è stato redento esso viene invalidato. Viene \
                      restituito tale authCode. Il bridge mantiene in tabella una associazione fra idApp3D \
                      e authCode generato, attendendo che venga redento/utilizzato.",
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
                },
              },
            },
          },
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
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "idApp3D non valido o mancante.",
          },
          404: {
            description:
              "Non c'è nessun utente associato all'App3D o non esiste nessun App3D con tale id.",
          },
        },
      },
      update: false,
      patch: false,
      remove: false,
    },
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/getAuthCode", getAuthCodeService);

  // Get our initialized service so that we can register hooks
  const service = app.service("3d-modules/getAuthCode");

  service.hooks(hooks);
};
