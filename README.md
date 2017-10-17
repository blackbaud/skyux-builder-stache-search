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
      "endpoints": {
        "internal": "query",
        "public": "query-public"
      },
      "htmlFields": {
        "description": true
      },
      "moreResultsUrl": "https://blackbaud.com",
      "moreResultsLabel": "Show More",
      "url": "https://stache-search-query.sky.blackbaud.com"
    }
  }
}
```

### allowSiteToBeSearched

This setting determines if a site should be searched or not. The default is `true`. Setting this to `false` short circuits the commands during the build and release process, preventing the site from being scraped and the results published.

### is_internal

This setting indicates whether a Stache site is internal only or not. The default is `true`. If set to `false`, the site's search contents will be available via the public endpoint for non-Blackbaud employees to view.

### site_names

This setting determines which Stache sites should be included in the search results. The default is only the site you are currently on. If you add other site names to the array, it will add those sites' contents to the searchable content. You can search all sites by setting this to an empty array.

### endpoints

This setting determines which endpoints you should hit for internal only and the public queries. Internal only queries are locked behind auth. The defaults are `query` for internal and `query-public` for public. 

### htmlFields

This setting indicates whether a field should include HTML in the search results in the omnibar. This is primarily used for search hit highlighting. The default is `description`.

### moreResultsUrl

This is the url for the link to more results at the end of the Omnibar search results list. The default is `undefined`.

### moreResultsLabel

This is the label for the more results link in the Omnibar search results. The default is `Show More`.

### url

This is the url for the search query service. When combined with the `endpoints`, it creates the url for the search to query. The default is `https://stache-search-query.sky.blackbaud.com`.

## Found an issue?

Please log all issues related to Stache (and its plugins) at [blackbaud/stache2](https://github.com/blackbaud/stache2/issues).
