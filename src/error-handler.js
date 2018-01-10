const logger = require('./utils/shared').logger;

function errorHandler(err, config) {
  logger.error(err);
  require('./remove-search-spec')(null, config);
  require('./remove-search-json')(null, config);
  throw err;
}

module.exports = errorHandler;
