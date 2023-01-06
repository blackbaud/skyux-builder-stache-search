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
          allowSiteToBeSearched: false,
        },
      },
    },
  };

  beforeEach(() => {
    mock('./error-handler', function (error) {
      console.log(error);
    });

    mock('fs-extra', {
      copyFileSync: function () {
        console.log('Copied files.');
      },
    });

    args = {
      siteName: 'test',
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
    expect(console.log).toHaveBeenCalledWith(
      new Error('[ERROR]: Site name is required to add search spec!')
    );
  });

  it('should add the file if searchConfig is undefined', () => {
    spyOn(console, 'log');
    addSearchSpec(args, undefined);
    expect(console.log).toHaveBeenCalledWith('Copied files.');
  });

  it('should add the file if allowSiteToBeSearched is set to true', () => {
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addSearchSpec(args, config);
    expect(console.log).toHaveBeenCalledWith('Copied files.');
  });

  it('should call the errorHandler if a problem occurs with adding the file', () => {
    mock('path', {
      join: function () {
        throw new Error('Test error');
      },
    });
    addSearchSpec = mock.reRequire('./add-search-spec');
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    addSearchSpec(args, config);

    expect(console.log).toHaveBeenCalledWith(
      new Error('[ERROR]: Unable to add stache search spec file to project.')
    );
  });

  afterAll(() => {
    mock.stopAll();
  });
});
