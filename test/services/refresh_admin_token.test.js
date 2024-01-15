const app = require('../../src/app');

describe('\'refresh_admin_token\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/refreshToken');
    expect(service).toBeTruthy();
  });
});
