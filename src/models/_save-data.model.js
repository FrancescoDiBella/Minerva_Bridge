// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require("sequelize");
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get("sequelizeClient");
  const saveData = sequelizeClient.define(
    "saveData",
    {
      data: {
        type: DataTypes.BLOB,
        allowNull: false,
      }
    }
  );

  saveData.sync({ alter: true });

  return saveData;
};
