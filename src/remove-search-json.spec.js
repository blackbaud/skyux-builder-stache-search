'use strict';

const fs = require('fs');
const mock = require('mock-require');

describe('Remove Search JSON', () => {
    let removeSearchJSON;
    const config = {
        appSettings: {
            stache: {
                search: false
            }
        }
    };

    beforeAll(() => {
        mock('fs', {
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
            join: function () {
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

    it('should not remove the file if search is undefined', () => {
        spyOn(fs, 'existsSync');
        removeSearchJSON([], undefined);
        removeSearchJSON([], {});
        removeSearchJSON([], {
            appSettings: {}
        });
        removeSearchJSON([], {
            appSettings: {
                stache: {}
            }
        });
        expect(fs.existsSync).not.toHaveBeenCalled();
    });

    it('should remove the file if search is set to true and the file exists', () => {
        const filePath = './src/stache/search/search.json';
        config.appSettings.stache.search = true;
        spyOn(console, 'log');
        removeSearchJSON([], config);
        expect(console.log).toHaveBeenCalledWith(`Directory deleted: ${filePath.slice(0, -11)}`);
        expect(console.log).toHaveBeenCalledWith(`File deleted: ${filePath}`);
        expect(console.log).toHaveBeenCalledWith('File exists');
    });

    it('should do nothing if no file exists', () => {
        mock('fs', {
            existsSync: function () {
                return false;
            },
            unlinkSync: function () {
                console.log('I should not fire!');
            }
        });
        spyOn(console, 'log');
        config.appSettings.stache.search = true;
        removeSearchJSON = mock.reRequire('./remove-search-json');
        removeSearchJSON([], config);
        expect(console.log).not.toHaveBeenCalledWith('I should not fire!');
    });

    it('should throw an error if a problem occurs with deleting the file', () => {
        mock('path', {
            join: function () {
                throw new Error('Test error');
            }
        });
        removeSearchJSON = mock.reRequire('./remove-search-json');
        config.appSettings.stache.search = true;
        let test = function () {
            return removeSearchJSON([], config);
        }
        expect(test).toThrowError('[ERROR]: Unable to remove stache search directory.');
    });
});