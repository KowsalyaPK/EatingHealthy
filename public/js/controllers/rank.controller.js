var webApp = angular.module('eatingHealthyWebApp');

webApp.controller('RankController', ['$scope', '$state', '$stateParams', '$rootScope', 'persistantStorageService', 'fileTransferService', 'DateTimeFormatService', function ($scope, $state, $stateParams, $rootScope, persistantStorageService, fileTransferService, DateTimeFormatService) {

    // get image and index from route(stateParams) or get from LocalStorage when page refreshed
    // get details from LocalStorage when refreshed
    $scope.image = $stateParams.image;
    $rootScope.rankedImages = persistantStorageService.getJSONItem('rankedImages');
    $scope.user = persistantStorageService.getJSONItem('person');
    if ($scope.image === false) {
        $scope.image = persistantStorageService.getJSONItem('image');
        $rootScope.images = persistantStorageService.getJSONItem($scope.user.id);
    }
    $scope.index = $stateParams.index || persistantStorageService.getItem('index');


    // function which configures for image details like date and time for each image
    $scope.configureImageDetails = function () {
        // get the new rank - if the image was ranked but not saved yet
        if ($rootScope.rankedImages[$scope.image.imageName]) {
            $scope.image.humanScore = $rootScope.rankedImages[$scope.image.imageName];
        }
        $scope.showImage = true;
        var time = $scope.image.timeTaken;
        $scope.imageTime = DateTimeFormatService.formatTime(time);
        $scope.imageDate = DateTimeFormatService.formatDate($scope.image.dateTaken);
    };
    $scope.configureImageDetails();

    $scope.range = {
        min: 0,
        max: 10,
        step: 0.1,
        rangeValue: $scope.image.humanScore,
        upperColor: "#00bfa5",
        lowerColor: "#c2c0c2"
    };
    if ($rootScope.userImages !== undefined) {
        $scope.imageList = Object.keys($rootScope.userImages);
    } else {
        $scope.imageList = Object.keys($rootScope.images);
    }


    // download Image when not found
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

    $scope.saveCurrentImage = function (image, rangeValue) {
        if (image.humanScore !== rangeValue) {
            image.humanScore = rangeValue;
            $rootScope.rankedImages[image.imageName] = image.humanScore;
            persistantStorageService.setJSONItem('rankedImages', $rootScope.rankedImages);
        }
    };

    $scope.selectNewImage = function (index) {
        // save the image for which the rank is changed

        $scope.saveCurrentImage($scope.image, $scope.range.rangeValue);

        persistantStorageService.setItem('index', index);
        var newImage = $scope.imageList[index];
        $scope.image = $rootScope.images[newImage];
        persistantStorageService.setJSONItem('image', $scope.image);
        $scope.configureImageDetails();
        $scope.range.rangeValue = $scope.image.humanScore;

    };

    $scope.gotoPrevImage = function () {
        $scope.index = Number($scope.index) - 1;
        $scope.selectNewImage($scope.index);
    };

    $scope.gotoNextImage = function () {
        $scope.index = Number($scope.index) + 1;
        $scope.selectNewImage($scope.index);
    };

    $scope.saveAndGotoDashboard = function () {
        $scope.images = $rootScope.images;
        $scope.saveCurrentImage($scope.image, $scope.range.rangeValue);
        $scope.saveRank($scope.images, $scope.user, $rootScope.rankedImages);
        $state.go('dashboard');
    };

    $scope.saveAndGotoPerson = function () {
        $scope.images = $rootScope.images;
        $scope.saveCurrentImage($scope.image, $scope.range.rangeValue);
        $scope.saveRank($scope.images, $scope.user, $rootScope.rankedImages);
        $state.go('person', {
            person: $scope.user
        });
    };

    $scope.saveRank = function (images, user, rankedImages) {

        // $rootScope.images = {};
        // update $rootScope.images to {} in localStorage

        var rankedImagesList = Object.keys(rankedImages);

        console.log(rankedImagesList);

        rankedImagesList.forEach(function (element, index, array) {
            images[element].humanScore = $rootScope.rankedImages[element];
            var imageParentDirectory = images[element].imageLocation.replace(images[element].imageName, "");
            console.log(imageParentDirectory);
            // write each object to each file

            console.log(index);
            console.log(array.length);

            if (index === array.length - 1) {
                console.log('here');
                persistantStorageService.setJSONItem(user.id, images);
                var newUser = persistantStorageService.getJSONItem('person');
                if (user.id === newUser.id) {
                    $rootScope.images = images;
                }
                // write images to users complete json file
                var filePath = user.id + "/allImages.json";
                fileTransferService.writeToFile(filePath, images).then(function () {

                });
            }
        });

        console.log($rootScope.images);

        // $scope.imageParentDirectory = $scope.image.imageLocation.replace($scope.image.imageName, "");
        // console.log($scope.imageParentDirectory);
        // persistantStorageService.setJSONItem(image);
    };
}]);