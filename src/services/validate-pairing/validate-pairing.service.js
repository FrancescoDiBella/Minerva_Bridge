// Initializes the `validatePairing` service on path `/e-modules/validatePairing`
const { ValidatePairing } = require("./validate-pairing.class");
const hooks = require("./validate-pairing.hooks");

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  const validatePairingService = new ValidatePairing(options, app);

  validatePairingService.docs = {
    summary: "Valida il pairing tra app3D ed un LMS.",
    description: "Valida il pairing tra app3D ed un LMS.",
    operations: {
      find: {
        summary: "Controllo stato pairing tra app3D ed un LMS.",
        description: "Restituisce un messaggio positivo se è stato richiesto un token dal modulo 3D. Restituisce un errore 404 in caso contrario.",
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
          {
            required: true,
            in: "path",
            name: "idUsr",
            schema: {
              type: "integer",
              example: 1,
            },
          },
          {
            required: true,
            in: "path",
            name: "idApp3D",
            schema: {
              type: "string",
              example: "ABC",
            },
          }
        ],
        responses: {
          200: {
            description: "Token generato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusMsg: {
                      type: "string",
                      example: "Il token è stato richiesto e generato correttamente!",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Non è stato fornito l'idApp3D, l'idUsr oppure i dati forniti non sono validi!",
          },
          401: {
            description: "Auth Token mancante o non valido!",
          },
          404: {
            description: "Non è stato ancora richiesto nessun token per l'utente specificato!",
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
        summary: "Validazione authCode",
        description:
          "Questa chiamata da LMS verso bridge scatta nel momento in cui l'utente \
  loggato su LMS digita l'authCode ricevuto sull'Oculus dal bridge. Si riceve \
  dal modulo di e-learning un authCode, si controlla se è stato emesso e se l'idApp3D \
  è quello corrispondente al momento della generazione dello stesso. In caso affermativo \
  il sistema segnerà come validato l'authCode, così da permettere la creazione di un Token, \
  il quale potrà poi essere emesso.\n\n \
  Il token (che rappresenta idUSR + idLMS + authCode + idApp3D), verrà fornito quando richiesto \
  tramite l'endpoint __POST /3d-modules/getToken__.\n\n \
  Vengono passati nel body della richiesta un __token (opzionale)__ che verrà usato per __autenticarsi \
  nelle chiamate di commit__ verso la piattaforma di e-learning e un __postfix__ da __concatenare al baseURL__ \
  del punto fornito durante la chiamata a __POST /admin/lms__, questo rende più dinamico e sicuro il \
  processo di salvataggio sulla piattaforma di e-learning.",
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
                  authCode: {
                    type: "string",
                    example: "e7aa",
                  },
                  idUsr: {
                    type: "string",
                    example: "12",
                  },
                  idApp3D: {
                    type: "string",
                    example: "12ee33",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "AuthCode validato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    statusMsg: {
                      type: "string",
                      example: "AuthCode validato con successo",
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Non è stato emesso nessun authCode per l'app 3D indicata, o l'authCode è errato, oppure non sono stati forniti il token di contatto e/o il postfix.",
          },
          401: {
            description: "Auth Token mancante o non valido!",
          },
          404: {
            description: "Non c'è nessun utente associato a tale idUsr",
          },
          409: {
            description: "L'utente ha già associato un AuthCode.",
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
  app.use("/admin/:idAdmin/lms/:idLms/validatePairing", validatePairingService);

  // Get our initialized service so that we can register hooks
  const service = app.service("admin/:idAdmin/lms/:idLms/validatePairing");

  service.hooks(hooks);
};
