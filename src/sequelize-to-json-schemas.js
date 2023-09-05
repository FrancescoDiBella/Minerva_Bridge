const {
  JsonSchemaManager,
  OpenApi3Strategy,
} = require("@alt3/sequelize-to-json-schemas");

module.exports = function init(app) {
  const schemaManager = new JsonSchemaManager({
    baseUri: "https://api.example.com",
    absolutePaths: true,
  });

  const openApi3Strategy = new OpenApi3Strategy();

  app.set("jsonSchemaManager", schemaManager);
  app.set("openApi3Strategy", openApi3Strategy);
};
