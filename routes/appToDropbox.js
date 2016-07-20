var fs = require('fs');
var multer = require('multer');
var Dropbox = require("dropbox");
var activeAppUsers = require('./userData/activeAppUser.json');

// authenticates the key, secret and access token to give permission for the client (new created dropbox client) to access the dropbox account corresponding to the key passed
var client = new Dropbox.Client({
    key: "tmpm127opkcyxn2",
    secret: "nyyvdx9emavajpx",
    token: "SuDrmGhw-cAAAAAAAAAAFcv0IaWPJ4X-FAGrcRVK6_F-Ds6fdWgjNUMIeyNoEJbT",
    sandbox: false
});


// TO DO
// upload image one by one from app
// read about handling multiple file uploads


// helps to identifies the active users of the app
// when the user starts using the app, user is moved to activeUser json file
// to filter out users who just registered and not using the app
var updateActiveUser = function (userId) {
    if (activeAppUsers[userId]) {
        console.log('id present');
    } else {
        activeAppUsers[userId] = true;
        var activeAppUserJSON = JSON.stringify(activeAppUsers);
        fs.writeFile('./routes/userData/activeAppUser.json', activeAppUserJSON, function (err) {
            //        fs.writeFile('./routes/userData/activeAppUser.json', activeAppUserJSON, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            // TO DO handle error - rewrite
        });
    }
};


// writes to imageInfo json file
var updateJSON = function (fileDirectory, fileName, imageInfo) {
    var filePath = fileDirectory + "imageInfo.json";
    var jsonData = {};
    client.readFile(filePath, function (error, data) {
        if (data !== undefined) {
            data = JSON.parse(data);
            if (data[fileName] === null || data[fileName] === undefined) {
                data[fileName] = imageInfo;
                jsonData = JSON.stringify(data);
            } else {
                // TO DO handle error
            }
        } else {
            data = {};
            data[fileName] = imageInfo;
            jsonData = JSON.stringify(data);
        }
        client.writeFile(filePath, jsonData, function (error, stat) {
            if (error) {
                return error;
            }
            console.log('JSON upload success');
            return "JSON updated";
        });
    });
};


// upload the file to dropbox using the dropbox client
// and update the imageInfo.json with new image uploaded
var uploadToDropbox = function (req, res) {
    var imageData = req.file.buffer;
    var params = req.body;
    var userId = params.userId;
    var directoryYear = params.directoryYear;
    var directoryMonth = params.directoryMonth;
    var fileName = params.fileName;
    var fileDirectory = userId + '/' + directoryYear + '/' + directoryMonth + '/';
    var filePath = fileDirectory + fileName;

    var startIndex = fileName.lastIndexOf("imagedate") + 9;
    var imageDate = fileName.substr(startIndex, 10);
    var imageTime = fileName.substring(startIndex + 19, fileName.length - 4);

    var imageInfo = {
        "imageLocation": filePath,
        "imageName": fileName,
        "algorithmScore": Math.round(((Math.random() * 9) + 1) * 10) / 10,
        "humanScore": Math.round(((Math.random() * 9) + 1) * 10) / 10,
        "humanRecommendation": "good healthy diet",
        "userAccess": true,
        "timeTaken": imageTime,
        "dateTaken": imageDate
    };

    console.log(imageInfo);
    updateActiveUser(userId);
    updateJSON(fileDirectory, fileName, imageInfo);

    client.writeFile(filePath, imageData, function (error, stat) {
        if (error) {
            res.end(error);
        }
        console.log('File upload success');
        res.end("File uploaded " + stat.revisionTag);
    });
};



// to read the uploaded file as buffer
var upload = multer().single('file');

var readUploadingFile = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.end("Error uploading file.");
        }
        uploadToDropbox(req, res);
    });
};


var download = function (req, res) {
    var params = req.query;
    var filePath = params.userId + "/" + params.directoryYear + "/" + params.directoryMonth + "/" + params.fileName;

    console.log(filePath);

    client.readFile(filePath, {
        buffer: true
    }, function (error, data) {
        if (error) {
            console.log(error); // Something went wrong.
            res.status(500).send(error);
            // res.send(error);
            res.end();
            return;
        }

        res.setHeader('Content-disposition', 'attachment;');
        if (params.fileType === "json") {
            res.setHeader('Content-type', 'application/json');
        } else {
            res.setHeader('Content-type', 'image/jpeg');
        }

        console.log(data); // data has the file's contents
        res.write(data);
        res.end();
    });
};



var writeToJSON = function (req, res) {
    var fileDirectory = req.query.folder;
    var imagename = req.query.imageName;
    var filePath = fileDirectory + "imageInfo.json";
    var jsonData = {};
    client.readFile(filePath, function (error, data) {
        if (data !== undefined) {
            data = JSON.parse(data);
            if (data[imagename] !== null || data[imagename] !== undefined) {
                data[imagename].userAccess = false;
                jsonData = JSON.stringify(data);

                client.writeFile(filePath, jsonData, function (error, stat) {
                    if (error) {
                        return error;
                    }
                    console.log('JSON upload success');
                    res.send('done');
                });

            } else {
                // TO DO handle error
            }
        }

    });
};


/*  Common variable for the mobile app and web app */
/*  get the list of users who have snapped atleast one picture */
var getAppUsers = function (req, res) {
    console.log('redirected');
    res.send(activeAppUsers);
};


module.exports.readUploadingFile = readUploadingFile;
module.exports.download = download;
module.exports.writeToJSON = writeToJSON;
module.exports.getAppUsers = getAppUsers;