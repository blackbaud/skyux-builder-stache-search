const https = require('https');
const fs = require('fs');
const path = require('path');
const endpoint = process.env.searchEndpoint;
const token = process.env.token;
const filePath = path.join(process.cwd(), 'src', 'stache', 'search', 'search.json');

if (!endpoint) {
    throw new Error('[ERROR]: An endpoint is required to publish stache search data!');
}

if (!token) {
    throw new Error('[ERROR]: A token is required to publish stache search data!');
}

function getSearchData() {
    try {
        return fs.readFileSync(filePath);
    } catch (error) {
        throw new Error(`[ERROR]: Unable to read search file at ${filePath}! ${error.message}`);
    }
}

function publishSearch(argv, config) {
    if (!fs.existsSync(filePath)) {
        process.exit(0);
        return;
    }

    const options = {
        hostname: endpoint,
        path: '/publisher',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    return new Promise((resolve, reject) => {
        let rawData = '';
        let request = https.request(options, res => {
            res.on('data', chunk => {
                rawData += chunk;
            });
            res.on('end', () => {
                let parsedData = JSON.parse(rawData);
                resolve(parsedData);
            });
            res.on('error', error => {
                reject(new Error(`[ERROR]: Unable to post search data! ${error.message}`));
            });
        });

        request.on('error', error => {
            reject(new Error(`[ERROR]: Problem with search post request! ${error.message}`));
        });

        request.write(getSearchData());
        request.end();
    });
}

module.exports = publishSearch;
