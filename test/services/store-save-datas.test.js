const app = require('../../src/app');

describe('\'storeSaveDatas\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/storeSaveData');
    expect(service).toBeTruthy();
  });
});
