const app = require('../../src/app');

describe('\'JWTService\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/GetToken');
    expect(service).toBeTruthy();
  });
});
