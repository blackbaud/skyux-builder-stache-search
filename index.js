'use strict';

const path = require('path');
const config = require(path.join(process.cwd(), 'skyuxconfig.json'));

module.exports = {
  runCommand: (command, argv) => {
    switch (command) {
      case 'stache-add-search-spec':
        require('./src/add-search-spec')(argv, config);
        break;
      case 'stache-add-e2e-config':
        require('./src/add-e2e-config')(argv, config);
        break;
      case 'stache-publish-search':
        require('./src/publish-search')(argv, config);
        break;
      case 'stache-release-search':
        require('./src/release-search')(argv, config);
        break;
      case 'stache-remove-e2e-config':
        require('./src/remove-e2e-config')(argv, config);
        break;
      case 'stache-remove-search-json':
        require('./src/remove-search-json')(argv, config);
        break;
      case 'stache-remove-search-spec':
        require('./src/remove-search-spec')(argv, config);
        break;
      default:
        return false;
      }
    return true;
  }
};
