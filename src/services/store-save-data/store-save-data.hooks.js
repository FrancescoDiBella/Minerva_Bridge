const internalOnly = require('../../internal-only');
const jwt = require('jsonwebtoken');
const {BadRequest} = require('@feathersjs/errors');

module.exports = {
  before: {
    all: [],
    find: [internalOnly],
    get: [internalOnly],
    create: [],
    update: [internalOnly],
    patch: [internalOnly],
    remove: [internalOnly]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
