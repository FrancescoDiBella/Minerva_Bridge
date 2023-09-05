// Initializes the `admin` service on path `/admin`
const { Admin } = require("./admin.class");
const createModel = require("../../models/admin.model");
const hooks = require("./admin.hooks");

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get("paginate"),
  };

  const adminService = new Admin(options, app);
  adminService.docs = {
    overwriteTagSpec: [
      {
        name: "admin",
        description: "Gestione degli utenti admin.",
      },
    ],
    summary: "Gestione degli utenti admin.",
    description: "Gestione degli utenti admin.",
    operations: {
      find: false,
      create: {
        summary: "Registra un nuovo utente admin.",
        description: "Crea un nuovo admin (di LMS).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    example: "test",
                  },
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
                      example: "test",
                    },
                    email: {
                      type: "string",
                      example: "test@test.com",
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
          400: {
            description:
              "Errore nella creazione utente admin, ricontrollare i dati.",
          },
          409: {
            description: "Utente già registrato.",
          }
        },
      },
      get: false,
      update: false,
      patch: false,
      remove: false,
    },
  };

  // Initialize our service with any options it requires
  app.use("/admin", adminService);

  // Get our initialized service so that we can register hooks
  const service = app.service("admin");

  service.hooks(hooks);
};
