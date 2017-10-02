'use strict';

const mock = require('mock-require');
const fs = require('fs-extra');

describe('Publish Search', () => {
  let publishSearch;
  const config = {
    appSettings: {
      stache: {
        searchConfig: {
          allowSiteToBeSearched: false
        }
      }
    }
  };
  
  beforeEach(() => {  
    mock('./error-handler', function (error) {
      console.log(error);
    });

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

    mock('request', function (options) {
      console.log(options.headers.Authorization);
      console.log(options.body);
      console.log(options.uri);
    });

    mock('path', {
      resolve: function () {
        console.log('We have a path!');
        return './src/stache/search.json';
      }
    });
    process.env.endpoint = "https://localhost:5000/publisher";
    process.env.audienceId = "AudienceId";
    process.env.clientUserName = "t01\\example";
    process.env.clientKey = "apassword";
    publishSearch = mock.reRequire('./publish-search');
  });

  it('should do nothing if search is false', () => {
    spyOn(fs, 'existsSync');
    publishSearch([], config);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('should publish search by default if search is undefined', () => {
    let filePath = './src/stache/search.json';
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(`${filePath} exists!`);
  });

  it('should error if no search json file is found', () => {
    mock('fs-extra', {
      existsSync: function () {
        console.log('Does not exist!');
        return false;
      }
    });
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Search json file does not exist!'));
    expect(console.log).toHaveBeenCalledWith('Does not exist!');
  });

  it('should error if an endpoint is not provided', () => {
    delete process.env.endpoint;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: An endpoint is required to publish stache search data!'));
  });

  it('should error if an audienceId is not provided', () => {
    delete process.env.audienceId;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: An audienceId is required to publish stache search data!'));
  });

  it('should error if a clientUserName is not provided', () => {
    delete process.env.clientUserName;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Client User Name and Client Key are required to publish stache search data!'));
  });

  it('should error if a clientKey is not provided', () => {
    delete process.env.clientKey;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Client User Name and Client Key are required to publish stache search data!'));
  });

  it('should post the json file to the database', () => {
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(process.env.endpoint);
    expect(console.log).toHaveBeenCalledWith(`Bearer ${process.env.token}`);
    expect(console.log).toHaveBeenCalledWith(JSON.stringify({ test: "Some Example JSON" }));
    expect(console.log).toHaveBeenCalledWith('200: Search data successfully posted!');
  });

  it('should throw an error if file post unsuccessful', () => {
    mock('request', function (options, callback) {
      callback({message: 'ERROR!'});
    });
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Unable to post search data! ERROR!'));
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
    spyOn(console, 'log');
    publishSearch([], undefined);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Unable to read search file at ./src/stache/search.json! It is broken!'));
  });

});
