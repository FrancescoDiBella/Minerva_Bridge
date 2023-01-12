const app = require('../../src/app');

describe('\'getAuthCode\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/getAuthCode');
    expect(service).toBeTruthy();
  });
});
