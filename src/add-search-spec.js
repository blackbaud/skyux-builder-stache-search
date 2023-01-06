'use strict';

const path = require('path');
const fs = require('fs-extra');
const constants = require('./utils/constants');
const utils = require('./utils/shared');
const errorHandler = require('./error-handler');

function addSearchSpecToProject(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  if (!argv.siteName) {
    return errorHandler(
      new Error('[ERROR]: Site name is required to add search spec!'),
      config
    );
  }

  try {
    fs.copyFileSync(
      path.join(__dirname, 'templates/stache-search.spec.ts.template'),
      constants.SpecFilePath
    );
  } catch (error) {
    return errorHandler(
      new Error('[ERROR]: Unable to add stache search spec file to project.'),
      config
    );
  }
}

module.exports = addSearchSpecToProject;
