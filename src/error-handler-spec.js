const mock = require('mock-require');
const logger = require('@blackbaud/skyux-logger');

describe('Error Handler', () => {
  let errorHandler = require('./error-handler');

  beforeAll(() => {
    mock('./remove-search-json', function (args, config) {
      console.log(`Remove Search Json Called ${args} ${config}`);
    });
    mock('./remove-search-spec', function (args, config) {
      console.log(`Remove Search Spec Called ${args} ${config}`);
    });

    errorHandler = mock.reRequire('./error-handler');
  });

  it('should log the error', () => {
    spyOn(console, 'log');
    spyOn(logger, 'error');
    let test = function () {
      return errorHandler('Error!', 'Config');
    };

    expect(test).toThrow('Error!');
    expect(logger.error).toHaveBeenCalledWith('Error!');
  });

  it('should call the remove-search-json and remove-search-spec functions', () => {
    spyOn(console, 'log');
    spyOn(logger, 'error');
    let test = function () {
      return errorHandler('Errors!', 'Config');
    };
    expect(test).toThrow('Errors!');
    expect(console.log).toHaveBeenCalledWith('Remove Search Json Called null Config');
    expect(console.log).toHaveBeenCalledWith('Remove Search Spec Called null Config');
  });

  afterAll(() => {
    mock.stopAll();
  });
});