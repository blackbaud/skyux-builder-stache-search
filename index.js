'use strict';

const fs = require('fs-extra');
const path = require('path');

function getConfig() {
  let config = {};
  const configPath = path.join(process.cwd(), `skyuxconfig.json`);

  if (fs.existsSync(configPath)) {
    config = fs.readJsonSync(configPath);
  }

  return config;
}

module.exports = {
  runCommand: (command, argv) => {
    const config = getConfig();
    switch (command) {
      case 'stache-add-search-spec':
        require('./src/add-search-spec')(argv, config);
        break;
      case 'stache-publish-search':
        require('./src/publish-search')(argv, config);
        break;
      case 'stache-release-search':
        require('./src/release-search')(argv, config);
        break;
      case 'stache-remove-search-json':
        require('./src/remove-search-json')(argv, config);
        break;
      case 'stache-remove-search-spec':
        require('./src/remove-search-spec')(argv, config);
        break;
      case 'version':
        require('./src/version')();
        break;
      default:
        return false;
    }
    return true;
  },
};
