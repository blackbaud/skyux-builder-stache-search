'use strict';

const mock = require('mock-require');
const fs = require('fs-extra');

describe('Add e2e config', () => {
  let addE2EConfig;
  const config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: false
        }
      }
    }
  };
  const filePath = './skyuxconfig.e2e.json';

  beforeAll(() => {
    mock('./error-handler', function (error) {
      console.log(error);
    });

    mock('fs-extra', {
      writeJsonSync: function (filePath, contents) {
        console.log(`Added ${filePath} to directory!`); 
        console.log(JSON.stringify(contents));
      }
    });

    mock('path', {
      join: function () {
        return './skyuxconfig.e2e.json';
      }
    });
  });

  beforeEach(() => {
    addE2EConfig = mock.reRequire('./add-e2e-config');
  });

  it('should not add the file if search is false', () => {
    spyOn(fs, 'writeJsonSync');
    addE2EConfig([], config);
    expect(fs.writeJsonSync).not.toHaveBeenCalled();
  });

  it('should add the e2e file by default if config is undefined', () => {
    spyOn(console, 'log');
    addE2EConfig([], {});
    expect(console.log).toHaveBeenCalledWith(`Added ${filePath} to directory!`);
    expect(console.log).toHaveBeenCalledWith(JSON.stringify({
      auth: false,
      omnibar: false,
      host: {
        url: 'https://host.nxt.blackbaud.com'
      }
    }));
  });

  it('should add the e2e config file if search is true', () => {
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addE2EConfig([], {});
    expect(console.log).toHaveBeenCalledWith(`Added ${filePath} to directory!`);
    expect(console.log).toHaveBeenCalledWith(JSON.stringify({
      auth: false,
      omnibar: false,
      host: {
        url: 'https://host.nxt.blackbaud.com'
      }
    }));
  });

  it('should call the errorHandler if a problem occurs with adding the file', () => {
    mock('path', {
      join: function () {
        throw new Error('Test error');
      }
    });
    addE2EConfig = mock.reRequire('./add-e2e-config');
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addE2EConfig([], {});

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Unable to add stache search template to e2e directory.'));
  });

  afterAll(() => {
    mock.stopAll();
  });
});