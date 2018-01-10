const mock = require('mock-require');

describe('Logger', () => {
  it('should configure a custom transport', () => {
    let _transports;
    let _colorize = false;
    mock('winston', {
      Logger: function (opts) {
        _transports = opts.transports;
      },
      transports: {
        Console: function (opts) {
          _colorize = opts.colorize;
        }
      }
    });

    mock.reRequire('./logger');
    expect(_colorize).toEqual(true);
    expect(_transports).toBeDefined();
  });
});