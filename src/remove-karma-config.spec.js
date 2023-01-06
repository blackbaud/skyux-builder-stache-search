'use strict';

const fs = require('fs-extra');
const mock = require('mock-require');

describe('Remove e2e config', () => {
  let removeE2EConfig;
  const config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: false,
        },
      },
    },
  };

  beforeAll(() => {
    mock('fs-extra', {
      existsSync: function (filePath) {
        if (filePath) {
          console.log('File exists');
          return true;
        }
      },
      unlinkSync: function (filePath) {
        console.log(`File deleted: ${filePath}`);
      },
    });

    mock('path', {
      resolve: function () {
        return './skyuxconfig.e2e.json';
      },
    });
  });

  beforeEach(() => {
    removeE2EConfig = mock.reRequire('./remove-e2e-config');
  });

  it('should not remove the file if search is false', () => {
    spyOn(fs, 'existsSync');
    removeE2EConfig([], config);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('should remove the file by default if search is undefined', () => {
    const filePath = './skyuxconfig.e2e.json';
    spyOn(console, 'log');
    removeE2EConfig([], undefined);

    expect(console.log).toHaveBeenCalledWith(`File deleted: ${filePath}`);
    expect(console.log).toHaveBeenCalledWith('File exists');
  });

  it('should remove the file if it exists', () => {
    const filePath = './skyuxconfig.e2e.json';
    spyOn(console, 'log');
    removeE2EConfig([], undefined);

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
      },
    });
    spyOn(console, 'log');
    removeE2EConfig = mock.reRequire('./remove-e2e-config');
    removeE2EConfig([], undefined);
    expect(console.log).not.toHaveBeenCalledWith('I should not fire!');
  });

  it('should throw an error if a problem occurs with deleting the file', () => {
    mock('path', {
      resolve: function () {
        throw new Error('Test error');
      },
    });
    removeE2EConfig = mock.reRequire('./remove-e2e-config');
    let test = function () {
      return removeE2EConfig([], undefined);
    };
    expect(test).toThrowError(
      '[ERROR]: Unable to remove skyuxconfig.e2e.json.'
    );
  });

  afterAll(() => {
    mock.stopAll();
  });
});
