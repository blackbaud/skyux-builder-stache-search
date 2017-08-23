const fs = require('fs');
const mock = require('mock-require');
// const path = require('path');

describe('Remove Search Spec', () => {
    let removeSearchSpec;
    const config = {
        appSettings: {
            search: false
        }
    };

    beforeAll(() => {
        mock('fs', {
            existsSync: function(filePath) {
                if (filePath) {
                    console.log('File exists');
                    return true;
                }
            },
            unlinkSync: function(filePath) {
                console.log(`File deleted: ${filePath}`);
            }
        });

        mock('path', {
            join: function() {
                return './e2e/stache-search.e2e-spec.ts';
            }
        });
    });

    beforeEach(() => {
        removeSearchSpec = mock.reRequire('./remove-search-spec');
    });

    it('should not remove the file if search is not set to true', () => {
        spyOn(fs, 'existsSync');
        removeSearchSpec([], config);
        expect(fs.existsSync).not.toHaveBeenCalled();
    });

    it('should remove the file if search is set to true and the file exists', () => {
        const filePath = './e2e/stache-search.e2e-spec.ts';
        config.appSettings.search = true;
        spyOn(console, 'log');
        removeSearchSpec([], config);
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
        config.appSettings.search = true;
        removeSearchSpec = mock.reRequire('./remove-search-spec');
        removeSearchSpec([], config);
        expect(console.log).not.toHaveBeenCalledWith('I should not fire!');
    });

    it('should throw an error if a problem occurs with deleting the file', () => {
        mock('path', {
            join: function() {
                throw new Error('Test error');
            }
        });
        removeSearchSpec = mock.reRequire('./remove-search-spec');
        config.appSettings.search = true;
        let test = function () {
            return removeSearchSpec([], config);
        }
        expect(test).toThrowError('[ERROR]: Unable to remove stache search template from e2e directory.');
    });
});