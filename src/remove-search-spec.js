'use strict';

const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils/shared');

function removeSearchSpecFromProject(argv, config) {
  let doesSearchConfigExist = utils.checkConfig(config, 'allowSiteToBeSearched');
  if (
    doesSearchConfigExist &&
    config.appSettings.stache.searchConfig.allowSiteToBeSearched === false
  ) { return; }

  try {
    let filePath = path.join(process.cwd(), 'e2e', 'stache-search.e2e-spec.ts');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error('[ERROR]: Unable to remove stache search template from e2e directory.');
  }
}

module.exports = removeSearchSpecFromProject;
