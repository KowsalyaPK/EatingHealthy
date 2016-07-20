var webApp = angular.module('eatingHealthyWebApp');

webApp.directive('imageCard', [function () {

    var imageCardController = function ($scope, $state, persistantStorageService, fileTransferService) {

        $scope.goToRank = function () {
            persistantStorageService.setItem('index', $scope.index);
            persistantStorageService.setJSONItem('image', $scope.image);
            $state.go('rank', {
                image: $scope.image,
                index: $scope.index
            });
        };


        $scope.showImage = true;

        $scope.downloadImage = function (image) {
            $scope.showImage = false;
            fileTransferService.getImage(image).then(function (data) {
                $scope.showImage = true;
            }, function (error) {
                console.log(error);
            });
        };


        $scope.urlForImage = function (image) {
            if (image !== "" && image !== undefined) {
                var imageUrl = "../appData/" + image.imageLocation;
                return imageUrl;
            }
        };
    };

    return {
        restrict: 'E',
        scope: {
            image: '=',
            index: '='
        },
        // link: function () {},
        controller: imageCardController,
        templateUrl: './templates/imageCard.html',
        replace: true
    };
}]);