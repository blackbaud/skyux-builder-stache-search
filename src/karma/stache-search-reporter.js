const { ensureFileSync, writeJsonSync } = require('fs-extra');
const constants = require('../utils/constants');

function stacheSearchReporter() {
  const outputFilePath = constants.OutputFilePath;

  this.onBrowserLog = function (_browser, log) {
    if (!log) {
      return;
    }

    // Remove "'" from beginning of log.
    if (log && log.substring(0, 1) === "'") {
      log = log.substring(1, log.length - 1);
    }

    try {
      const json = JSON.parse(log);

      // Only capture console logs that are JSON-parsable and have the key "stacheSearch".
      if (json.stacheSearch) {
        ensureFileSync(outputFilePath);
        writeJsonSync(outputFilePath, json.stacheSearch, { spaces: 2 });
      }
    } catch (err) {
      console.warn(`Log output is not JSON-parsable. ${log}`);
    }
  };
}

stacheSearchReporter.$inject = ['config.stacheSearchReporter'];

module.exports = {
  'reporter:stache-search-reporter': ['type', stacheSearchReporter],
};
