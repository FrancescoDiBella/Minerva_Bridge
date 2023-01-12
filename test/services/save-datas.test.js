const app = require('../../src/app');

describe('\'saveDatas\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/saveDatas');
    expect(service).toBeTruthy();
  });
});
