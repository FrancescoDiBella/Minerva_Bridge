const _utenti = require("../../models/access.model");
const _lmsModel = require("../../models/_lms.model");
const getAuth = require("../../models/get-auth-code.model");
const axios = require("axios");
const { BadRequest } = require("@feathersjs/errors");
const lmsModel = require("../../models/_lms.model");
const { ngsild } = require("../../ngsild.js");


exports.Statements = class Statements {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
    //array dei valori accettati da lesson_status
    this.lesson_status = [
      "passed",
      "completed",
      "failed",
      "incomplete",
      "browsed",
      "not attempted",
    ];
    //mappa dei parametri usati nelle richieste HTTP per cnmvertirli in quelli SCORM
    this.scormMap = {
      score: "cmi.core.score.raw",
      masteryscore: "adlcp:masteryscore",
      mastery_score: "cmi.student_data.mastery_score",
      launch_data: "cmi.launch_data",
      suspend_data: "cmi.suspend_data",
      lesson_location: "cmi.core.lesson_location",
      progress: "cmi.core.lesson_status",
      entry: "cmi.core.entry",
      exit: "cmi.core.exit",
      time: "cmi.core.total_time",
      session_time: "cmi.core.session_time",
      student_id: "cmi.core.student_id",
      student_name: "cmi.core.student_name",
    };
    this.maxAcceptableErrors = 2;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const { payload } = params.clientData;

    const { idUsr } = payload;
    const { idLms } = payload;
    const { authCode } = payload;
    const { idApp3D } = payload;

    const save_data = data;
    console.log(save_data);
    const getAuthModel = getAuth(this.app);
    const lmsModel = _lmsModel(this.app);
    //const getHook = hook(this.app);
    const _utente = await getAuthModel.findOne({
      where: {
        idLms: idLms,
        idUsr: idUsr,
        idApp3D: idApp3D,
        authCode: authCode,
        validated: true,
      },
    });

    //controllare quale sia il baseURL dell'LMS associato
    const _lms = await lmsModel.findOne({
      where: {
        id: idLms,
      },
    });

    const baseURL = _lms.baseURL;
    const statementType = _lms.statementsType;
    const postfix = _utente.postfix;
    const authToken = _utente.commitToken;
    const key = _lms.authUsername;
    const secret = _lms.authPassword;

    if (!_utente) {
      throw new BadRequest("Errore, token errato o authCode non verificato");
    }

    var statements = [];
    console.log("statementType", statementType);
    if (statementType == "XAPI") {
      //routine per XAPI
      for (let i = 0; i < save_data.length; i++) {
        //routine per statement XAPI
        statements[i] = await this.generateXAPIStatement(
          save_data[i],
          idUsr,
          idLms,
          idApp3D
        );
      }
      //send XAPI data to LRS
      const res = await this.sendXAPIStatements(
        statements,
        baseURL,
        postfix,
        authToken,
        key,
        secret
      );
      const ngsiArray = await this.generateNGSILD(
        save_data,
        idUsr,
        idLms,
        idApp3D,
        authCode
      );
      const ngsi = ngsiArray.ngsildObjs;
      const mod = ngsiArray.sendModId;
      console.log("NGSILD", ngsi);
      console.log("MOD", mod);
      const ngsiRes = await this.sendNGSILD(ngsi, mod);
      console.log("NGSILD RESP", ngsiRes);
      return res;
    } else if (statementType == "SCORM") {
      //routine per SCORM
      const ngsiArray = await this.generateNGSILD(
        save_data,
        idUsr,
        idLms,
        idApp3D,
        authCode
      );
      const ngsi = ngsiArray.ngsildObjs;
      const mod = ngsiArray.sendModId;

      const scorm = await this.generateSCORMData(save_data, idUsr);
      //console.log(scorm);
      //se è stato generato un oggetto SCORM
      //invia i dati SCORM
      const ngsiRes = await this.sendNGSILD(ngsi, mod);
      console.log("NGSILD RESP", ngsiRes);
      if (scorm != null) {
        const resp = await this.sendSCORMData(
          scorm,
          baseURL,
          postfix,
          authToken,
          key,
          secret
        );
        return resp;
      }
      return {
        statusMsg:
          "Non erano presenti statements SCORM da inviare all'LMS! Inviati solo NGSI-LD",
      };
    }
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }

  async generateXAPIStatement(data, idUsr, idLms, idApp3D) {
    const { identifier, parameter, object, value, timestamp } = data;
    if (value != undefined) {
      const statement = {
        actor: {
          mbox:
            "mailto:" +
            idUsr +
            "." +
            idLms +
            "." +
            idApp3D +
            "." +
            "@minerva.sferainnovazione.com",
          name: idUsr + "." + idLms + "." + idApp3D,
        },
        verb: {
          id: "http://minerva.sferainnovazione.com/verb/"+ identifier,
          display: { "en-US": identifier },
        },
        object: {
          id: "http://minerva.sferainnovazione.com/activity/3dApp/" + idApp3D + "/" + parameter,
          definition: {
            name: { "en-US": value },
            type: "http://minerva.sferainnovazione.com/activity-type/e-learning",
          },
        },
        context: {
          extensions: {
            "http://minerva.sferainnovazione.com/xapi/extensions/properties": {
              timestamp: timestamp,
            },
          },
        },
      };

      statement.context.extensions[
        "http://minerva.sferainnovazione.com/xapi/extensions/properties"
      ][parameter] = value;
      return statement;
    } else if (object != undefined) {
      const statement = {
        actor: {
          mbox:
            "mailto:" +
            idUsr +
            "." +
            idLms +
            "." +
            idApp3D +
            "." +
            identifier +
            "@minerva.sferainnovazione.com",
          name: idUsr + "." + idLms + "." + idApp3D + "." + identifier,
        },
        verb: {
          id: "http://minerva.sferainnovazione.com/verb/isContainedIn",
          display: { "en-US": "isContainedIn" },
        },
        object: {
          objectType: "Agent",
          mbox:
            "mailto:" +
            idUsr +
            "." +
            idLms +
            "." +
            idApp3D +
            "." +
            object +
            "@minerva.sferainnovazione.com",
          name: idUsr + "." + idLms + "." + idApp3D + "." + object,
        },
        context: {
          extensions: {
            "http://minerva.sferainnovazione.com/xapi/extensions/properties": {
              timestamp: timestamp,
            },
          },
        },
      };

      statement.context.extensions[
        "http://minerva.sferainnovazione.com/xapi/extensions/properties"
      ][parameter] =
        "mailto:" +
        idUsr +
        "." +
        idLms +
        "." +
        idApp3D +
        "." +
        object +
        "@minerva.sferainnovazione.com";
      return statement;
    } else {
      return null;
    }
  }

  async sendXAPIStatements(
    statements,
    baseURL,
    postfix,
    authToken,
    key,
    secret
  ) {
    try {
      if (authToken == null) {
        const response = await axios.post(baseURL + postfix, statements, {
          auth: {
            username: key,
            password: secret,
          },

          headers: {
            "Content-Type": "application/json",
            "X-Experience-API-Version": "1.0.2",
          },
        });
        //console.log(response.data);
        return { statusMsg: "Statements salvati correttamente!" };
      } else {
        const response = await axios.post(baseURL + postfix, statements, {
          headers: {
            "Content-Type": "application/json",
            "X-Experience-API-Version": "1.0.2",
            Authorization: "Bearer " + authToken,
          },
        });
        //console.log(response.data);
        return { statusMsg: "Statements salvati correttamente!" };
      }
    } catch (err) {
      return new BadRequest("Errore, Statements non salvati! Dettagli: " + err);
    }
  }

  //controlla se è presente l'identifier 'defaultplayer'
  //che determina la creazione di un oggetto SCORM
  async areSCORMStatementsValid(data) {
    for (let i = 0; i < data.length; i++) {
      const { identifier } = data[i];
      if (identifier == "defaultplayer") {
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
  isSCORMValueValid(parameter, value) {
    console.log("SCORM VALUE VALID", parameter, value);
    switch (parameter) {
      case "score":
      case "masteryscore":
      case "mastery_score":
        if (!this.isNumber(value)) {
          return false;
        }
        break;
      case "progress":
        return true;
        /*
        if(!this.lesson_status.includes(value)){
          console.log("progress not valid");
          return false;
        }*/
        break;
      default:
        break;
    }
    return true;
  }

  //genera un oggetto SCORM
  async generateSCORMData(data, idUsr) {
    //controlla se è presente l'identifier 'defaultplayer'
    const isDefaultPlayer = await this.areSCORMStatementsValid(data);
    if (!isDefaultPlayer) {
      return null;
    }

    //oggetto SCORM da base
    const scorm = {
      data: [
        {
          element: "cmi.core.score.raw",
          value: "10",
        },
        {
          element: "adlcp:masteryscore",
          value: "10",
        },
        {
          element: "cmi.student_data.mastery_score",
          value: "10",
        },
        {
          element: "cmi.launch_data",
          value: "launch_data",
        },
        {
          element: "cmi.suspend_data",
          value: JSON.stringify(data),
        },
        {
          element: "cmi.core.lesson_location",
          value: "lesson_location",
        },
        {
          element: "cmi.core.lesson_status",
          value: "incomplete",
        },
        {
          element: "cmi.core.lesson_location",
          value: "lesson_location",
        },
        {
          element: "cmi.core.entry",
          value: "entry",
        },
        {
          element: "cmi.core.exit",
          value: "exit",
        },
        {
          element: "cmi.core.total_time",
          value: "12:00:12",
        },
        {
          element: "cmi.core.session_time",
          value: "05:00:00",
        },
        {
          element: "cmi.core.student_id",
          value: idUsr,
        },
        {
          element: "cmi.core.student_name",
          value: null,
        },
      ],
    };

    //varibile che trova gli errori, al momento gestiamo così quanti errori accettabili ci sono
    var isNotAccepted = 0;

    //per ognuno degli oggetti preleviamo il parametro e il valore
    //e li inseriamo nell'oggetto SCORM se sono presenti nella mappa
    for (let i = 0; i < data.length; i++) {
      const { identifier, parameter, value, timestamp } = data[i];
      if (identifier != "defaultplayer") {
        continue;
      }
      scorm.data[scorm.data.length - 1].value = "defaultplayer";
      for (let j = 0; j < scorm.data.length; j++) {
        const _param = this.scormMap[parameter];
        if (_param == undefined) {
          continue;
        }

        if (scorm.data[j].element == _param) {
          //se il valore non è valido per SCORM
          //non inserirlo nell'oggetto SCORM
          if (!this.isSCORMValueValid(parameter, value)) {
            isNotAccepted++;
            continue;
          }

          if (parameter == "progress") {
            //se il valore è progress
            //inserisci il valore corretto
            //es. "passed" -> "completed"

            if (value) {
              scorm.data[j].value = "completed";
            } else {
              scorm.data[j].value = "incomplete";
            }
          } else {
            scorm.data[j].value = value;
          }
        }
      }

      //console.log(scorm);
    }

    //se ci sono più di due errori accettabili
    //non inviare l'oggetto SCORM
    if (isNotAccepted >= this.maxAcceptableErrors) {
      return null;
    }
    return scorm;
  }

  async sendSCORMData(statement, baseURL, postfix, authToken, key, secret) {
    try {
      //se il postfix non inizia con / aggiungilo, altrimenti lascialo così
      const _postfix = postfix.indexOf("/") == 0 ? postfix : "/" + postfix;
      if (authToken == null) {
        const response = await axios.post(baseURL + _postfix, statement, {
          auth: {
            username: key,
            password: secret,
          },

          headers: {
            "Content-Type": "application/json",
          },
        });
        //console.log(response.data, response.status);
        if (response.status == 200 || response.status == 201) {
          return { statusMsg: "Statements salvati correttamente!" };
        } else {
          return BadRequest(
            "Errore, Statements non salvati! Dettagli: " + response.data
          );
        }
      } else {
        const response = await axios.post(baseURL + _postfix, statement, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        });
        if (response.status == 200 || response.status == 201) {
          return { statusMsg: "Statements salvati correttamente!" };
        } else {
          return new BadRequest(
            "Errore, Statements non salvati! Dettagli: " + response.data
          );
        }
      }
    } catch (err) {
      return new BadRequest("Errore, Statements non salvati! Dettagli: " + err);
    }
  }

  //controllo se è un numero anche se è una stringa
  async isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  //routine per generare entità NGSILD
  async generateNGSILD(array, idUsr, idLms, idApp3D, authCode) {
    //genera NGSILD
    let identifiers = [];
    let sendModId = [];

    // Aggiungi gli identificatori unici presenti nell'array `array` all'array `identifiers`
    for (let i = 0; i < array.length; i++) {
      if (identifiers.indexOf(array[i].identifier) == -1) {
        identifiers.push(array[i].identifier);
      }
    }

    let objs = {};
    for (const identifier of identifiers) {
      //per ogni identificatore crea una coppia chiave valore sull'array sendModId
      //che contiene l'identificatore e una stringa che indica la modalità di invio
      //di default "upsert"

      sendModId[identifier] = "update";
      const id_p = identifier === "defaultplayer" ? "player" : identifier;
      //type_ è "Player" se l'identificatore è "defaultplayer", se è "scene" è "3DScene", altrimenti è "3DObject"
      const type_ =
        identifier === "defaultplayer"
          ? "Player"
          : identifier === "scene"
          ? "3DScene"
          : "3DObject";
      objs[identifier] = {
        id: `minerva:${idLms}:${idUsr}:${idApp3D}:${id_p}`,
        type: type_,
        properties: [],
        relationships: [],
        //context: ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.6.jsonld"]
      };
    }

    for (let i = 0; i < array.length; i++) {
      const { identifier, parameter, object, value, timestamp } = array[i];
      let _type = undefined;
      if (value != undefined) {

        console.log("value", value);
        //override type if it is specified
        if (parameter == "_type") {
          _type = value;
          objs[identifier].type = _type;
          //se per identifier è presente un oggetto con la chiave _type
          //allora la modalita di invio è "upsert"
          sendModId[identifier] = "upsert";
          continue;
        }
        //if the property name is "gameover" then fetch the value from the broker, add a new property to the current session and continue
        if (parameter == "gameover"){
          let id = identifier;
          const baseURL = this.app.get("brokerURL");
          if(identifier == "defaultplayer"){
            id = "player";
          }

          try{
            const session = await this.getCurrentSession(idUsr, idApp3D, idLms);

            console.log("NGSILD RESP", session);
            //aggiungi all'entità session la proprietà "end" con valore "value"
            const resp = await axios.post(
              baseURL + "ngsi-ld/v1/entityOperations/update?options=noOverwrite",
              [{
                "id": session.id,
                "type": session.type,
                "end": {
                    "type": "Property",
                    "value": timestamp
                }
              }],
              {
                headers: {
                  "Content-Type": "application/json",
                  "Link": this.app.get("ngsildLink"),
                },
              }
            );
            console.log("NGSILD session end RESP", resp);

            //crea una nuova entità di tipo 3DScene con le proprietà copiate da session ma senza "end" property e cambiando i timestamp con quello di gameover e con id e sessionId diverso.
            let randomId = Math.floor(Math.random() * 1000000000);

            let newSession = {
              "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context-v1.6.jsonld"],
              "id": "minerva:" + idLms + ":" + idUsr + ":" + idApp3D + ":scene_"+randomId,
              "type": "3DScene"
            };

            //l'oggetto session è del tipo
            /*
            {
              "id": "minerva:1:1:1:scene_123456789",
              "type": "3DScene",
              "hasObjects": {
                  "type": "Relationship",
                  "object": "minerva:1:1:1:defaultplayer"
                  "observedAt": "2023-11-24T16:21:11.56Z"
              },
              "start": {
                  "type": "Property",
                  "value": "2020-11-12T17:00:00Z"
                  "observedAt": "2023-11-24T16:21:11.56Z"
              },
              "width": {
                  "type": "Property",
                  "value": 100
                  "observedAt": "2023-11-24T16:21:11.56Z"
              }
            }
            */
           //seguendo la struttura di session, crea un oggetto newSession
            //con le proprietà di session ma senza "end" property
            for (const [key, value] of Object.entries(session)) {
              if(key == "end" || key == "id" || key == "type"){
                continue;
              }
              newSession[key] = value;
              //modifica il timestamp di start con quello di gameover
              if(key == "start"){
                newSession[key].value = timestamp;
              }

              if(key == "sessionId"){
                newSession[key].value = randomId.toString();
              }
              //modifica gli observedAt con quello di gameover
              newSession[key].observedAt = timestamp;
            }

            const ngsi = await axios.post(
              baseURL + "ngsi-ld/v1/entities",
              newSession,
              {
                headers: {
                  "Content-Type": "application/ld+json"
                },
              }
            );

            console.log("NGSILD session end RESP", ngsi);
          }
          catch(e){
            console.log("ERRORE NGSILD", e);
          }
        } else {
          objs[identifier].properties.push({
            name: parameter,
            value: {
              type: "Property",
              value: value,
              observedAt: timestamp,
            },
          });
        }
      } else {
        console.log("object", object);

        objs[identifier].relationships.push({
          name: parameter,
          value: {
            type: "Relationship",
            object:
              "minerva:" + idLms + ":" + idUsr + ":" + idApp3D + ":" + object,
          },
        });

        console.log("minerva:" + idLms + ":" + idUsr + ":" + idApp3D + ":" + object);
      }
    }

    let ngsildObjs = new Array(identifiers.length);
    for (let j = 0; j < identifiers.length; j++) {
      const i = identifiers[j];

      const ngsi = new ngsild(
        objs[i].id,
        objs[i].type,
        objs[i].properties,
        objs[i].relationships
      );
      ngsildObjs[j] = ngsi.generateEntity();

    }
    return {ngsildObjs, sendModId};
  }

  async sendNGSILD(ngsildObjs, mod) {
    const baseURL = this.app.get("brokerURL");
    //raggruppa in due array diversi gli oggetti da inviare con upsert e update
    let upsertObjs = [];
    let updateObjs = [];

    //mod mantiene chiave valore, dove chiave è l'identificatore dell'oggetto
    //e valore è la modalità di invio
    //upsert o update. Se è upsert allora pushalo in upsertObjs, altrimenti in updateObjs
    //ngsildObjs è un array di oggetti da inviare, ognuno dei quali ha un identificatore
    //che è la chiave di mod
    //es. mod["defaultplayer"] = "upsert"
    //ngsildObjs[0].id = "minerva:1:1:1:defaultplayer"
    //quindi mod[ngsildObjs[0].id.split(":")[4]] = "upsert"
    for (let i = 0; i < ngsildObjs.length; i++) {
      var id = ngsildObjs[i].id.split(":")[4];
      //se id == "player" allora modifica id in "defaultplayer"
      if (id == "player") {
        id = "defaultplayer";
      }

      if (mod[id] == "upsert") {
        upsertObjs.push(ngsildObjs[i]);
      } else {
        updateObjs.push(ngsildObjs[i]);
      }
    }

    //se ci sono oggetti da inviare con upsert
    //invia gli oggetti con upsert
    if (upsertObjs.length > 0) {
      try {
        const resp = await axios.post(
          baseURL + "ngsi-ld/v1/entityOperations/upsert",
          upsertObjs,
          {
            headers: {
              "Content-Type": "application/json",
              "Link": this.app.get("ngsildLink"),
            },
          }
        );

      } catch (e) {
        console.log("ERRORE NGSILD", e);
      }
    }

    //se ci sono oggetti da inviare con update
    //invia gli oggetti con update
    if (updateObjs.length > 0) {
      try {
        const resp = await axios.post(
          baseURL + "ngsi-ld/v1/entityOperations/update?options=noOverwrite",
          updateObjs,
          {
            headers: {
              "Content-Type": "application/json",
              "Link": this.app.get("ngsildLink"),
            },
          }
        );

      } catch (e) {
        console.log("ERRORE NGSILD", e);
      }
    }
  }

  async getSessions(idUsr, idApp3D, idLms) {
    const resp = await fetch(
      "https://broker.minerva.sferainnovazione.com/ngsi-ld/v1/entities?type=3DScene&q=hasObjects==minerva:"+idLms+":"+idUsr+":"+idApp3D+":player"
    );
    const data = await resp.json();

    return {data};
  }

  //Queste funzioni vanno ancora testate
  async getCurrentSession(idUsr, idApp3D, idLms) {
    const sessions = await this.getSessions(idUsr, idApp3D, idLms);
    console.log("sessions", sessions);
    //prendi la sessione corrente, essa è quella che non contiene il campo end
    let currentSession = sessions.data.filter((session) => {
      return session.end == undefined;
    });

    return currentSession[0];
  }
};
