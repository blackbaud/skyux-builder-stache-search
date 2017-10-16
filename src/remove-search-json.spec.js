'use strict';

const fs = require('fs-extra');
const mock = require('mock-require');

describe('Remove Search JSON', () => {
  let removeSearchJSON;
  const config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: false
        }
      }
    }
  };

  beforeAll(() => {
    mock('fs-extra', {
      existsSync: function (filePath) {
        if (filePath) {
          console.log('File exists');
          return true;
        }
      },
      rmdirSync: function (filePath) {
        console.log(`Directory deleted: ${filePath}`);
      },
      unlinkSync: function (filePath) {
        console.log(`File deleted: ${filePath}`);
      }
    });

    mock('path', {
      dirname: function () {
        return './src/stache/search/';
      },
      resolve: function () {
        return './src/stache/search/search.json';
      }
    });
  });

  beforeEach(() => {
    removeSearchJSON = mock.reRequire('./remove-search-json');
  });

  it('should not remove the file if search is false', () => {
    spyOn(fs, 'existsSync');
    removeSearchJSON([], config);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('should remove the file by default if search is undefined', () => {
    const filePath = './src/stache/search/search.json';
    spyOn(console, 'log');
    removeSearchJSON([], undefined);
    expect(console.log).toHaveBeenCalledWith(`Directory deleted: ${filePath.slice(0, -11)}`);
    expect(console.log).toHaveBeenCalledWith(`File deleted: ${filePath}`);
    expect(console.log).toHaveBeenCalledWith('File exists');
  });

  it('should remove the file if search is set to true and the file exists', () => {
    const filePath = './src/stache/search/search.json';
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    spyOn(console, 'log');
    removeSearchJSON([], config);
    expect(console.log).toHaveBeenCalledWith(`Directory deleted: ${filePath.slice(0, -11)}`);
    expect(console.log).toHaveBeenCalledWith(`File deleted: ${filePath}`);
    expect(console.log).toHaveBeenCalledWith('File exists');
  });

  it('should do nothing if no file exists', () => {
    mock('fs-extra', {
      existsSync: function () {
        return false;
      },
      unlinkSync: function () {
        console.log('I should not fire!');
      }
    });
    spyOn(console, 'log');
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    removeSearchJSON = mock.reRequire('./remove-search-json');
    removeSearchJSON([], config);
    expect(console.log).not.toHaveBeenCalledWith('I should not fire!');
  });

  it('should throw an error if a problem occurs with deleting the file', () => {
    mock('path', {
      resolve: function () {
        throw new Error('Test error');
      }
    });
    removeSearchJSON = mock.reRequire('./remove-search-json');
    config.appSettings.stache.searchConfig.allowSiteToBeSearched = true;
    let test = function () {
      return removeSearchJSON([], config);
    }
    expect(test).toThrowError('[ERROR]: Unable to remove stache search directory.');
  });

  afterAll(() => {
    mock.stopAll();
  });

});
