var webApp = angular.module('eatingHealthyWebApp');

webApp.directive('rangeSlider', [function () {
    return {
        restrict: 'E',
        scope: {
            rangeData: '='
        },
        link: function (scope, $element) {
            scope.min = scope.rangeData.min || 0;
            scope.max = scope.rangeData.max || 100;
            scope.step = scope.rangeData.step || 1;
            scope.step = Number(scope.step);
            var value = scope.rangeData.rangeValue || scope.min;
            scope.rangeData.rangeValue = parseFloat(value, 10);

            var setSliderColor = function () {
                var val = scope.rangeData.rangeValue;
                var upperColor = scope.rangeData.upperColor || "#00bfa5";
                var lowerColor = scope.rangeData.lowerColor || "#c2c0c2";
                var colorStopVal = "";
                colorStopVal = colorStopVal + ((val - scope.min) / (scope.max - scope.min)) * 100 + "%";

                $element.css('background',
                    'linear-gradient(to right, ' + upperColor + ' ' + colorStopVal + ', ' + lowerColor + ' ' + colorStopVal + ')'
                );
            };

            scope.$watch('rangeData.rangeValue', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (typeof newValue === "string") {
                        scope.rangeData.rangeValue = parseFloat(newValue, 10);
                    }
                    setSliderColor();
                }
            });

            setSliderColor();
        },
        template: '<input type="range" name="score" min={{min}} max={{max}} step={{step}} value={{rangeData.rangeValue}} ng-model=rangeData.rangeValue>',
        replace: true
    };
}]);