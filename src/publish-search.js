'use strict';

const fs = require('fs-extra');
const path = require('path');
const filePath = path.resolve(process.cwd(), 'src/stache/search/search.json');
const errorHandler = require('./error-handler');
const utils = require('./utils/shared');

function publishSearch(argv, config) {
  function getRequestBody() {
    try {
      let file = fs.readJsonSync(filePath);
      file.build_version = argv.buildVersion;
      return JSON.stringify(file);
    } catch (error) {
      return errorHandler(
        new Error(
          `[ERROR]: Unable to read search file at ${filePath}! ${error.message}`
        )
      );
    }
  }

  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  if (!fs.existsSync(filePath)) {
    return errorHandler(
      new Error('[ERROR]: Search json file does not exist!'),
      config
    );
  }

  if (!argv.endpoint) {
    return errorHandler(
      new Error(
        '[ERROR]: An endpoint is required to publish stache search data!'
      ),
      config
    );
  }

  if (!argv.audienceId) {
    return errorHandler(
      new Error(
        '[ERROR]: An audienceId is required to publish stache search data!'
      ),
      config
    );
  }

  if (!argv.clientUserName || !argv.clientKey) {
    return errorHandler(
      new Error(
        '[ERROR]: Client User Name and Client Key are required to publish stache search data!'
      ),
      config
    );
  }

  if (!argv.buildVersion) {
    return errorHandler(
      new Error(
        '[ERROR]: A build version is required to publish stache search data!'
      ),
      config
    );
  }

  utils.makeRequest(argv, getRequestBody());
}

module.exports = publishSearch;
