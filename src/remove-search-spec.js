'use strict';

const fs = require('fs-extra');
const path = require('path');

function removeSearchSpecFromProject(argv, config) {
  if (config &&
      config.appSettings &&
      config.appSettings.stache &&
      config.appSettings.stache.searchConfig &&
      config.appSettings.stache.searchConfig.allowSiteToBeSearched) {
    try {
      let filePath = path.join(process.cwd(), 'e2e', 'stache-search.e2e-spec.ts');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw new Error('[ERROR]: Unable to remove stache search template from e2e directory.');
    }
  }
}

module.exports = removeSearchSpecFromProject;
