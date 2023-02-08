// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const getAuthCode = sequelizeClient.define('authCodes', {
    idLms:{
      type: DataTypes.STRING,
      allowNull: true,
      unique:true
    },
    idUsr:{
      type: DataTypes.STRING,
      allowNull: true,
      unique:true
    },
    idApp3D: {
      type: DataTypes.STRING,
      allowNull: false
    },
    authCode:{
      type: DataTypes.STRING,
      allowNull: false
    },
    validated:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  },
  {
    unique:{
      fields:['idApp3D', 'authCode']
    }
  }
  ,{
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  getAuthCode.associate = function (models) {
    // Define associations here
    // See https://sequelize.org/master/manual/assocs.html
  };

  return getAuthCode;
};
