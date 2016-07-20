var express = require('express');
var bodyParser = require('body-parser');

var app = express();


// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(express.static(__dirname + '/public'));

var router = express.Router();
var auth = require('./routes/auth');
var appToDropbox = require('./routes/appToDropbox');
var webToDropbox = require('./routes/webToDropbox');


//  Functions for sign and signup in the app
router.get('/signin', auth.signin);
router.get('/signup', auth.signup);


// Mobile app functions
// Functions to download and upload images from the mobile app
router.post('/upload', appToDropbox.readUploadingFile);
router.get('/download', appToDropbox.download);
router.get('/writeToJSON', appToDropbox.writeToJSON);



// Functions called from the web app used by the Nutritionist to rank the image
// ---->> Functions to read the imageInfo json
// ---->> to update the new rank given by the Nutritionist back to the imageInfo json
// ---->> to downlod images to review and rank
router.get('/getAppUsers', appToDropbox.getAppUsers);

router.get('/getAppUserImages', webToDropbox.getAppUserImages);
router.get('/downloadImage', webToDropbox.downloadImage);
router.get('/writeToFile', webToDropbox.writeToFile);

//app.get('/sessions/:id', sessions.findById);


app.set('port', process.env.PORT || 5000);
app.use('/', router);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});