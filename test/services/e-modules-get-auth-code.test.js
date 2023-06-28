const app = require('../../src/app');

describe('\'e-modulesGetAuthCode\' service', () => {
  it('registered the service', () => {
    const service = app.service('e-modules/getAuthCode');
    expect(service).toBeTruthy();
  });
});
