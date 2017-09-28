const utils = require('./shared');

describe('Utils', () => {
  let config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: true
        }
      }
    }
  };

  it('should return true if the config exists', () => {
    let result = utils.checkConfig(config);
    expect(result).toBe(true);
  });

  it('should return true if the key in the config exists', () => {
    let result = utils.checkConfig(config, 'allowSiteToBeSearched');
    expect(result).toBe(true);
  });

  it('should return false if no key exists', () => {
    let result = utils.checkConfig(config, 'Nope');
    expect(result).toBe(false);
  });

  it('should return false if config does not exist', () => {
    let result = utils.checkConfig(undefined);
    expect(result).toBe(false);
  });
});