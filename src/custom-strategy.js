const { AuthenticationBaseStrategy } = require('@feathersjs/authentication');
const jwt = require('jsonwebtoken');

class CustomStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    const { idLms, idUsr, idApp3d, authCode } = authentication;

      // Generate a JWT token
      console.log(idLms, idUsr, idApp3d, authCode);
      const token = jwt.sign({
        idLms,
        idUsr,
        idApp3d,
        authCode
      }, 'my-secret-key', {
        expiresIn: '1h'
      });
      console.log(token);
      return {
        authenticated: true,
        token
      };
  }
}

module.exports = CustomStrategy;
