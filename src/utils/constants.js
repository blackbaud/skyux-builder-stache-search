const { join } = require('path');

const CWD = process.cwd();

module.exports = {
  KarmaConfigFilePath: join(CWD, 'karma-stache-search.conf.js'),
  OutputFilePath: join(CWD, 'src/stache/search/search.json'),
  SpecFilePath: join(CWD, 'src/app/stache-search.spec.ts'),
};
