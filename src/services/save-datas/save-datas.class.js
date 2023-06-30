/* eslint-disable no-unused-vars */
const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
const hook = require('../../models/hook.model')
var TinCan = require('tincanjs');
const jsonld = require('jsonld');
const axios = require('axios')
const { BadRequest } = require('@feathersjs/errors');

exports.SaveDatas = class SaveDatas {
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
    }
    catch (ex) {
        console.log("Failed to setup LRS object: ", ex);
        // TODO: do something with error, can't communicate with LRS
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
    //console.log(data)
    const {save_data, payload} = data;

    const {idUsr} = payload;
    const {idLms} = payload
    const {authCode} = payload
    const {idApp3d} = payload

    const getAuthModel = getAuth(this.app);
    const getHook = hook(this.app);

    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3d,
        authCode: authCode,
        validated: true
      }
    });

    //controllare quale sia l'hook corrispondente all'IdLms
    const _hook = await getHook.findOne({
      where: {
        idLms
      }
    })

    if(!_utente){
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    await this.traverseObject(save_data)

    if(_hook.type == 'XAPI'){
      /*
        fare check sul valore di save_data['hasValue']['value']['contextOption']["@type"], switch case per settare al meglio l'oggetto che definisce l'estensione
      */


      //rivedere per intero la logica della routine
      const names_tmp = save_data['id'].split(':');
      const target_name = names_tmp[names_tmp.length - 1]

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

      var statement = new TinCan.Statement(
        {
            actor: {
                //mbox: "mailto:info@tincanapi.com",
                name: idUsr,
                account: {
                  homePage: "http://"+idUsr+".com",
                  name: idUsr
                }
            },
            verb: {
                id: "https://test.org/verbs/"+save_data['verb'].value.display.text['en-us'],
                display: save_data['verb'].value.display.text
            },
            target: {
                id: 'http://example.org/Minerva/'+target_name
            },
            context
        }
      );

      this.lrs.saveStatement(
        statement,
        {
          callback: function (err, xhr) {
              if (err !== null) {
                  if (xhr !== null) {
                      console.log("Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")");
                      // TODO: do something with error, didn't save statement
                      return {statusMsg:"Failed to save statement: " + xhr.responseText + " (" + xhr.status + ")"};
                  }

                  console.log("Failed to save statement: " + err);
                  // TODO: do something with error, didn't save statement
                  return {statusMsg:"Failed to save statement: " + err};
              }

              console.log("Statement saved");
              // TOOO: do something with success (possibly ignore)
          }
        }
      );
    }else if(_hook.type == 'SCORM'){
      //routine che prende l'URL del server al quale inviare la roba che ci arriva
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
          "id_modulo" : "2",
          "data" : [
              {
                  "element":"cmi.core.score.raw",
                  "value": save_data.score
              },
              {
                  "element":"adlcp:masteryscore",
                  "value":save_data.score
              },
              {
                  "element":"cmi.student_data.mastery_score",
                  "value":save_data.score
              },
              {
                  "element":"cmi.launch_data",
                  "value":"launch_data"
              },
                {
                  "element":"cmi.suspend_data",
                  "value":save_data.minerva_data
              },
              {
                  "element":"cmi.core.lesson_location",
                  "value":"lesson_location"
              },
              {
                  "element":"cmi.core.lesson_status",
                  "value":"progress"
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
                  "value":"02:00:12"
              },
              {
                  "element":"cmi.core.session_time",
                  "value":"01:00:00"
              }]
          };

        await axios.post('https://sfera.elogos.cloud/scorms/commit', scorm, config)
        .then(response => {
          return "SCORM DATA SAVED!"
        })
        .catch(error => {
          console.error('Errore:', error);
          return "SCORM DATA NOT SAVED!"
        });
      }else{
        throw new Error("Errore interno, riprova!");
      }
    }


    return {statusMsg:"Change saved"};
  }

  async toSCORM(obj){
    //routine di standardizzazione in oggeto SCORM compatibile
  }

  async traverseObject(obj) {
    for (const prop in obj) {
      if (typeof obj[prop] === "object") {
        await this.traverseObject(obj[prop]);
      } else {
        console.log(`${prop}: ${obj[prop]}`);
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
};
