var webApp = angular.module('eatingHealthyWebApp');

webApp.controller('DashboardController', ['$scope', '$rootScope', 'persistantStorageService', '$filter', function ($scope, $rootScope, persistantStorageService, $filter) {

    $rootScope.rankedImages = persistantStorageService.getJSONItem('rankedImages');
    if ($rootScope.rankedImages === null) {
        $rootScope.rankedImages = {};
        persistantStorageService.setJSONItem('rankedImages', $rootScope.rankedImages);
    }

    $scope.filterLetter = "";
    $scope.filteredUsers = $rootScope.appUsers;

    $scope.filterNames = function ($event, letter) {
        $scope.changeSelectedClass($event);
        $scope.filterLetter = letter;
        $scope.filteredUsers = $filter('filterNames')($rootScope.appUsers, $scope.filterLetter);
    };

    $scope.startsWith = function (element) {
        if ($scope.filterLetter === "") {
            return true;
        }
        return element.name.toLowerCase().indexOf($scope.filterLetter.toLowerCase()) === 0;
    };

    $scope.changeSelectedClass = function ($event) {
        var element = angular.element($event.currentTarget);
        var parent = element.parent();
        var sibling = angular.element(parent[0].querySelector(".selected"));
        sibling.removeClass('selected');
        element.addClass('selected');
    };
}]);