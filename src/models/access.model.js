// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const utenti = sequelizeClient.define('utenti', {
    idUsr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idLms: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idApp3D: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    unique:{
      fields:['idUsr', 'idLms', 'idApp3D']
    }
  }
  , {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  utenti.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return utenti;
};




