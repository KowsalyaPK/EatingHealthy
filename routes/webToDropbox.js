var fs_extra = require('fs-extra');
var q = require('q');
var Dropbox = require("dropbox");


// authenticates the key, secret and access token to give permission for the client (new created dropbox client) to access the dropbox account corresponding to the key passed
var client = new Dropbox.Client({
    key: "tmpm127opkcyxn2",
    secret: "nyyvdx9emavajpx",
    token: "SuDrmGhw-cAAAAAAAAAAFcv0IaWPJ4X-FAGrcRVK6_F-Ds6fdWgjNUMIeyNoEJbT",
    sandbox: false
});



var downlaodImagefromDropbox = function (filePath) {
    var deffered = q.defer();

    client.readFile(filePath, {
        buffer: true
    }, function (error, data) {
        if (error) {
            console.log(error); // Something went wrong.
            deffered.reject(error);
        }

        var newFilePath = "public/appData/" + filePath;
        fs_extra.outputFile(newFilePath, data, 'base64', function (error) {
            if (error) {
                console.log(error); // Something went wrong.
                deffered.reject(error);
            }
            console.log('image downloaded successfully');
            deffered.resolve(newFilePath);
        });
    });

    return deffered.promise;
};


var downloadImage = function (req, res) {
    var params = req.query;
    var filePath = params.filePath;
    downlaodImagefromDropbox(filePath).then(function (filePath) {
        res.send(filePath);
    });
};


var getAppUserImages = function (req, res) {
    var params = req.query;
    var filePath = params.id + "/allImages.json";
    client.readFile(filePath, function (error, data) {
        if (error) {
            console.log(error); // Something went wrong.
        }
        res.send(data);
    });
};


var writeToFile = function (req, res) {
    var params = req.query;
    var filePath = params.filePath;
    var data = params.fileData;
    //    var jsonData = JSON.stringify(data);
    var jsonData = data;
    client.writeFile(filePath, jsonData, function (error) {
        if (error) {
            res.send(error);
        }
        console.log('JSON upload success');
        res.end();
    });
};


module.exports.downloadImage = downloadImage;
module.exports.getAppUserImages = getAppUserImages;
module.exports.writeToFile = writeToFile;