'use strict';

const mock = require('mock-require');

describe('Publish Search', () => {
    let publishSearch;
    const config = {
        appSettings: {
            stache: {
                search: false
            }
        }
    };

    beforeEach(() => {  
        mock('fs-extra', {
            existsSync: function (filePath) {
                console.log(`${filePath} exists!`);
                return true;
            },
            readJsonSync: function (filePath) {
                console.log(`${filePath} found!`);
                return {
                    test: "Some Example JSON"
                };
            }
        });

        mock('request', function (options, callback) {
            console.log(options.headers.Authorization);
            console.log(options.body);
            console.log(options.uri);
            callback(null, {statusCode: 200});
        });

        mock('path', {
            join: function () {
                console.log('We have a path!');
                return './src/stache/search.json';
            }
        });

        process.env.searchEndpoint = "https://localhost:5000/publisher";
        process.env.token = "thisisatoken";
        publishSearch = mock.reRequire('./publish-search');
        config.appSettings.stache.search = true;
    });

    it('should exit if search is false', () => {
        config.appSettings.stache.search = false;
        spyOn(process, 'exit');
        publishSearch([], config);
        expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('should exit if no search json file is found', () => {
        mock('fs-extra', {
            existsSync: function () {
                console.log('Does not exist!');
                return false;
            }
        });
        publishSearch = mock.reRequire('./publish-search');
        spyOn(process, 'exit');
        spyOn(console, 'log');
        publishSearch([], config);
        expect(process.exit).toHaveBeenCalledWith(0);
        expect(console.log).toHaveBeenCalledWith('Does not exist!');
    });

    it('should error if an endpoint is not provided', () => {
        delete process.env.searchEndpoint;
        publishSearch = mock.reRequire('./publish-search');
        let test = function () {
            return publishSearch([], config);
        };
        expect(test).toThrowError('[ERROR]: An endpoint is required to publish stache search data!');
    });

    it('should error if a token is not provided', () => {
        delete process.env.token;
        publishSearch = mock.reRequire('./publish-search');

        let test = function () {
            return publishSearch([], config);
        };

        expect(test).toThrowError('[ERROR]: A token is required to publish stache search data!');
    });

    it('should post the json file to the database', () => {
        spyOn(console, 'log');
        publishSearch([], config);
        expect(console.log).toHaveBeenCalledWith(process.env.searchEndpoint);
        expect(console.log).toHaveBeenCalledWith(`Bearer ${process.env.token}`);
        expect(console.log).toHaveBeenCalledWith(JSON.stringify({ test: "Some Example JSON" }));
        expect(console.log).toHaveBeenCalledWith('200: Search data successfully posted!');
    });

    it('should throw an error if file post unsuccessful', () => {
        mock('request', function (options, callback) {
            callback({message: 'ERROR!'});
        });
        publishSearch = mock.reRequire('./publish-search');
        let test = function () {
            return publishSearch([], config);
        };
        expect(test).toThrowError(`[ERROR]: Unable to post search data! ERROR!`)
    });

    it('should throw an error if unable to read search json file', () => {
        mock('fs-extra', {
            existsSync: function (filePath) {
                console.log(`${filePath} exists!`);
                return true;
            },
            readJsonSync: function () {
                throw new Error('It is broken!');
            }
        });
        publishSearch = mock.reRequire('./publish-search');
        let test = function () {
            return publishSearch([], config);
        };
        expect(test).toThrowError('[ERROR]: Unable to read search file at ./src/stache/search.json! It is broken!');
    });

});