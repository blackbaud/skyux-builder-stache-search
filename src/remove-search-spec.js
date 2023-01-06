'use strict';

const fs = require('fs-extra');
const constants = require('./utils/constants');
const utils = require('./utils/shared');

function removeSearchSpecFromProject(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  try {
    const filePath = constants.SpecFilePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error(
      '[ERROR]: Unable to remove stache search spec from project.'
    );
  }
}

module.exports = removeSearchSpecFromProject;
