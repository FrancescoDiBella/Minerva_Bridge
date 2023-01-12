const app = require('../../src/app');

describe('\'lms\' service', () => {
  it('registered the service', () => {
    const service = app.service('lms');
    expect(service).toBeTruthy();
  });
});
