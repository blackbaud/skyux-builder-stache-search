'use strict';

const errorHandler = require('./error-handler');
const utils = require('./utils/shared');

function releaseSearch(argv, config) {
  if (!argv.endpoint) {
    return errorHandler(
      new Error(
        '[ERROR]: An endpoint is required to release stache search data!'
      ),
      config
    );
  }

  if (!argv.audienceId) {
    return errorHandler(
      new Error(
        '[ERROR]: An audienceId is required to release stache search data!'
      ),
      config
    );
  }

  if (!argv.clientUserName || !argv.clientKey) {
    return errorHandler(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to release stache search data!'
      ),
      config
    );
  }

  if (!argv.buildVersion || !argv.siteName) {
    return errorHandler(
      new Error(
        '[ERROR]: A build version and a site name are required to release stache search data!'
      ),
      config
    );
  }

  utils.makeRequest(
    argv,
    JSON.stringify({
      build_version: argv.buildVersion,
      site_name: argv.siteName,
    })
  );
}

module.exports = releaseSearch;
