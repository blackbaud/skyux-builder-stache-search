const path = require('path');
const fs = require('fs');

const template = `// Use browser to access other sites (that are running angular)
import { browser, element, by } from 'protractor';

// Use SkyHostBrowser to access your locally served SPA
import { SkyHostBrowser } from '@blackbaud/skyux-builder/runtime/testing/e2e';

const fs = require('fs');
const path = require('path');

const walkSync = (dir, filePaths: string[] = []) => {
  let files = fs.readdirSync(dir);
  files.forEach(file => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filePaths = walkSync(path.join(dir, file), filePaths);
    } else {
      if (file.includes('index.html')) {
        filePaths.push(path.join(dir, file));
      }
    }
  });
  return filePaths;
};

describe('Search Results', () => {
  let files;

  function removeUnnecessaryElements() {
    Array.from(
      document.querySelectorAll(
        '.stache-sidebar, .stache-breadcrumbs, .stache-table-of-contents'
      )
    ).forEach(el => el.remove());
  }

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500000;
    files = walkSync(path.join(__dirname, '..', 'src', 'app'));
    files = files.map(file => {
      let route = file.split('/app')[1];
      route = route.slice(0, route.length - 11);
      if (route === '') {
        route = '/';
      }
      return route;
    });
  });

  it('should generate search results', (done) => {
    let config = JSON.parse(browser.params.skyPagesConfig);
    let appName = config.skyux.name;
    if (!appName) {
      const packageFile = require('../package.json');
      appName = packageFile.name;
    }
    let url = config.skyux.host.url;
    let content = {
      name: appName,
      url: url
    };

    function writeSearchFile(searchDirPath) {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          path.join(searchDirPath, 'search.json'),
          JSON.stringify(content),
          (err) => {
            err ? reject(err) : resolve();
          }
        );
      });
    }

    function scrapePageContent(file: string) {
      let pageContent = { path: file };
      return SkyHostBrowser
        .get(file)
        .then(() => {
          return browser.executeScript(removeUnnecessaryElements);
        })
        .then(() => {
            return element(by.css('.stache-wrapper')).getText();
        })
        .then(text => {
          pageContent['text'] = text;
          return element(by.css('.stache-page-title')).getText();
        })
        .then(text => {
          pageContent['title'] = text;
          return pageContent;
        })
        .catch(error => {
          if (error.name === 'NoSuchElementError') {
            console.log('Must have the <stache> tag and a pageTitle on page to scrape content.');
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

        content['content'] = pageContents;

        if (!fs.existsSync(searchDirPath)) {
          fs.mkdirSync(searchDirPath);
        }
        return writeSearchFile(searchDirPath);
      })
      .then(() => done())
      .catch(error => {
        console.log('ERROR', error);
        expect(error).toBeNull();
        done();
      });
  });
});
`

function addSearchSpecToProject(argv, config) {
    if (config.appSettings.search) {
        try {
            let filePath = path.join(process.cwd(), 'e2e');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }
            fs.writeFileSync(path.join(filePath, 'stache-search.e2e-spec.ts'), template);
        } catch (error) {
            throw new Error('[ERROR]: Unable to add stache search template to e2e directory.');
        }
    }
}

module.exports = addSearchSpecToProject;
