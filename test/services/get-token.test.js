const app = require('../../src/app');

describe('\'getToken\' service', () => {
  it('registered the service', () => {
    const service = app.service('e-modules/getToken');
    expect(service).toBeTruthy();
  });
});
