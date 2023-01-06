'use strict';

const mock = require('mock-require');
const fs = require('fs-extra');
const readConfig = require('./utils/shared').readConfig;

describe('Publish Search', () => {
  let args;
  let publishSearch;

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
      existsSync: function (filePath) {
        console.log(`${filePath} exists!`);
        return true;
      },
      readJsonSync: function (filePath) {
        console.log(`${filePath} found!`);
        return {
          test: 'Some Example JSON',
        };
      },
    });

    mock('path', {
      resolve: function () {
        return './src/stache/search.json';
      },
    });

    mock('./utils/shared', {
      readConfig: readConfig,
      makeRequest: function (conf, body) {
        console.log('Request made!');
        console.log('We have a config ', conf);
        console.log('We have a body ', body);
      },
    });

    args = {
      endpoint: 'https://localhost:5000/publisher',
      audienceId: 'Audience\\Id',
      clientUserName: 't01\\example',
      clientKey: 'apassword',
      buildVersion: 'test',
    };

    publishSearch = mock.reRequire('./publish-search');
  });

  it('should do nothing if search is false', () => {
    spyOn(fs, 'existsSync');
    publishSearch(args, config);
    expect(fs.existsSync).not.toHaveBeenCalled();
  });

  it('should publish search by default if searchConfig is undefined', () => {
    let filePath = './src/stache/search.json';
    spyOn(console, 'log');
    publishSearch(args, undefined);
    expect(console.log).toHaveBeenCalledWith(`${filePath} exists!`);
  });

  it('should error if no search json file is found', () => {
    mock('fs-extra', {
      existsSync: function () {
        console.log('Does not exist!');
        return false;
      },
    });
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);
    expect(console.log).toHaveBeenCalledWith(
      new Error('[ERROR]: Search json file does not exist!')
    );
    expect(console.log).toHaveBeenCalledWith('Does not exist!');
  });

  it('should error if an endpoint is not provided', () => {
    delete args.endpoint;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);
    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: An endpoint is required to publish stache search data!'
      )
    );
  });

  it('should error if an audienceId is not provided', () => {
    delete args.audienceId;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: An audienceId is required to publish stache search data!'
      )
    );
  });

  it('should error if a clientUserName is not provided', () => {
    delete args.clientUserName;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to publish stache search data!'
      )
    );
  });

  it('should error if a clientKey is not provided', () => {
    delete args.clientKey;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to publish stache search data!'
      )
    );
  });

  it('should error if a buildVersion is not provided', () => {
    delete args.buildVersion;
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: A build version is required to publish stache search data!'
      )
    );
  });

  it('should throw an error if unable to read search json file', () => {
    mock('fs-extra', {
      existsSync: function (filePath) {
        console.log(`${filePath} exists!`);
        return true;
      },
      readJsonSync: function () {
        throw new Error('It is broken!');
      },
    });
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);
    expect(console.log).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: Unable to read search file at ./src/stache/search.json! It is broken!'
      )
    );
  });

  it('should call the makeRequest method with the arguments and request body', () => {
    publishSearch = mock.reRequire('./publish-search');
    spyOn(console, 'log');
    publishSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith('Request made!');
    expect(console.log).toHaveBeenCalledWith('We have a config ', args);
    expect(console.log).toHaveBeenCalledWith(
      'We have a body ',
      JSON.stringify({ test: 'Some Example JSON', build_version: 'test' })
    );
  });

  afterAll(() => {
    mock.stopAll();
  });
});
