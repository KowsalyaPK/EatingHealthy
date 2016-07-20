var webApp = angular.module('eatingHealthyWebApp');

webApp.service("persistantStorageService", ['$window', function ($window) {
    this.image = {};

    this.setJSONItem = function (item, value) {
        $window.localStorage && $window.localStorage.setItem(item, JSON.stringify(value));
    };


    this.setItem = function (item, value) {
        $window.localStorage && $window.localStorage.setItem(item, value);
    };


    this.getJSONItem = function (key) {
        this.image = JSON.parse($window.localStorage.getItem(key));
        return this.image;
    };


    this.getItem = function (key) {
        var value = $window.localStorage.getItem(key);
        return value;
    };
}]);



//webApp.service("saveStateService", [function () {
//
//}]);

webApp.service("DateTimeFormatService", [function () {

    this.formatTime = function (time) {
        var hour = time.substr(0, 2);
        var min = time.substr(3, 2);
        var meridiem = "AM";
        if (hour > 12) {
            hour = hour - 12;
            meridiem = "PM";
        }
        return hour + " : " + min + " " + meridiem;
    };


    this.formatDate = function (date) {
        var newDate = date.substr(3, 3) + date.substr(0, 3) + date.substr(6, 4);
        return new Date(newDate);
    };

}]);