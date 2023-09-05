const internalOnly = require("../../internal-only");

module.exports = {
  before: {
    all: [],
    find: [internalOnly],
    get: [internalOnly],
    create: [],
    update: [internalOnly],
    patch: [internalOnly],
    remove: [internalOnly],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
