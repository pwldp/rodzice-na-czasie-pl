var directives = angular.module('kidsApp.directives', []);

directives.directive('chosen', function() {
    var linker = function(scope, element, attr) {
        // update listy szkol
        scope.$watch('schoolsList', function() {
            element.trigger('liszt:updated');
        });
        element.chosen();
    };

    return {
        restrict: 'A',
        link: linker
    }
});
