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
    return errorHandler(new Error('[ERROR]: Site name is required to add search spec!'), config);
  }

  const template = `// Use browser to access other sites (that are running angular)
import { browser, element, by } from 'protractor';

// Use SkyHostBrowser to access your locally served SPA
import { SkyHostBrowser } from '@blackbaud/skyux-builder/runtime/testing/e2e';

const fs = require('fs');
const path = require('path');

const mapFilePaths = (config: any) => {
  let routes = config.runtime.routes
    .map((route: any) => {
      return '/' + route.routePath;
    })
    .filter((route: string) => {
      if (route.indexOf('*') > -1) {
        return false;
      }
      if (route === '/') {
        return false;
      }
      return route;
    });
  routes.push('/');
  return routes;
};

const initSearchConfig = (config: any, siteName: string): any => {
  let result: any = {};
  let doesSearchConfigExist: boolean = (
    config.skyux &&
    config.skyux.appSettings &&
    config.skyux.appSettings.stache &&
    config.skyux.appSettings.stache.searchConfig
  );

  result.id = siteName;
  result.site_names = [siteName];
  result.is_internal = true;

  if (doesSearchConfigExist) {
    let searchConfig = config.skyux.appSettings.stache.searchConfig;
    result.site_names = searchConfig.site_names || result.site_names;
    result.is_internal = searchConfig.is_internal !== undefined ? searchConfig.is_internal : result.is_internal;
  }

  return result;
};

describe('Search Results', () => {
  let files: string[];

  function removeUnnecessaryElements() {
    Array.from(
      document.querySelectorAll(
        '.stache-sidebar, .stache-breadcrumbs, .stache-table-of-contents'
      )
    ).forEach(el => el.remove());
  }

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
  });

  it('should generate search results', (done) => {
    // Separate configs are required in order to read the host url.
    // This could be different from the e2e host url.

    let config: any = browser.params.skyPagesConfig;
    let buildConfigPath: string = path.resolve(process.cwd(), 'skyuxconfig.build.json');
    let baseConfig: any = require('../skyuxconfig.json');
    let buildConfig: any = fs.existsSync(buildConfigPath) ? require(buildConfigPath) : undefined;
    files = mapFilePaths(config);
    let siteName: string = '${argv.siteName}';

    let url: string;
    if (buildConfig) {
      url = buildConfig.host.url;
    } else if (baseConfig.host) {
      url = baseConfig.host.url;
    } else {
      url = config.skyux.host.url;
    }

    let searchConfig = initSearchConfig(config, siteName);
    let content: any = {
      config: searchConfig,
      site_name: siteName,
      stache_page_search_data: []
    };

    function writeSearchFile(searchDirPath: string) {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          path.join(searchDirPath, 'search.json'),
          JSON.stringify(content),
          (error: any) => {
            error ? reject(error) : resolve();
          }
        );
      });
    }

    function scrapePageContent(file: string) {
      let pageContent: any = {
        host: url,
        site_name: siteName,
        path: file
      };

      return SkyHostBrowser
        .get(file, 3000)
        .then(() => {
          return browser.executeScript(removeUnnecessaryElements);
        })
        .then(() => {
          return element(by.css('.stache-wrapper')).getText();
        })
        .then((text: string) => {
          pageContent['text'] = text.replace(/\n/g, ' ');
          return element(by.css('.stache-page-title, .stache-tutorial-heading, h1')).getText();
        })
        .then((text: string) => {
          pageContent['title'] = text;
          return pageContent;
        })
        .catch((error: any) => {
          if (error.name === 'NoSuchElementError') {
            console.log(
              'Must have the <stache> tag and a pageTitle on page '
              + file + ' to scrape content.'
            );
            return pageContent;
          } else if (error.message.indexOf('Angular could not be found on the page') > -1) {
            console.log('Angular not found on page ' + file + '. Skipping.');
            return pageContent;
          } else {
            throw new Error(error);
          }
        });
    }

    Promise.all(files.map(file => {
      return scrapePageContent(file);
    }))
      .then(pageContents => {
        let searchDirPath = path.join(
          __dirname,
          '..',
          'src',
          'stache',
          'search'
        );

        content.stache_page_search_data = pageContents;

        if (!fs.existsSync(searchDirPath)) {
          fs.mkdirSync(searchDirPath);
        }
        return writeSearchFile(searchDirPath);
      })
      .then(() => done())
      .catch((error: any) => {
        console.log('ERROR', error);
        expect(error).toBeNull();
        done();
      });
  });
});
`;

  try {
    let filePath = path.join(process.cwd(), 'e2e');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }
    fs.writeFileSync(path.join(filePath, 'stache-search.e2e-spec.ts'), template);
  } catch (error) {
    return errorHandler(new Error('[ERROR]: Unable to add stache search template to e2e directory.'), config);
  }
}

module.exports = addSearchSpecToProject;
