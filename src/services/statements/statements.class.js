const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
const hook = require('../../models/hook.model')
var TinCan = require('tincanjs');
const jsonld = require('jsonld');
const axios = require('axios')
const { BadRequest } = require('@feathersjs/errors');

exports.Statements = class Statements {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;

    const endpoint = app.get("lrsql").endpoint;
    const username = app.get("lrsql").username;
    const password = app.get("lrsql").password;

    this.lrs;

    try {
        this.lrs = new TinCan.LRS(
            {
                endpoint: endpoint,
                username: username,
                password: password,
                allowFail: false
            }
        );
        console.log(this.lrs)
    }
    catch (ex) {
        throw new Error("Failed to setup LRS object: " + ex);
    }
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

    //await this.traverseObject(save_data)

    if(true){
      /*
        _hook.type == 'XAPI'
        fare check sul valore di save_data['hasValue']['value']['contextOption']["@type"], switch case per settare al meglio l'oggetto che definisce l'estensione
      */
      //rivedere per intero la logica della routine

      const {identifier, parameter, object, value, timestamp} = save_data;

      //const names_tmp = save_data['id'].split(':');
      //const target_name = names_tmp[names_tmp.length - 1]

      /*
      var context = {
        extensions: {
          "http://example.org/xapi/extensions/unity": {
            scene: names_tmp[5],
            object: target_name
          },
          "http://id.tincanapi.com/extension/3dObjectsProperties": {
            properties: save_data['properties'].value
          }
        }
      };
      */

      var targetId = "";
      var contextPropertyValue = "";

      if(object!=undefined){
        targetId = idUsr+":"+object;
      }else if(value != undefined){
        contextPropertyValue = value;
      }


      const statement = {
        "actor": {
          "mbox": "mailto:"+idUsr+"@example.org",
          "name": "Utente "+idUsr
        },
        "verb": {
          "id": "http://example.org/verb/did",
          "display": { "en-US": "Did" }
        },
        "object": {
          "id": "http://example.org/activity/activity-1",
          "definition": {
            "name": { "en-US": "Activity 1" },
            "type": "http://example.org/activity-type/generic-activity"
          }
        },
        "context":{
          "extensions": {
            "http://example.org/xapi/extensions/playcanvas": {
              "value": JSON.stringify(save_data)
            }
          }
        }
      }


      var statementSaved = false;
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

        statementSaved = true;
      } catch (err) {
        console.log(err.message);
      }

      var _token = null;
      await axios.get("https://sfera.elogos.cloud/scorms/getToken")
      .then(response => {
        _token = response.data.token;
      })
      .catch(error => {
        console.error('Errore:', error);
      });

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
        throw new Error("Errore interno, riprova!");
      }
    }//
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
};
