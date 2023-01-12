/* eslint-disable no-unused-vars */
const _utenti = require('../../models/access.model');
const getAuth = require('../../models/get-auth-code.model');
var TinCan = require('tincanjs');

exports.SaveDatas = class SaveDatas {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;

    const endpoint = "http://127.0.0.1:8080/xapi";
    const username = "a1f579f1d31500af981ceb1c942629c8eaa6c5105b7db28171231ddaf7442a11";
    const password = "342cd8b7ea56119fabe4e03efc503e42922522b555277bcefd182dd34b2cc9d8";

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

    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        authCode: authCode,
        validated: true
      }
    });

    if(!_utente){
      return {statusMsg:"Errore, token errato o authCode non verificato"};
    }

    //richiamare routine di salvataggio dei dati
    var statement = new TinCan.Statement(
      {
          actor: {
              mbox: "mailto:info@tincanapi.com"
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

    return {statusMsg:"Statement saved"};
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
