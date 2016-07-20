var webApp = angular.module('eatingHealthyWebApp');

var filterNames = function () {
    return function (users, filterLetter) {
        var startsWith = function (element, letter) {
            if (letter === "") {
                return true;
            }
            return element.name.toLowerCase().indexOf(letter.toLowerCase()) === 0;
        };

        var key, isInitial, newFilterUsers = [];
        for (key in users) {
            isInitial = startsWith(users[key], filterLetter);
            if (isInitial) {
                newFilterUsers.push(users[key]);
            }
        }

        return newFilterUsers;
    };
};

webApp.filter('filterNames', filterNames);