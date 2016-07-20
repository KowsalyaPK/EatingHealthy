var webApp = angular.module('eatingHealthyWebApp');

webApp.service("fileTransferService", ['$http', '$q', function ($http, $q) {

    this.getImage = function (image) {
        var deffered = $q.defer();
        var paramData = {
            params: {
                filePath: image.imageLocation,
                fileName: image.imageName
            }
        };
        this.connectToServer('/downloadImage', paramData).then(function (result) {
            deffered.resolve(result.data);
        }, function (error) {
            deffered.reject(error);
        });
        return deffered.promise;
    };

    this.writeToFile = function (path, data) {
        var deffered = $q.defer();
        var paramData = {
            params: {
                filePath: path,
                fileData: data
            }
        };
        this.connectToServer('/writeToFile', paramData).then(function (result) {
            deffered.resolve(result.data);
        }, function (error) {
            deffered.reject(error);
        });
        return deffered.promise;
    };

    this.connectToServer = function (url, data) {
        var deffered = $q.defer();
        $http.get(url, data).then(function (result) {
            deffered.resolve(result);
        }, function (error) {
            deffered.reject(error);
        });
        return deffered.promise;
    };

}]);