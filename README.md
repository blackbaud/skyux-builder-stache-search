# Stache Search

[![npm](https://img.shields.io/npm/v/@blackbaud/skyux-builder-stache-search.svg)](https://www.npmjs.com/package/@blackbaud/skyux-builder-stache-search)
[![status](https://travis-ci.org/blackbaud/skyux-builder-stache-search.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-builder-stache-search)

These commands create the assets required to scrape a Stache SKYUX SPA and publish the resulting JSON blob to an Azure Search Service Index.

## Installation

```
npm install --save-dev @blackbaud/skyux-builder-stache-search
```

## Usage

Add `search: true` to the `stache` object in your `skyuxconfig.json` file's `appSettings`:

```
appSettings: {
  stache: {
    search: true
  }
}
```

## Found an issue?

Please log all issues related to Stache (and its plugins) at [blackbaud/stache2](https://github.com/blackbaud/stache2/issues).
