const app = require('../../src/app');

describe('\'position\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/:idAdmin/lms/:idLms/users/position');
    expect(service).toBeTruthy();
  });
});
