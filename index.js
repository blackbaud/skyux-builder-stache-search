'use strict';

const path = require('path');
const config = require(path.join(process.cwd(), 'skyuxconfig.json'));

module.exports = {
  runCommand: (command, argv) => {
    switch (command) {
      case 'add-search-spec':
        require('./src/add-search-spec')(argv, config);
        break;
      case 'add-e2e-config':
        require('./src/add-e2e-config')(argv, config);
        break;
      case 'publish-search':
        require('./src/publish-search')(argv, config);
        break;
      case 'remove-e2e-config':
        require('./src/remove-e2e-config')(argv, config);
        break;
      case 'remove-search-json':
        require('./src/remove-search-json')(argv, config);
        break;
      case 'remove-search-spec':
        require('./src/remove-search-spec')(argv, config);
        break;
      default:
        return false;
      }
    return true;
  }
};
