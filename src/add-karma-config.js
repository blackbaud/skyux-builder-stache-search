'use strict';

const path = require('path');
const fs = require('fs-extra');
const utils = require('./utils/shared');
const errorHandler = require('./error-handler');
const constants = require('./utils/constants');

function addE2EConfig(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  try {
    fs.copyFileSync(
      path.join(__dirname, 'templates/karma.conf.js.template'),
      constants.KarmaConfigFilePath
    );
  } catch (error) {
    return errorHandler(
      new Error('[ERROR]: Unable to add stache search Karma config.'),
      config
    );
  }
}

module.exports = addE2EConfig;
