'use strict';

const fs = require('fs-extra');
const path = require('path');
const utils = require('./utils/shared');

function removeSearchSpecFromProject(argv, config) {
  if (utils.readConfig(config, 'allowSiteToBeSearched') === false) {
    return;
  }

  try {
    const filePath = path.resolve(
      process.cwd(),
      'e2e/stache-search.e2e-spec.ts'
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    throw new Error(
      '[ERROR]: Unable to remove stache search template from e2e directory.'
    );
  }
}

module.exports = removeSearchSpecFromProject;
