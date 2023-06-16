const app = require('../../src/app');

describe('\'resetSecret\' service', () => {
  it('registered the service', () => {
    const service = app.service('resetSecret');
    expect(service).toBeTruthy();
  });
});
