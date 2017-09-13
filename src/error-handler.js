function errorHandler(err, config) {
  console.error(err);
  require('./remove-search-spec')(null, config);
  require('./remove-search-json')(null, config);
  process.exit(1);
}

module.exports = errorHandler;
