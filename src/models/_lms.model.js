// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const lms = sequelizeClient.define(
    "lms",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      baseURL: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statementsType: {
        type: DataTypes.ENUM("XAPI", "SCORM"),
        allowNull: false,
      },
      secret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authUsername: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authPassword: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idAdmin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["name", "idAdmin"],
        },
      ],
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  lms.sync({ alter: true });
  // eslint-disable-next-line no-unused-vars
  lms.associate = function (models) {
    // console.log(models);
    lms.hasMany(models.utenti, { foreignKey: "idLms" });
    lms.hasMany(models.authCodes, { foreignKey: "idLms" });
    lms.belongsTo(models.admins, { foreignKey: "idAdmin" });
  };

  return lms;
};
