
/* eslint-disable no-unused-vars */
exports.TestNgsild = class TestNgsild {
  constructor (options, app) {
    this.options = options || {};
    this.app = app;
    this.events = ['obj-pos'];
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
    console.log("NOTIFICATION RECEIVED");
    let array = [data.data[0].position.value[0], data.data[0].position.value[1], data.data[0].position.value[2]]
    if(data.subscriptionId != "urn:ngsi-ld:Subscription:SferaVerdeSub:001"){
      return {id: data.data[0].id, position: array, timestamp: data.data[0].position.observedAt};
    }else{
      // Remove the default "created" event
      this.emit('obj-pos', {type: "obj",position: array, timestamp: data.data[0].position.observedAt});
      return {type: "obj",position: array, timestamp: data.data[0].position.observedAt};
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
