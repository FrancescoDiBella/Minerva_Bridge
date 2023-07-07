const app = require('../../src/app');

describe('\'lmsOnboarding\' service', () => {
  it('registered the service', () => {
    const service = app.service('lms-onboard');
    expect(service).toBeTruthy();
  });
});
