const app = require('../../src/app');

describe('\'ngsild-entity\' service', () => {
  it('registered the service', () => {
    const service = app.service('entity');
    expect(service).toBeTruthy();
  });
});
