const app = require('../../src/app');

describe('\'utenti\' service', () => {
  it('registered the service', () => {
    const service = app.service('utenti');
    expect(service).toBeTruthy();
  });
});
