const mock = require('mock-require');

describe('version', () => {
  let version;

  beforeEach(() => {
    mock('fs-extra', {
      readJsonSync: function () {
        return {
          version: '1.0.0'
        };
      }
    });
    version = mock.reRequire('./version');
  });

  it('should log the version of the package', () => {
    spyOn(console, 'log');
    version();
    expect(console.log).toHaveBeenCalledWith('1.0.0');
  });

  afterAll(() => {
    mock.stopAll();
  });
});