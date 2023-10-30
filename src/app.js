const path = require("path");
const favicon = require("serve-favicon");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./logger");

const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const swagger = require("feathers-swagger");

const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const channels = require("./channels");

const authentication = require("./authentication");

const sequelize = require("./sequelize");
const sequelizeToJsonSchemas = require("./sequelize-to-json-schemas");

function addJsonHeader(req, res, next) {
  // Verifica se l'header "Content-Type" è già presente nella richiesta
  if (!req.headers['content-type']) {
    // Se non è presente, aggiungi l'header "Content-Type: application/json"
    req.headers['content-type'] = 'application/json';
  }

  // Passa la richiesta al middleware successivo
  next();
}

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compress());
app.use(addJsonHeader);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio((io) => io.on("connection", (socket) => socket)));
app.configure(sequelizeToJsonSchemas);

app.configure(sequelize);
// Configure other middleware (see `middleware/index.js`)

app.configure(
  swagger({
    specs: {
      openapi: "3.0.0",
      info: {
        title: "Minerva Bridge",
        description:
"##### Risorse utili\n \
* Link GitHub a LRSQL: [https://github.com/yetanalytics/lrsql](https://github.com/yetanalytics/lrsql)\n\n\
Di seguito verranno elencati gli end point del \
Bridge Minerva corredati da descrizione, parametri, \
esempi, messaggi d'errore e immagini esplicative (semplificate) \
del workflow per realizzare una certa operazione complessiva.",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    defaults: {
      // taken from here https://github.com/alt3/sequelize-to-json-schemas/issues/17
      schemasGenerator(service) {
        if (service.options && service.options.Model) {
          const modelSchema = app
            .get("jsonSchemaManager")
            .generate(
              service.options.Model,
              app.get("openApi3Strategy"),
              service.options.Model.options.jsonSchema
            );

          return {
            [service.options.Model.name]: modelSchema,
            [`${service.options.Model.name}_list`]: {
              title: `${service.options.Model.name} list`,
              type: "array",
              items: {
                $ref: `#/components/schemas/${service.options.Model.name}`,
              },
            },
          };
        }
      },
    },
    ignore: {
      tags: ["authentication", "login", "mails", "verify-email", "e-modules"], // global ignore for tags (endpoints)
    },
    ui: swagger.swaggerUI(),
  })
);

app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
