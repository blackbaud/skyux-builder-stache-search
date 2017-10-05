'use strict';

const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils/shared');

function removeE2EConfig(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return; 
  }

  try {
    const filePath = path.resolve(process.cwd(), 'skyuxconfig.e2e.json');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error('[ERROR]: Unable to remove skyuxconfig.e2e.json.');
  }
}

module.exports = removeE2EConfig;