const app = require('../../src/app');

describe('\'storeSaveData\' service', () => {
  it('registered the service', () => {
    const service = app.service('storeSaveData');
    expect(service).toBeTruthy();
  });
});
