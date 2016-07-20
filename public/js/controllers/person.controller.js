var webApp = angular.module('eatingHealthyWebApp');

webApp.controller('PersonController', ['$scope', '$http', '$rootScope', '$stateParams', 'persistantStorageService', 'DateTimeFormatService', function ($scope, $http, $rootScope, $stateParams, persistantStorageService, DateTimeFormatService) {

    $scope.person = $stateParams.person;

    // when page refreshed, get the userDetails from Local Storage
    if ($scope.person === false) {
        console.log('refreshed');
        $scope.person = persistantStorageService.getJSONItem('person');
        $rootScope.images = persistantStorageService.getJSONItem($scope.person.id);
    }

    //    $scope.maxDate = new Date();
    $scope.startMaxDate = new Date().toISOString().substring(0, 10);
    $scope.startMinDate = new Date('2016-05-01').toISOString().substring(0, 10);



    $scope.getAppUserImages = function () {
        // when page refreshed or when referred back to the same person, get the appUserImages from Local Storage
        if ($scope.person.id === persistantStorageService.getItem('personId')) {
            console.log('referred back');
            $scope.allImageList = Object.keys($rootScope.images);
            $scope.allImages = $rootScope.images;
        } else {
            persistantStorageService.setItem('personId', $scope.person.id);
            var data = {
                params: {
                    id: $scope.person.id
                }
            };
            $http.get('/getAppUserImages', data).then(function (data) {
                persistantStorageService.setJSONItem($scope.person.id, data.data);
                $rootScope.images = data.data;
                $rootScope.userImages = $rootScope.images;
                $scope.allImageList = Object.keys($rootScope.images);
                $scope.allImages = $rootScope.images;
            });
        }
    };
    $scope.getAppUserImages();


    $scope.filterImages = function () {
        $scope.allImages = {};
        var newDate, date, startIndex;

        var filterByDate = function (element) {
            startIndex = element.indexOf('imagedate');
            date = element.substr(startIndex + 9, 10);
            newDate = DateTimeFormatService.formatDate(date);
            if (newDate >= $scope.startDate && newDate <= $scope.endDate) {
                $scope.allImages[element] = $rootScope.images[element];
            }
        };

        $scope.allImageList.some(filterByDate);
        $rootScope.userImages = $scope.allImages;
    };
}]);