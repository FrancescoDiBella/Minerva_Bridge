const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
var TinCan = require('tincanjs');
const jsonld = require('jsonld');
const axios = require('axios')
const { BadRequest } = require('@feathersjs/errors');

exports.Statements = class Statements {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    const {payload} = params.clientData;

    const {idUsr} = payload;
    const {idLms} = payload
    const {authCode} = payload
    const {idApp3D} = payload

    const save_data = data;

    console.log(idUsr, idLms, authCode, idApp3D, save_data);
    console.log("save_data:", save_data);

    const getAuthModel = getAuth(this.app);
    const lmsModel = _utenti(this.app);
    //const getHook = hook(this.app);
    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3D,
        authCode: authCode,
        validated: true
      }
    });

    //controllare quale sia l'hook corrispondente all'IdLms
    /*
    const _hook = await getHook.findOne({
      where: {
        idLms
      }
    })
    */

    if(!_utente){
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }
    /*
    const _lms = await lmsModel.findOne({
      where: {
        id: idLms
      }
    });

    if(_lms.statementType == "XAPI"){
      //routine per XAPI
      for(let i = 0; i < save_data.length; i++){
        //routine per statement
        //scorporare il codice attuale in una funzione
        const statement = await this.generateXAPIStatement(save_data[i]);
        //send XAPI statement to LRS
        const res = await this.sendXAPIStatement(statement);
      }
    }else if(_lms.statementType == "SCORM"){
      //routine per SCORM
      for(let i = 0; i < save_data.length; i++){
        //routine per statement
        //scorporare il codice attuale in una funzione
        const scorm = await this.generateSCORMData(save_data[i]);
        //send SCORM data to SCORM server
        const res = await this.sendSCORMData(scorm);
      }
    }
    */
    //controllo sul statementType dell'lms associato all'utente
    if(true){
      var statement = null;
      var result = [];
      for(let i = 0; i < save_data.length; i++){
        //routine per statement
        //scorporare il codice attuale in una funzione
        statement = await this.generateXAPIStatement(save_data[i], idUsr, idLms, idApp3D);
        //send XAPI statement to LRS
        const res = await this.sendXAPIStatement(statement);
        result[i] = res;
      }
      //aggiungere codice che prende token e postfix dal db
      //codice che fa la chiamata al server lms per salvare i dati

      //distinguere se XAPI O SCORM
      var _token = null;
      /*
        await axios.get("https://sfera.elogos.cloud/scorms/getToken")
        .then(response => {
          _token = response.data.token;
        })
        .catch(error => {
          console.error('Errore:', error);
        });
      */

      if(_token != null){
        const config = {
          'headers': {
            'Authorization': 'Bearer '+_token,
            'Content-Type': 'application/json'
          }
        };

        console.log(JSON.stringify(save_data));

        const scorm = {
          "id_member" : "1",
          "id_modulo" : "1",
          "data" : [
              {
                  "element":"cmi.core.score.raw",
                  "value":"100"
              },
              {
                  "element":"adlcp:masteryscore",
                  "value":"100"
              },
              {
                  "element":"cmi.student_data.mastery_score",
                  "value":"100"
              },
              {
                  "element":"cmi.launch_data",
                  "value":"launch_data"
              },
                {
                  "element":"cmi.suspend_data",
                  "value": JSON.stringify(save_data)
              },
              {
                  "element":"cmi.core.lesson_location",
                  "value":"lesson_location"
              },
              {
                  "element":"cmi.core.lesson_status",
                  "value":"incomplete"
              },
              {
                  "element":"cmi.core.lesson_location",
                  "value":"lesson_location"
              },
              {
                  "element":"cmi.core.entry",
                  "value":"entry"
              },
              {
                  "element":"cmi.core.exit",
                  "value":"exit"
              },
              {
                  "element":"cmi.core.total_time",
                  "value":"12:00:12"
              },
              {
                  "element":"cmi.core.session_time",
                  "value":"05:00:00"
              }]
      };

        await axios.post('https://sfera.elogos.cloud/scorms/commit', scorm, config)
        .then(response => {
          statementSaved = true;
          console.log(response);
          return "SCORM DATA SAVED!"
        })
        .catch(error => {
          console.error('Errore:', error);
          return "SCORM DATA NOT SAVED!"
        });

        if(statementSaved){
          return {statusMsg:"Statement salvato correttamente!"};
        }else{
          throw new Error("Statement non salvato! Riprovare più tardi.");
        }

      }else{
        //throw new Error("Errore interno, riprova!");
        return result;
      }


    }
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }

  async generateXAPIStatement(data, idUsr, idLms, idApp3D){
    const {identifier, parameter, object, value, timestamp} = data;
    const statement = {
      "actor": {
        "mbox": "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+identifier+"@minerva.sferainnovazione.com",
        "name": "Utente "+idUsr
      },
      "verb": {
        "id": "http://minerva.sferainnovazione.com/verb/isContainedIn",
        "display": { "en-US": "Did" }
      },
      "object": {
        "id": "http://minerva.sferainnovazione.com/activity/3dApp/"+idApp3D,
        "definition": {
          "name": { "en-US": "E-learning 3D Application." },
          "type": "http://minerva.sferainnovazione.com/activity-type/e-learning"
        }
      },
      "context":{
        "extensions": {
          "http://minerva.sferainnovazione.com/xapi/extensions/properties": {
            "timestamp":timestamp
          }
        }
      }
    }

    statement.context.extensions["http://minerva.sferainnovazione.com/xapi/extensions/properties"][parameter] = value;

    return statement;
  }

  async generateSCORMData(data){
    return {msg : 'ciao'}
  }

  async sendXAPIStatement(statement){
    try {
      const response = await axios.post(
        this.app.get("lrsql").endpoint,
        statement,
        {
          auth: {
            username: this.app.get("lrsql").username,
            password: this.app.get("lrsql").password,
          },

          headers: {
            'Content-Type': 'application/json',
            'X-Experience-API-Version' : '1.0.2'
          },
        },
      );

      return {statusMsg:"Statement salvato correttamente!", statementId: response.data};
    } catch (err) {
      return {statusMsg:"Statement non salvato!", statementId: null};
    }
  }

  async sendSCORMData(data){
    return {msg : 'ciao'}
  }
};
