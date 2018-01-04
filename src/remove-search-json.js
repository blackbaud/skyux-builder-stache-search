'use strict';

const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils/shared');

function removeSearchJsonFileFromProject(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return; 
  }

  try {
    const filePath = path.resolve(process.cwd(), 'src/stache/search/search.json');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fs.rmdirSync(path.dirname(filePath));
    }
  } catch (error) {
    throw new Error('[ERROR]: Unable to remove stache search directory.');
  }
}

module.exports = removeSearchJsonFileFromProject;
