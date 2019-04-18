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

const fs = require('fs-extra');
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
  result.is_globally_searchable = true;

  if (doesSearchConfigExist) {
    let searchConfig = config.skyux.appSettings.stache.searchConfig;
    result.site_names = searchConfig.site_names || result.site_names;
    result.is_internal = searchConfig.is_internal !== undefined ?
      searchConfig.is_internal
      : result.is_internal;
    result.is_globally_searchable = searchConfig.is_globally_searchable !== undefined ?
      searchConfig.is_globally_searchable
      : result.is_globally_searchable;
  }

  return result;
};

describe('Search Results', () => {
  let files: string[];

  function removeUnnecessaryElements() {
    Array.from(
      document.querySelectorAll(
        '.stache-sidebar, .stache-breadcrumbs, .stache-table-of-contents, stache-hide-from-search'
      )
    ).forEach(el => el.remove());
  }

  let internalOnlyContent: string[] = [];
  function storeInternalOnlyContent() {
    Array.from(
      document.querySelectorAll(
        'stache-internal, skyux-restricted-view, .skyux-restricted-view'
      )
    ).forEach((el: HTMLElement) => {
      internalOnlyContent.push(el.innerText);
      el.remove();
    });
  }

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
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
        path: file,
        is_internal: searchConfig.is_internal,
        is_globally_searchable: searchConfig.is_globally_searchable
      };

      let pageContentList: any[] = [];

      return browser
        .executeScript(
          \`window.postMessage({ messageType: 'sky-navigate-e2e', url: ['\${file}'] }, '*')\`
        )
        .then(() => browser.getCurrentUrl())
        .then((currentUrl: string) => {
          if (currentUrl.indexOf(file) === -1) {
            console.warn(
              'Newer version of SKY UX Builder drastically decreases this test time.'
            );
            return SkyHostBrowser.get(file, 3000);
          }
        })
        .then(() => {
          return browser.executeScript(removeUnnecessaryElements);
        })
        .then(() => {
          return browser.executeScript(storeInternalOnlyContent);
        })
        .then(() => {
          return element(by.css('.stache-wrapper'))
          .getText()
          .then(text => {
            pageContent['text'] = text.replace(/\\n/g, ' ');

            const title = element.all(by.css('.stache-page-title, .stache-tutorial-heading, h1'))
              .first()
              .getText();

            pageContent['title'] = title;
            pageContentList.push(pageContent);
            return;
          });
        })
        .then(() => {
          if (internalOnlyContent.length) {
            const text = internalOnlyContent.join('\\n');

            pageContent['text'] = text.replace(/\\n/g, ' ');

            const title = element.all(by.css('.stache-page-title, .stache-tutorial-heading, h1'))
              .first()
              .getText();

            pageContent['title'] = title;
            pageContent['is_internal'] = true;
            pageContent['site_name'] = pageContent['site_name'] + '-internal-view';
            pageContentList.push(pageContent);
          }
          return pageContentList;
        })
        .catch((error: any) => {
          // The e2e test will fail if we don't handle these errors properly. Certain pages may not have a
          // Stache tag or a heading. We don't want the scraper to fail the build in this case.
          if (error.name === 'NoSuchElementError') {
            console.log(
              'Must have the <stache> tag and a pageTitle on page '
              + file + ' to scrape content.'
            );
            return pageContent;
          } else if (error.message.indexOf('Angular could not be found on the page') > -1) {
            // Same theory here. Some pages, such as ones that redirect to other sites, may cause an
            // Angular not found on page error. In this case, we just want to skip the page and move
            // on rather than failing the build.
            console.log('Angular not found on page ' + file + '. Skipping.');
            return pageContent;
          } else {
            throw new Error(error);
          }
        });
    }

    console.log('Scraping ' + files.length + ' files');

    SkyHostBrowser
      .get('/', 3000)
      .then(() => browser.waitForAngularEnabled(false))
      .then(() => Promise.all(files.map(file => {
        return scrapePageContent(file);
      }))
      .then(() => Promise.all(files.map(file => {
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

        content.stache_page_search_data = pageContents.filter((page: any) => {
          return (page.text !== undefined && page.text !== '');
        });

        fs.ensureDirSync(searchDirPath);
        return writeSearchFile(searchDirPath);
      })
      .then(() => done())
      .catch((error: any) => {
        console.log('ERROR', error);
        expect(error).toBeNull();
        done();
      }));
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
