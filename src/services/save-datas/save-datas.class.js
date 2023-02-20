/* eslint-disable no-unused-vars */
const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
const hook = require('../../models/hook.model')
var TinCan = require('tincanjs');

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
    const {datas, payload} = data;

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
      return {statusMsg:"Errore, token errato o authCode non verificato"};
    }

    if(_hook.type == 'XAPI'){
      //richiamare routine di salvataggio dei dati
      var statement = new TinCan.Statement(
        {
            actor: {
                //mbox: "mailto:info@tincanapi.com",
                //idUsr: idUsr
                name: idUsr,
                account: {
                  homePage: "http://.com",
                  name: idUsr
                }
            },
            verb: {
                id: "http://adlnet.gov/expapi/verbs/experienced"
            },
            target: {
                id: "http://rusticisoftware.github.com/TinCanJS"
            }
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
    }


    return {statusMsg:"Statement saved"};
  }

  async toSCORM(obj){
    //routine di standardizzazione in oggeto SCORM compatibile
    //decidere i campi a cosa equivalgano
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
