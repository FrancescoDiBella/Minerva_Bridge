const {
  AuthenticationService,
  JWTStrategy,
} = require("@feathersjs/authentication");
const { LocalStrategy } = require("@feathersjs/authentication-local");
const { expressOauth } = require("@feathersjs/authentication-oauth");
const { JwtService } = require("./services/jwt-service/jwt-service.class");

module.exports = (app) => {
  const options = {
    paginate: app.get("paginate"),
  };

  const authenticationService = new JwtService(options, app);
  const localAuthService = new AuthenticationService(app);

  authenticationService.register("jwt", new JWTStrategy());
  localAuthService.register("local", new LocalStrategy());

  authenticationService.docs = {
    summary: "Restituisce un token JWT valido per l'autenticazione.",
    description: "Restituisce un token JWT valido per l'autenticazione.",
    operations: {
      find: false,
      get: false,
      create: {
        summary: "Richiesta di un token JWT valido per l'autenticazione.",
        description:
"Se si riceve indietro l'authCode precedentemente emesso, \
si è sicuri che in questa specifica sessione, quella App3D è in uso \
all'utente registrato e loggato su LMS. Si genera un token univoco \
che il modulo 3D userà per identificarsi in tutte le richieste future \
al modulo di interscambio, si invalida il vecchio authCode, non potrà \
cioè più essere emesso e sarà legato all'IdUsr. Il token generato è un \
JWT (JSON WEB TOKEN), con payload i body parameters inviati dal modulo 3d; \
tale token è autoreferenziale (sì può sempre verificare il payload), non \
ha bisogno di essere mantenuto in un db ed inoltre si può facilmente settare \
la durata dello stesso.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idApp3D: {
                    type: "string",
                    example: "12ee33",
                  },
                  authCode: {
                    type: "string",
                    example: "e7aa",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Token generato con successo.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Non è stato fornito l'idApp3D, l'authCode oppure i dati forniti non sono validi!",
          },
          403: {
            description: "L'authCode non è stato validato attraverso la piattaforma di e-learning!",
          }
        },
      },
      update: false,
      patch: false,
      remove: false,
    },
  };

  app.use("/3d-modules/getToken", authenticationService);
  app.use("/authentication", localAuthService);
};
