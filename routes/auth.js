//var fs = require('fs');
//var usersAcc        =   require('./userData/userinfo.json');
var usersAcc;

var Dropbox = require("dropbox");

// authenticates the key, secret and access token to give permission for the client (new created dropbox client) to access the dropbox account corresponding to the key passed
var client = new Dropbox.Client({
    key: "tmpm127opkcyxn2",
    secret: "nyyvdx9emavajpx",
    token: "SuDrmGhw-cAAAAAAAAAAFcv0IaWPJ4X-FAGrcRVK6_F-Ds6fdWgjNUMIeyNoEJbT",
    sandbox: false
});



//  Signin Authentication Code
//  0  ---  Login / Sign up - No error
//  1  ---  Login - Username and Password doesnot match
//  2  ---  Login - User not found
//  3  ---  Sign up - Already have an account (email Id is already registered)



var signin = function (req, res) {
    var email = req.query.email;
    var loginData = {};

    client.readFile('userInfo.json', function (error, data) {
        usersAcc = JSON.parse(data);

        // check if mailId is present
        if (usersAcc[email]) {
            // check if mailId and password matches
            if (req.query.pass === usersAcc[email].password) {
                var userData = {
                    username: usersAcc[email].username,
                    emailId: email
                };
                //                var username = usersAcc[email].username;
                loginData.code = 0;
                loginData.message = userData;
            } else {
                loginData.code = 1;
                loginData.message = "Username and Password doesnot match";
            }
        } else {
            loginData.code = 2;
            loginData.message = "User not found";
        }

        res.send(loginData);
    });
};



var signup = function (req, res) {
    var email = req.query.email;
    var loginData = {};

    client.readFile('userInfo.json', function (error, data) {
        usersAcc = JSON.parse(data);

        if (usersAcc[email]) {
            loginData.code = 3;
            loginData.message = "You already have an account, login to continue";
        } else {
            // save new user to the userinfo.json file
            usersAcc[email] = {
                "username": req.query.name,
                "password": req.query.pass
            };

            var allUsers = JSON.stringify(usersAcc);
            client.writeFile('userInfo.json', allUsers, function (error, stat) {
                if (error) {
                    return error;
                }
                console.log('user JSON upload success');
                //            return "user JSON updated";
            });

            var userData = {
                username: req.query.name,
                emailId: email
            };
            loginData.code = 0;
            loginData.message = userData;
        }
        res.send(loginData);
    });
};




module.exports.signin = signin;
module.exports.signup = signup;