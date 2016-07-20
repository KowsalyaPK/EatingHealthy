var webApp = angular.module('eatingHealthyWebApp');

webApp.directive('filterBox', [function () {

    var cardPersonController = function ($scope, $state, persistantStorageService) {
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
            letter: '@'
        },
        link: function (scope, $element, $attrs) {
            scope.filterNames = function () {
                console.log(scope.letter);
                console.log('clicked');
                $element.addClass('selected');
            };
        },
        controller: cardPersonController,
        //        transclude: true,
        // template: 'C',
        template: '<div class="letterBox" ng-click="filterNames()">{{letter}}</div>',
        replace: true
    };
}]);