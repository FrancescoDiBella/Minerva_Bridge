// Initializes the `saveDatas` service on path `/3d-modules/saveDatas`
const { SaveDatas } = require("./save-datas.class");
const hooks = require("./save-datas.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  const saveDatasService = new SaveDatas(options, app);

  saveDatasService.docs = {
    operations: {
      find: {
        summary: "Recupero di dati dell'esperienza 3D.",
        description: "Si restituiscono i dati di salvataggio relativi all'utente rappresentato dal token nell'header, i dati restituiti sono in formato base64.",
        parameters: [],
        responses: {
          200: {
            description: "Dati recuperati con successo.",
            content: {
              "application/json": { //TODO: To be changed with the model
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "base64",
                      example: "eyJpZGVudGlmaWVyIjoiZm9vIn0=",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Errore, token errato o authCode non verificato."
          },
          401: {
            description: "Token non valido o scaduto.",
          },
          404: {
            description: "Non sono presenti dati per l'utente rappresentato dal token nell'header.",
          }
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      get: false,
      create: {
        summary: "Salvataggio di dati dell'esperienza 3D.",
        description:
          "Vengono salvati i dati in formato base64 relativi all'utente. Si restituisce l'esito dell'operazione.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "base64",
                    example: "eyJpZGVudGlmaWVyIjoiZm9vIn0=",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Salvataggio avvenuto con successo.",
            content: {
              "application/json": { //TODO: To be changed with the model
                schema: {
                  type: "object",
                  properties: {
                    statusMsg: {
                      type: "string",
                      example: "Dati salvati correttamente! | Dati aggiornati correttamente!",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "I dati forniti non sono in formato base64.",
          },
          401: {
            description: "Token non valido o scaduto.",
          },
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
  app.use("/3d-modules/saveData", saveDatasService);

  // Get our initialized service so that we can register hooks
  const service = app.service("3d-modules/saveData");

  service.hooks(hooks);
};
