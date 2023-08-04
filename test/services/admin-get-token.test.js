const app = require('../../src/app');

describe('\'adminGetToken\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin/getToken');
    expect(service).toBeTruthy();
  });
});
