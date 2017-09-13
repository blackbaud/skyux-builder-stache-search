const mock = require('mock-require');

describe('Error Handler', () => {
  let errorHandler = require('./error-handler');

  beforeAll(() => {
    mock('./remove-search-json', function (args, config) {
      console.log(`Remove Search Json Called ${args} ${config}`);
    });
    mock('./remove-search-spec', function (args, config) {
      console.log(`Remove Search Spec Called ${args} ${config}`);
    });
  });

  it('should log the error', () => {
    spyOn(console, 'error');
    errorHandler('Error!', 'Config');
    expect(console.error).toHaveBeenCalledWith('Error!');
  });

  it('should call the remove-search-json and remove-search-spec functions', () => {
    spyOn(console, 'log');
    errorHandler('Errors!', 'Config');
    expect(console.log).toHaveBeenCalledWith('Remove Search Json Called null Config');
    expect(console.log).toHaveBeenCalledWith('Remove Search Spec Called null Config');
  });
});