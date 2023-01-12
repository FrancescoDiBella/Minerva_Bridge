const app = require('../../src/app');

describe('\'access\' service', () => {
  it('registered the service', () => {
    const service = app.service('e-modules/access');
    expect(service).toBeTruthy();
  });
});
