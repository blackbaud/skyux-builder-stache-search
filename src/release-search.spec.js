'use strict';

const mock = require('mock-require');
const readConfig = require('./utils/shared').readConfig;

describe('Release Search', () => {
  let args;
  let releaseSearch;

  beforeEach(() => {
    mock('./error-handler', function (error) {
      console.log(error);
    });

    mock('./utils/shared', {
      readConfig: readConfig,
      makeRequest: function (conf, body) {
        console.log('Request made!');
        console.log('We have a config ', conf);
        console.log('We have a body ', body);
      }
    });

    args = {
      endpoint: 'https://localhost:5000/releaser',
      audienceId: 'Audience\\Id',
      clientUserName: 't01\\example',
      clientKey: 'apassword',
      buildVersion: 'test',
      siteName: 'test-site'
    };

    releaseSearch = mock.reRequire('./release-search');
  });

  it('should error if an endpoint is not provided', () => {
    delete args.endpoint;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);
    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: An endpoint is required to release stache search data!'));
  });

  it('should error if an audienceId is not provided', () => {
    delete args.audienceId;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: An audienceId is required to release stache search data!'));
  });

  it('should error if a clientUserName is not provided', () => {
    delete args.clientUserName;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Client User Name and Client Key are required to release stache search data!'));
  });

  it('should error if a clientKey is not provided', () => {
    delete args.clientKey;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: Client User Name and Client Key are required to release stache search data!'));
  });

  it('should error if a buildVersion is not provided', () => {
    delete args.buildVersion;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: A build version and a site name are required to release stache search data!'));
  });

  it('should error if a siteName is not provided', () => {
    delete args.siteName;
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith(new Error('[ERROR]: A build version and a site name are required to release stache search data!'));
  });

  it('should call the makeRequest method with the arguments and request body', () => {
    releaseSearch = mock.reRequire('./release-search');
    spyOn(console, 'log');
    releaseSearch(args, undefined);

    expect(console.log).toHaveBeenCalledWith('Request made!');
    expect(console.log).toHaveBeenCalledWith('We have a config ', args);
    expect(console.log).toHaveBeenCalledWith('We have a body ', JSON.stringify({build_version: 'test', site_name: 'test-site' }));
  });

  afterAll(() => {
    mock.stopAll();
  });

});
