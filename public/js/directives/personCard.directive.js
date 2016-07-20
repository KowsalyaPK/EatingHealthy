var webApp = angular.module('eatingHealthyWebApp');

webApp.directive('personCard', [function () {

    var personCardController = function ($scope, $state, persistantStorageService) {
        $scope.goToPerson = function () {
            persistantStorageService.setJSONItem('person', $scope.person);
            $state.go('person', {
                person: $scope.person
            });
        };

    };

    return {
        restrict: 'E',
        scope: {
            person: '='
        },
        // link: function (scope, $element, $attrs) {},
        controller: personCardController,
        templateUrl: './templates/personCard.html',
        replace: true
    };
}]);