# Stache Search

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-builder-stache-search.svg)](https://www.npmjs.com/package/@blackbaud/skyux-builder-stache-search)
[![status](https://travis-ci.org/blackbaud/skyux-builder-stache-search.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-builder-stache-search)

These commands create the assets required to scrape a Stache SKYUX SPA and publish the resulting JSON blob to an Azure Search Service Index.

## Installation

```
npm install --save-dev @blackbaud/skyux-builder-stache-search
```

## Usage

Add `searchConfig` to the `stache` object in your `skyuxconfig.json` file's `appSettings` in order to configure variables for the search commands. All of these are configured by default:

```
"appSettings": {
  "stache": {
    "searchConfig": {
      "allowSiteToBeSearched": true,
      "is_internal": true,
      "site_names": ['stache2'],
      "is_globally_searchable": true
    }
  }
}
```

### allowSiteToBeSearched

This setting determines if a site should be searched or not. The default is `true`. Setting this to `false` short circuits the commands during the build and release process, preventing the site from being scraped and the results published.

### is_internal

This setting indicates whether a Stache site is internal only or not. The default is `true`. If set to `false`, the site's search contents will be available via the public endpoint for non-Blackbaud employees to view.

### site_names

This setting determines which Stache sites should be included in the search results. The default is only the site you are currently on. If you add other site names to the array, it will add those sites' contents to the searchable content.

### is_globally_searchable

This setting determines whether the site will be included on the global search page. The default is set `true`, allowing your sites content to appear on the global [stache search](https://docs.blackbaud.com/docs-search/). If set to `false`, your site content will only be searchable when queried directly.

## Found an issue?

Please log all issues related to Stache (and its plugins) at [blackbaud/stache2](https://github.com/blackbaud/stache2/issues).
