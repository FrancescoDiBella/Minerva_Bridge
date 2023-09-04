// Initializes the `statements` service on path `/statements`
const { Statements } = require("./statements.class");
const hooks = require("./statements.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  const statementsService = new Statements(options, app);

  statementsService.docs = {
    operations: {
      find: false,
      get: false,
      create: {
        summary: "Creazione di un nuovo statement.",
        description:
          "Si ricevono i dati da standardizzare secondo SCORM e/o XAPI, \
          si esegue quindi la routine di conversione dei dati e si invia \
          all'LMS corrispondente tramite il baseURL fornito in fase di registrazione, \
          il postfix fornito durante la validatePairing e autenticazione \
          tramite username e password o token. \
          Si restituisce l'esito dell'operazione e gli id degli statements. \
          Se il tipo di statements supportato dall'LMS è lo SCORM allora verranno \
          standardizzati e inviati sotto forma di SCORM solo gli oggetti dell'array \
          il cui “identifier” equivale a “defaultplayer”. \
          Se il tipo di statements supportato dall'LMS è XAPI ogni oggetto dell'array \
          verrà standardizzato in uno statement XAPI.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    identifier: {
                      type: "string",
                      example: "muro4",
                    },
                    parameter: {
                      type: "string",
                      example: "posizione",
                    },
                    value: {
                      oneOf: [
                        {
                          type: "string",
                        },
                        {
                          type: "number",
                        },
                        {
                          type: "array",
                          items: []
                        },
                        {
                          type: "object",
                          properties: {}
                        }
                      ],
                      example: [12, 0, 1.5],
                    },
                    timestamp: {
                      type: "string",
                      example: "01-01-2021 00:00:00",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Statements creati con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusMsg:{
                      type: "string",
                      example: "Statements salvati correttamente!"
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Errore, Statements non salvati! Dettagli: [...]"
          },
          401: {
            description: "Token non valido o scaduto."
          }
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      update: false,
      patch: false,
      remove: false,
    },
  };

  // Initialize our service with any options it requires
  app.use("/3d-modules/statements", statementsService);

  // Get our initialized service so that we can register hooks
  const service = app.service("/3d-modules/statements");

  service.hooks(hooks);
};
