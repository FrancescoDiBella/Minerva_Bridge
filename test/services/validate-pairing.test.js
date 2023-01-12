const app = require('../../src/app');

describe('\'validatePairing\' service', () => {
  it('registered the service', () => {
    const service = app.service('e-modules/validatePairing');
    expect(service).toBeTruthy();
  });
});
