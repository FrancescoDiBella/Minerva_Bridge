/* eslint-disable no-unused-vars */
exports.NgsildEntity = class NgsildEntity {
  constructor (options, app) {
    this.options = options || {};
    this.app = app || {};
  }

  async find (params) {
    let query = new URLSearchParams(params.query);
    let resp;
    const {temporal} = params.query;
    let url;

    //elimina il parametro temporal dalla query
    query.delete('temporal');
    if(temporal){
      url = this.app.get("brokerURL") + this.app.get("temporalEndpoint") + '?' + query.toString();
    }else{
      url = this.app.get("brokerURL") + this.app.get("entitiesEndpoint") + '?' + query.toString();
    }

    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Link': this.app.get("ngsilsLink")
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data);
      resp = data;
    }).catch(error => {
      console.log(error);
    });

    return resp;
  }



  async get (id, params) {
    //FAI UNA RICHIESTA GET ALL'ENDPOINT /ngsi-ld/v1/entities con una quey uguale a quella che hai ricevuto come parametro
    //ritorna il risultato della richiesta
    let query = new URLSearchParams(params.query);
    let resp;
    const {temporal} = params.query;
    let url;

    //elimina il parametro temporal dalla query
    query.delete('temporal');
    if(temporal){
      url = this.app.get("brokerURL") + this.app.get("temporalEndpoint") + '/' +id +"?" + query.toString();
    }else{
      url = this.app.get("brokerURL") + this.app.get("entitiesEndpoint") + '/' +id +"?" + query.toString();
    }

    await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Link': this.app.get("ngsilsLink")
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      console.log(data);
      resp = data;
    }).catch(error => {
      console.log(error);
    });

    return resp;
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    return data;
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
