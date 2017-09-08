'use strict';

const fs = require('fs-extra');
const request = require('request');
const path = require('path');
const endpoint = process.env.searchEndpoint;
const token = process.env.token;
const filePath = path.join(process.cwd(), 'src', 'stache', 'search', 'search.json');
const errorHandler = require('./error-handler');

function getSearchData() {
    try {
        let file = fs.readJsonSync(filePath);
        return JSON.stringify(file);
    } catch (error) {
       return errorHandler(new Error(`[ERROR]: Unable to read search file at ${filePath}! ${error.message}`));
    }
}

function publishSearch(argv, config) {
    if (!(((config || {}).appSettings || {}).stache || {}).search || !fs.existsSync(filePath)) {
        process.exit(0);
        return;
    }

    if (!endpoint) {
       return errorHandler(new Error('[ERROR]: An endpoint is required to publish stache search data!'), config);
    }

    if (!token) {
       return errorHandler(new Error('[ERROR]: A token is required to publish stache search data!'), config);
    }

    const options = {
        uri: endpoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: getSearchData()
    };

    request(options, (err, response) => {
        if (err) {
           return errorHandler(new Error(`[ERROR]: Unable to post search data! ${err.message}`), config);
        }
        console.log(`${response.statusCode}: Search data successfully posted!`);
    });
}

module.exports = publishSearch;