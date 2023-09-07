// Initializes the `lms` service on path `/lms`
const { Lms } = require("./lms.class");
const createModel = require("../../models/_lms.model");
const hooks = require("./lms.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  const lmsService = new Lms(options, app);
  lmsService.docs = {
    summary: "Gestione degli LMS.",
    description: "Gestione degli LMS.",
    operations: {
      find: {
        summary: "Restituisce tutti gli LMS di un dato admin.",
        description:
          "Richiamata da admin per ottenere tutti gli LMS registrati.",
        parameters: [
          {
            in: "path",
            name: "idAdmin",
            schema: {
              type: "integer",
              example: 1,
            },
          }
        ],
        responses: {
          200: {
            description: "Lista di LMS posseduti dall'admin.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/lms_list",
                },
              },
            },
          },
          401: {
            description: "Token mancante o non valido!",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      create: {
        summary: "Registra un nuovo LMS.",
        description:
"Richiamata da admin per creare nuovi LMS. \
I parameters __authUsername__ e authPassword sono opzionali, \
essi sono le credenziali per poter invocare la chiamata di \
salvataggio di XAPI/SCORM a __baseURL.__",
        parameters: [
          {
            in: "path",
            name: "idAdmin",
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
                  name: {
                    type: "string",
                    example: "LMS TEST 1",
                  },
                  baseURL: {
                    type: "string",
                    example: "http://lrs:8080",
                  },
                  statementsType: {
                    type: "string",
                    example: "XAPI",
                  },
                  authUsername: {
                    type: "string",
                    example: "my_key",
                  },
                  authPassword: {
                    type: "string",
                    example: "my_secret",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Admin creato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    name: {
                      type: "string",
                      example: "LMS TEST 1",
                    },
                    idAdmin: {
                      type: "integer",
                      example: 4,
                    },
                    updatedAt: {
                      type: "string",
                      example: "2021-09-01T09:00:00.000Z",
                    },
                    createdAt: {
                      type: "string",
                      example: "2021-09-01T09:00:00.000Z",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Auth Token mancante o non valido!",
          },
          409: {
            description: "LMS già esistente!",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      get: false,
      update: false,
      patch: false,
      remove: false,
    },
  };

  // Initialize our service with any options it requires
  app.use("/admin/:idAdmin/lms", lmsService);

  // Get our initialized service so that we can register hooks
  const service = app.service("/admin/:idAdmin/lms");

  service.hooks(hooks);
};
