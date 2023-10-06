/* eslint-disable no-unused-vars */
exports.Position = class Position {
  constructor (options, app) {
    this.options = options || {};
    this.positions = [];
    this.timer = null;
    this.app = app;
    this.events = ['pos-created'];
  }

  async find() {
    return this.positions;
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    //se id è doverso da urn:ngsi-ld:Player:001 fai emit di obj-pos
    //altrimenti fai emit di player-pos

    if(data.id != "urn:ngsi-ld:Player:001")
      this.emit('obj-pos', data);
    else
      this.emit('pos-created', data);
    console.log("DATA:", data);
    this.positions.push(data);
    return data;
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
}

