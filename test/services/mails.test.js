const app = require('../../src/app');

describe('\'mails\' service', () => {
  it('registered the service', () => {
    const service = app.service('mails');
    expect(service).toBeTruthy();
  });
});
