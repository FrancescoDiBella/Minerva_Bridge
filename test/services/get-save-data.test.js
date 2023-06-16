const app = require('../../src/app');

describe('\'getSaveData\' service', () => {
  it('registered the service', () => {
    const service = app.service('getSaveData');
    expect(service).toBeTruthy();
  });
});
