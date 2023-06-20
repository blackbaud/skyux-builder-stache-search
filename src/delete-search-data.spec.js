'use strict';

const mock = require('mock-require');
const readConfig = require('./utils/shared').readConfig;

describe('Delete Search Data', () => {
  function setupTest() {
    const args = {
      endpoint: 'MOCK_ENDPOINT',
      audienceId: 'MOCK_AUDIENCE_ID',
      clientUserName: 'MOCK_CLIENT_USER_NAME',
      clientKey: 'MOCK_CLIENT_KEY',
      buildVersion: 'MOCK_BUILD_VERSION',
      siteName: 'MOCK_SITE_NAME',
    };

    const spies = {
      errorHandler: jasmine.createSpy('errorHandler'),
      makeRequest: jasmine.createSpy('makeRequest'),
    };

    mock('./error-handler', spies.errorHandler);

    mock('./utils/shared', {
      readConfig: readConfig,
      makeRequest: spies.makeRequest,
    });

    return {
      args,
      deleteSearchData: mock.reRequire('./delete-search-data'),
      spies,
    };
  }

  afterEach(() => {
    mock.stopAll();
  });

  it('should error if an endpoint is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.endpoint;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: An endpoint is required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should error if an audienceId is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.audienceId;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: An audienceId is required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should error if a clientUserName is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.clientUserName;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should error if a clientKey is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.clientKey;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should error if a buildVersion is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.buildVersion;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: A build version and a site name are required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should error if a siteName is not provided', () => {
    const { args, deleteSearchData, spies } = setupTest();

    delete args.siteName;

    deleteSearchData(args, undefined);

    expect(spies.errorHandler).toHaveBeenCalledWith(
      new Error(
        '[ERROR]: A build version and a site name are required to delete stache search data!'
      ),
      undefined
    );
  });

  it('should call the makeRequest method with the arguments and request body', () => {
    const { args, deleteSearchData, spies } = setupTest();

    deleteSearchData(args, undefined);

    expect(spies.makeRequest).toHaveBeenCalledWith(
      {
        endpoint: 'MOCK_ENDPOINT',
        audienceId: 'MOCK_AUDIENCE_ID',
        clientUserName: 'MOCK_CLIENT_USER_NAME',
        clientKey: 'MOCK_CLIENT_KEY',
        buildVersion: 'MOCK_BUILD_VERSION',
        siteName: 'MOCK_SITE_NAME',
      },
      '{"build_version":"MOCK_BUILD_VERSION","site_name":"MOCK_SITE_NAME"}',
      'DELETE'
    );
  });
});
