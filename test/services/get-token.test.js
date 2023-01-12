const app = require('../../src/app');

describe('\'getToken\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/getToken');
    expect(service).toBeTruthy();
  });
});
