const axios = require("axios")
const http = require('http');
/* eslint-disable no-unused-vars */
exports.StoreSaveData = class StoreSaveData {
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
    try {
      const statement = {
        "actor": {
          "mbox": "mailto:mike@example.org",
          "name": "Mike"
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
        }
      };

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

      return response.data;
    } catch (err) {
      console.log(err.message);

      return "error";
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
