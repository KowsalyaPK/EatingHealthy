var webApp = angular.module('eatingHealthyWebApp', ['ui.router', 'ngImage']);

webApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
        })
        .state('person', {
            url: '/person',
            params: {
                person: false,
            },
            templateUrl: 'templates/person.html',
            controller: 'PersonController'
        })
        .state('rank', {
            url: '/rank',
            params: {
                image: false,
                index: ""
            },
            templateUrl: 'templates/rank.html',
            controller: 'RankController'
        });

    $urlRouterProvider.when('', '/dashboard');
});


webApp.run(function ($rootScope, $http) {
    var getAppUsers = function () {
        $http.get('/getAppUsers').then(function (data) {
            $rootScope.appUsers = data.data;
            // $scope.appUsers = Object.keys(data.data);
        });
    };

    var getUnrankedImages = function () {
        $http.get('/getUnrankedImages').then(function (data) {
            $rootScope.unrankedImagesJSON = data.data;
            $rootScope.unrankedImages = $rootScope.unrankedImagesJSON.imagesInfo;
        });
    };
    getAppUsers();
    // getUnrankedImages();
});