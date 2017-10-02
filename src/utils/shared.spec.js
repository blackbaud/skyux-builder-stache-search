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

  it('should return the value if the key in the config exists', () => {
    let result = utils.readConfig(config, 'allowSiteToBeSearched');
    expect(result).toBe(true);
  });

  it('should return undefined if no key exists', () => {
    let result = utils.readConfig(config, 'Nope');
    expect(result).toBe(undefined);
  });

  it('should return undefined if config does not exist', () => {
    let result = utils.readConfig(undefined);
    expect(result).toBe(undefined);
  });
});