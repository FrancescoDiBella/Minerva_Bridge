// See https://sequelize.org/master/manual/model-basics.html
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const lms = sequelizeClient.define('lms', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    baseURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statementsType: {
      type: DataTypes.ENUM('XAPI', 'SCORM'),
      allowNull: false
    },
    secret:{
      type: DataTypes.STRING,
      allowNull: false
    },
    verified:{
      type: DataTypes.BOOLEAN,
      default: false,
      allowNull: false
    },
    authUsername:{
      type: DataTypes.STRING,
      allowNull: true
    },
    authPassword:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  lms.associate = function (models) {
    lms.hasMany(models.utenti, {foreignKey: 'idLms'});
  };

  return lms;
};


