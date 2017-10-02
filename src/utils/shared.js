  function readConfig(config, key) {
    if (
      config &&
      config.appSettings &&
      config.appSettings.stache &&
      config.appSettings.stache.searchConfig
    ) {
        return config.appSettings.stache.searchConfig[key];
    }
    return undefined;
}

module.exports = {
  readConfig
};
