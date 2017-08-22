// remove search json blob after publication

const fs = require('fs');
const path = require('path');

function removeSearchJsonFileFromProject(argv, config) {
    if (config.appSettings.search) {
        try {
            let filePath = path.join(process.cwd(), 'src', 'stache', 'search', 'search.json');
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            throw new Error('[ERROR]: Unable to remove stache search template from e2e directory.');
        }
    }
}

module.exports = removeSearchJsonFileFromProject;
