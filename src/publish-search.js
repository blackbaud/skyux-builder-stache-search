'use strict';

const btoa = require('btoa');
const fs = require('fs-extra');
const request = require('request');
const path = require('path');
const audienceId = process.env.audienceId;
const endpoint = process.env.endpoint;
const filePath = path.join(process.cwd(), 'src', 'stache', 'search', 'search.json');
const errorHandler = require('./error-handler');
const utils = require('./utils/shared');

function getSearchData() {
  try {
    let file = fs.readJsonSync(filePath);
    return JSON.stringify(file);
  } catch (error) {
    return errorHandler(new Error(`[ERROR]: Unable to read search file at ${filePath}! ${error.message}`));
  }
}

function publishSearch(argv, config) {
  let doesSearchConfigExist = utils.checkConfig(config, 'allowSiteToBeSearched');
  if (
    doesSearchConfigExist &&
    config.appSettings.stache.searchConfig.allowSiteToBeSearched === false
  ) { return; }

  if (!fs.existsSync(filePath)) {
    return errorHandler(new Error('[ERROR]: Search json file does not exist!'), config);
  }

  if (!endpoint) {
    return errorHandler(new Error('[ERROR]: An endpoint is required to publish stache search data!'), config);
  }

  const sasOptions = {
    method: 'POST',
    uri: `https://service-authorization.sky.blackbaud.com/oauth2/token?grant_type=client_credentials&audience_id=${encodeURIComponent(audienceId)}`,
    headers: {
      'Authorization': `Basic ${btoa('s21astc00paas\\Blackbaud.Stache.SearchService.NodeClient:8lANXg4E)$b*qE@dH2wzh|MsnPti]Unj')}`
    }
  };

  let token = [];

  request(sasOptions)
    .on('error', error => {
      return errorHandler(new Error(`[ERROR]: Unable to retrieve SAS JWT! ${error.message}`));
    })
    .on('data', data => {
      token.push(data);
    })
    .on('end', () => {
      token = JSON.parse(Buffer.concat(token).toString());
      const publishOptions = {
        uri: endpoint,
        rejectUnauthorized: false,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.access_token}`
        },
        body: getSearchData()
      };
      request(publishOptions)
        .on('error', error => {
          errorHandler(new Error(`[ERROR]: Unable to post search data! ${error.message}`), config);
        })
        .on('response', response => {
          if (response.statusCode === 200) {
            return console.log(`${response.statusCode}: Search data successfully posted!`);
          }
          errorHandler(new Error(`[ERROR]: Unable to post search data! ${response.statusCode}`), config);
        });
    });
}

module.exports = publishSearch;
