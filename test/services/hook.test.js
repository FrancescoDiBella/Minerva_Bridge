const app = require('../../src/app');

describe('\'hook\' service', () => {
  it('registered the service', () => {
    const service = app.service('hook');
    expect(service).toBeTruthy();
  });
});
