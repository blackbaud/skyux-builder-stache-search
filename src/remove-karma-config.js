'use strict';

const fs = require('fs-extra');
const constants = require('./utils/constants');
const utils = require('./utils/shared');

function removeE2EConfig(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  try {
    const filePath = constants.KarmaConfigFilePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error('[ERROR]: Unable to remove Karma config.');
  }
}

module.exports = removeE2EConfig;
