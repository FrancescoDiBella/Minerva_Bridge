const app = require('../../src/app');

describe('\'test-ngsild\' service', () => {
  it('registered the service', () => {
    const service = app.service('test-ngsild');
    expect(service).toBeTruthy();
  });
});
