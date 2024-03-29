'use strict';

const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils/shared');
const errorHandler = require('./error-handler');

function addE2EConfig(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  let e2eConfig = {
    omnibar: false,
    // Need to make sure the host is in here, otherwise the e2e will redirect to login even when auth is disabled.
    host: {
      url: 'https://host.nxt.blackbaud.com',
    },
  };

  try {
    const filePath = path.join(process.cwd(), 'skyuxconfig.e2e.json');
    if (!fs.existsSync(filePath)) {
      fs.writeJsonSync(filePath, e2eConfig);
    }
  } catch (error) {
    return errorHandler(
      new Error(
        '[ERROR]: Unable to add stache search template to e2e directory.'
      ),
      config
    );
  }
}

module.exports = addE2EConfig;
