  function checkConfig(config, key) {
    if (
      config &&
      config.appSettings &&
      config.appSettings.stache &&
      config.appSettings.stache.searchConfig
    ) {
      if (key) {
        return config.appSettings.stache.searchConfig[key] !== undefined ? true : false;
      }
      return true;
    }
    return false;
}

module.exports = {
  checkConfig
};
