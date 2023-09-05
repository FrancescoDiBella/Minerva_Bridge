// Initializes the `access` service on path `/e-modules/access`
const { Access } = require("./access.class");
const createModel = require("../../models/access.model");
const hooks = require("./access.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  const accessService = new Access(options, app);

  accessService.docs = {
    summary: "Gestione degli utenti di un LMS.",
    description: "Gestione degli utenti di un LMS.",
    operations: {
      find: {
        summary:
          "Restituisce gli utenti sotto ad un certo LMS di un certo Admin.",
        description:
          "Restituisce gli utenti sotto ad un certo LMS di un certo Admin",
        parameters: [
          {
            in: "path",
            name: "idLms",
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          200: {
            description: "Utenti restituiti con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    $ref: "#/components/schemas/utenti",
                  },
                },
              },
            },
          },
          401: {
            description: "Auth Token mancante o non valido!",
          }
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      create: {
        summary: "Registra un nuovo utente di un LMS.",
        description:
"Usata da LMS per preparare la sessione di gioco \
per uno specifico utente e per una specifica App3D \
(sul proprio LMS evidentemente). Questo ha lo scopo \
di rendere sicura la successiva chiamata getAuthToken. \
Autenticazione tramite token da ottenere tramite la precedente \
chiamata di __POST /admin/getToken__. Se la coppia __idUsr__ e __idApp3D è già \
presente__ il bridge elimina l'associazione avvenuta tramite __validatePairing__ \
con un authCode emesso in precedenza e predispone una nuova emissione e \
validazione per la coppia __idUsr__ e __idApp3D__. Restituisce lo status dell'operazione.",
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
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idUsr: {
                    type: "string",
                    example: "0001",
                  },
                  idApp3D: {
                    type: "string",
                    example: "0001",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Utente registrato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "Utente registrato con successo",
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
            description: "Utente già esistente!",
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
  app.use("/admin/:idAdmin/lms/:idLms/users", accessService);

  // Get our initialized service so that we can register hooks
  const service = app.service("/admin/:idAdmin/lms/:idLms/users");

  service.hooks(hooks);
};
