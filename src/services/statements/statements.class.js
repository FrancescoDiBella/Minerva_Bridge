const _utenti = require('../../models/access.model');
const _lmsModel = require('../../models/lms.model');
const getAuth = require('../../models/get-auth-code.model');
const axios = require('axios')
const { BadRequest } = require('@feathersjs/errors');
const lmsModel = require('../../models/lms.model');
const {ngsild} = require('../../ngsild.js');

exports.Statements = class Statements {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    //array dei valori accettati da lesson_status
    this.lesson_status = ["passed", "completed", "failed", "incomplete", "browsed", "not attempted"];
    //mappa dei parametri usati nelle richieste HTTP per cnmvertirli in quelli SCORM
    this.scormMap = {
      "score": "cmi.core.score.raw",
      "masteryscore": "adlcp:masteryscore",
      "mastery_score": "cmi.student_data.mastery_score",
      "launch_data": "cmi.launch_data",
      "suspend_data": "cmi.suspend_data",
      "lesson_location": "cmi.core.lesson_location",
      "progress": "cmi.core.lesson_status",
      "entry": "cmi.core.entry",
      "exit": "cmi.core.exit",
      "time": "cmi.core.total_time",
      "session_time": "cmi.core.session_time",
      "student_id": "cmi.core.student_id",
      "student_name": "cmi.core.student_name"
    }
    this.maxAcceptableErrors = 2;
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

    const getAuthModel = getAuth(this.app);
    const lmsModel = _lmsModel(this.app);
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

    //controllare quale sia il baseURL dell'LMS associato
    const _lms = await lmsModel.findOne({
      where: {
        id: idLms
      }
    });

    const baseURL = _lms.baseURL;
    const statementType = _lms.statementsType;
    const postfix = _utente.postfix;
    const authToken = _utente.commitToken;
    const key = _lms.authUsername;
    const secret = _lms.authPassword;

    if(!_utente){
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    var statements = [];
    if(statementType == "XAPI"){
      //routine per XAPI
      for(let i = 0; i < save_data.length; i++){
        //routine per statement
        statements[i] = await this.generateXAPIStatement(save_data[i], idUsr, idLms, idApp3D);
      }
      //send XAPI data to LRS
      const res = await this.sendXAPIStatements(statements, baseURL, postfix, authToken, key, secret);
      const ngsi = await this.generateNGSILD(save_data, idUsr, idLms, idApp3D, authCode);

      console.log(ngsi)
      return res;
    }else if(statementType == "SCORM"){
      //routine per SCORM
      const scorm = await this.generateSCORMData(save_data,idUsr);
      console.log(scorm);
      //se è stato generato un oggetto SCORM
      //invia i dati SCORM
      if(scorm != null){
        const resp = await this.sendSCORMData(scorm, baseURL, postfix, authToken, key, secret);
        return resp;
      }
      return {statusMsg:"Non erano presenti statements SCORM da inviare all'LMS! Inviati solo NGSI-LD"};
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
    if(value !=undefined){
      const statement = {
        "actor": {
          "mbox": "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+identifier+"@minerva.sferainnovazione.com",
          "name": idUsr+"."+idLms+'.'+idApp3D+'.'+identifier
        },
        "verb": {
          "id": "http://minerva.sferainnovazione.com/verb/isContainedIn",
          "display": { "en-US": "isContainedIn" }
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
    }else if(object != undefined){
      const statement = {
        "actor": {
          "mbox": "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+identifier+"@minerva.sferainnovazione.com",
          "name": idUsr+"."+idLms+'.'+idApp3D+'.'+identifier
        },
        "verb": {
          "id": "http://minerva.sferainnovazione.com/verb/isContainedIn",
          "display": { "en-US": "isContainedIn" }
        },
        "object": {
          "objectType": "Agent",
          "mbox": "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+object+"@minerva.sferainnovazione.com",
          'name': idUsr+"."+idLms+'.'+idApp3D+'.'+object
        },
        "context":{
          "extensions": {
            "http://minerva.sferainnovazione.com/xapi/extensions/properties": {
              "timestamp":timestamp
            }
          }
        }
      }

      statement.context.extensions["http://minerva.sferainnovazione.com/xapi/extensions/properties"][parameter] = "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+object+"@minerva.sferainnovazione.com";
      return statement;
    }else{
      return null;
    }
  }

  async sendXAPIStatements(statements, baseURL, postfix, authToken, key, secret){
    try {
      if(authToken == null){
          const response = await axios.post(
            baseURL + postfix,
            statements,
            {
              auth: {
                username: key,
                password: secret,
              },

              headers: {
                'Content-Type': 'application/json',
                'X-Experience-API-Version' : '1.0.2'
              },
            },
          );
          console.log(response.data)
          return {statusMsg:"Statements salvati correttamente!"};
      }else{
        const response = await axios.post(
          baseURL + postfix,
          statements,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Experience-API-Version' : '1.0.2',
              'Authorization': 'Bearer '+authToken,
            },
          },
        );
        console.log(response.data);
        return {statusMsg:"Statements salvati correttamente!"};
      }

    } catch (err) {
      return new BadRequest("Errore, Statements non salvati! Dettagli: "  + err);
    }
  }

  //controlla se è presente l'identifier 'defaultplayer'
  //che determina la creazione di un oggetto SCORM
  async areSCORMStatementsValid(data){
    for(let i = 0; i < data.length; i++){
      const {identifier} = data[i];
      if(identifier == "defaultplayer"){
        console.log("defaultplayer!");
        return true;
      }
    }
    console.log("not defaultplayer!");
    return false;
  }

  //controlla se il valore ha un tipo valido per SCORM
  //es. score deve essere un numero
  //es. progress deve essere uno dei valori accettati
  async isSCORMValueValid(parameter, value){
    switch(parameter){
      case "score":
      case "masteryscore":
      case "mastery_score":
        if(!this.isNumber(value)){
          return false;
        }
        break;
      case "progress":
        if(!this.lesson_status.includes(value)){
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  }

  //genera un oggetto SCORM
  async generateSCORMData(data, idUsr){
    //controlla se è presente l'identifier 'defaultplayer'
    const isDefaultPlayer = await this.areSCORMStatementsValid(data);
    if(!isDefaultPlayer){
      return null;
    }

    //oggetto SCORM da base
    const scorm = {
      "data" : [
          {
              "element":"cmi.core.score.raw",
              "value":"10"
          },
          {
              "element":"adlcp:masteryscore",
              "value":"10"
          },
          {
              "element":"cmi.student_data.mastery_score",
              "value":"10"
          },
          {
              "element":"cmi.launch_data",
              "value":"launch_data"
          },
          {
              "element":"cmi.suspend_data",
              "value": JSON.stringify(data)
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
          },
          {
              "element":"cmi.core.student_id",
              "value":idUsr
          },
          {
              "element":"cmi.core.student_name",
              "value":null
          },]
    };

    //varibile che trova gli errori, al momento gestiamo così quanti errori accettabili ci sono
    var isNotAccepted = 0;

    //per ognuno degli oggetti preleviamo il parametro e il valore
    //e li inseriamo nell'oggetto SCORM se sono presenti nella mappa
    for(let i = 0; i < data.length; i++){
      const {identifier, parameter, value, timestamp} = data[i];
      if(identifier != "defaultplayer"){
        continue;
      }
      scorm.data[scorm.data.length - 1].value = "defaultplayer";
      for(let j = 0; j < scorm.data.length; j++){
        const _param = this.scormMap[parameter];
        if(_param == undefined){
          continue;
        }

        if(scorm.data[j].element == _param){
          //se il valore non è valido per SCORM
          //non inserirlo nell'oggetto SCORM
          if(!this.isSCORMValueValid(_param, value)){
            isNotAccepted++;
            continue;
          }
          scorm.data[j].value = value;
        }
      }
    }

    //se ci sono più di due errori accettabili
    //non inviare l'oggetto SCORM
    if(isNotAccepted >= this.maxAcceptableErrors){
      return null;
    }
    return scorm;
  }

  async sendSCORMData(statement, baseURL, postfix, authToken, key, secret){
    try {
      //se il postfix non inizia con / aggiungilo, altrimenti lascialo così
      const _postfix = postfix.indexOf('/') == 0 ? postfix : '/'+postfix;
      if(authToken == null){
          const response = await axios.post(
            baseURL + _postfix,
            statement,
            {
              auth: {
                username: key,
                password: secret,
              },

              headers: {
                'Content-Type': 'application/json'
              },
            },
          );
          console.log(response.data, response.status);
          if(response.status == 200 || response.status == 201){
            return {statusMsg:"Statements salvati correttamente!"};
          }else{
            return BadRequest("Errore, Statements non salvati! Dettagli: "  + response.data);
          }
      }else{
        const response = await axios.post(
          baseURL + _postfix,
          statement,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+authToken
            },
          },
        );
          if(response.status == 200 || response.status == 201){
            return {statusMsg:"Statements salvati correttamente!"};
          }else{
            return new BadRequest("Errore, Statements non salvati! Dettagli: "  + response.data);
          }
      }

    } catch (err) {
      return new BadRequest("Errore, Statements non salvati! Dettagli: "  + err);
    }
  }

  //controllo se è un numero anche se è una stringa
  async isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

  //routine per generare entità NGSILD
  async generateNGSILD(data, idUsr, idLms, idApp3D, authCode){
    //genera NGSILD
    const ngsildObj = new ngsild("urn:ngsi-ld:Minerva:XAPIStatement:0001",
        "XAPIStatement",
        [{
          name : "color",
          value : {
            "type": "Property",
            "value": "red"
          }
        },
        {
          name : "mbox",
          value : {
            "type": "Property",
            "value": "mailto:"+idUsr+"."+idLms+'.'+idApp3D+'.'+authCode+"@minerva.sferainnovazione.com"
          }
        },],
        [{
          name : "hasObject",
          value : {
            "type": "Relationship",
            "object": "urn:ngsi-ld:Building:001"
          }
        }],
        [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://schema.lab.fiware.org/ld/context"
        ]
        );

    return ngsildObj.generateEntity();
  }
};
