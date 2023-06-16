const app = require('../../src/app');

describe('\'statements\' service', () => {
  it('registered the service', () => {
    const service = app.service('statements');
    expect(service).toBeTruthy();
  });
});
