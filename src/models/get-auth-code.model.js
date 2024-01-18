// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const getAuthCode = sequelizeClient.define(
    "authCodes",
    {
      idLms: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idUsr: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idApp3D: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      authCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
      commitToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postfix: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tokenRequested: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["idApp3D", "authCode"],
        },
      ],
      hooks: {
        beforeCount(options) {
          options.raw = true;
        },
      },
    }
  );

  getAuthCode.sync({ alter: true });

  // eslint-disable-next-line no-unused-vars
  getAuthCode.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
    getAuthCode.belongsTo(models.lms, { foreignKey: "idLms" });
    getAuthCode.belongsTo(models.utenti, { foreignKey: "idUsr" });
  };

  return getAuthCode;
};
