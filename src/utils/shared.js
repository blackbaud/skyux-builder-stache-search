const btoa = require('btoa');
const request = require('request');
const logger = require('@blackbaud/skyux-logger');
const errorHandler = require('../error-handler');

function makeRequest(config, body, method = 'POST') {
  if (!body || !config) {
    return errorHandler(
      new Error('[ERROR]: A request body and config are required!')
    );
  }

  let { audienceId, clientKey, clientUserName, endpoint } = config;

  let encodedCredentials = btoa(`${clientUserName}:${clientKey}`);

  const sasOptions = {
    method,
    uri: `https://service-authorization.sky.blackbaud.com/oauth2/token?grant_type=client_credentials&audience_id=${encodeURIComponent(
      audienceId
    )}`,
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  };

  let token = [];

  request(sasOptions)
    .on('error', (error) => {
      return errorHandler(
        new Error(`[ERROR]: Unable to retrieve SAS JWT! ${error.message}`)
      );
    })
    .on('data', (data) => {
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
          Accept: 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
        body: body,
      };
      request(publishOptions)
        .on('error', (error) => {
          errorHandler(
            new Error(`[ERROR]: Unable to post search data! ${error.message}`),
            config
          );
        })
        .on('response', (response) => {
          if (response.statusCode === 200) {
            return logger.info(
              `${response.statusCode}: Search data successfully posted!`
            );
          }

          let data = '';

          response.on('data', (chunk) => {
            data += chunk;
          });

          response.on('end', () => {
            errorHandler(
              new Error(
                `[ERROR]: Unable to post search data! ${response.statusCode} : ${data}`
              ),
              config
            );
          });
        });
    });
}

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
  makeRequest,
  readConfig,
};
