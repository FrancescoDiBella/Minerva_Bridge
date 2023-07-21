// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const storeSaveDatas = sequelizeClient.define('saves', {
    data: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_utenza:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  storeSaveDatas.associate = function (models) {
    storeSaveDatas.belongsTo(models.utenti);
  };

  return storeSaveDatas;
};
