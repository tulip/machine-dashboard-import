const csv = require('csvtojson');
const fs = require('fs');

let callback = () => {
    console.log('file saved');
};

// Get data to import from csv file
module.exports = {
    saveJsonFile: (outputPath, json) => {
        let fileString = JSON.stringify(json);
        fs.writeFile(outputPath, fileString, 'utf8', callback);
    }
};
