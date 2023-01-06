'use strict';

const path = require('path');
const fs = require('fs-extra');
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
    let filePath = path.join(process.cwd(), 'e2e');

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    fs.copyFileSync(
      path.join(__dirname, 'templates/stache-search.spec.ts.template'),
      path.join(process.cwd(), 'src/app/stache-search.spec.ts')
    );
  } catch (error) {
    return errorHandler(
      new Error(
        '[ERROR]: Unable to add stache search template to e2e directory.'
      ),
      config
    );
  }
}

module.exports = addSearchSpecToProject;
