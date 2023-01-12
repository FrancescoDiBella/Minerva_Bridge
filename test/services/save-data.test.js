const app = require('../../src/app');

describe('\'saveData\' service', () => {
  it('registered the service', () => {
    const service = app.service('3d-modules/saveData');
    expect(service).toBeTruthy();
  });
});
