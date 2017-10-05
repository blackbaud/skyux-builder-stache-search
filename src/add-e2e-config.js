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
    auth: false,
    omnibar: false
  };

  try {
    let filePath = path.join(process.cwd());
    fs.writeJsonSync(path.join(filePath, 'skyuxconfig.e2e.json'), e2eConfig);
  } catch (error) {
    return errorHandler(new Error('[ERROR]: Unable to add stache search template to e2e directory.'), config);
  }
}

module.exports = addE2EConfig;