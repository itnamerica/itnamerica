var myApp = angular.module('myApp');

myApp.directive('match', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
    };
});

myApp.directive('contactForm', function() {
    return {
        restrict: "E",
        templateUrl: "../views/contact-form.html"
    }
})