'use strict';

const mock = require('mock-require');
const fs = require('fs-extra');

describe('Add Search Spec', () => {
  let addSearchSpec;
  let args;
  const config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: false
        }
      }
    }
  };
  const filePath = './e2e/stache-search.e2e-spec.ts';

  beforeEach(() => {
    mock('./error-handler', function (error) {
      console.log(error);
    });

    mock('fs-extra', {
      existsSync: function (filePath) {
        if (filePath) {
          console.log('File exists');
          return true;
        }
      },
      mkdirSync: function () {
        console.log('e2e directory created!');
      },
      writeFileSync: function (filePath) {
        console.log(`Added ${filePath} to directory!`);
      }
    });

    mock('path', {
      join: function () {
        return './e2e/stache-search.e2e-spec.ts';
      }
    });

    args = {
      siteName: 'test'
    };
    
    addSearchSpec = mock.reRequire('./add-search-spec');
  });

  it('should not add the file if search is false', () => {
    spyOn(fs, 'existsSync');
    addSearchSpec(args, config);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('should throw an error if siteName is undefined', () => {
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addSearchSpec({}, config);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Site name is required to add search spec!'));
  });

  it('should add the file if searchConfig is undefined', () => {
    spyOn(console, 'log');
    addSearchSpec(args, undefined);
    expect(console.log).toHaveBeenCalledWith('File exists');
    expect(console.log).toHaveBeenCalledWith(`Added ${filePath} to directory!`);
  });

  it('should add the file if allowSiteToBeSearched is set to true', () => {
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addSearchSpec(args, config);
    expect(console.log).toHaveBeenCalledWith('File exists');
    expect(console.log).toHaveBeenCalledWith(`Added ${filePath} to directory!`);
  });

  it('should create the e2e directory if it does not exist', () => {
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    mock('fs-extra', {
      existsSync: function () {
        return false;
      },
      mkdirSync: function () {
        console.log('e2e directory created!');
      },
      writeFileSync: function (filePath) {
        console.log(`Added ${filePath} to directory!`);
      }
    });
    addSearchSpec = mock.reRequire('./add-search-spec');
    spyOn(console, 'log');
    addSearchSpec(args, config);
    expect(console.log).toHaveBeenCalledWith('e2e directory created!');
    expect(console.log).toHaveBeenCalledWith(`Added ${filePath} to directory!`);
  });

  it('should call the errorHandler if a problem occurs with adding the file', () => {
    mock('path', {
      join: function () {
        throw new Error('Test error');
      }
    });
    addSearchSpec = mock.reRequire('./add-search-spec');
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addSearchSpec(args, config);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Unable to add stache search template to e2e directory.'));
  });

  afterAll(() => {
    mock.stopAll();
  });
});
