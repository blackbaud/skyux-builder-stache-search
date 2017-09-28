'use strict';

const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils/shared');

function removeSearchJsonFileFromProject(argv, config) {
  let doesSearchConfigExist = utils.checkConfig(config, 'allowSiteToBeSearched');
  if (
    doesSearchConfigExist &&
    config.appSettings.stache.searchConfig.allowSiteToBeSearched === false
  ) { return; }
  
  try {
    let filePath = path.join(process.cwd(), 'src', 'stache', 'search', 'search.json');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fs.rmdirSync(filePath.slice(0, -11));
    }
  } catch (error) {
    throw new Error('[ERROR]: Unable to remove stache search directory.');
  }
}

module.exports = removeSearchJsonFileFromProject;
