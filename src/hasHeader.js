const { NotAuthenticated } = require('@feathersjs/errors')

module.exports = async function hasHeader( headers ){
  if (!headers.authorization) {
    throw new NotAuthenticated('Manca l\'header `Authorization`');
  }
}
