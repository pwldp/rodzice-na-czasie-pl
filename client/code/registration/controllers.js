var registrationApp = angular.module('registrationApp', ['ssAngular'])
    .config(function($routeProvider,$locationProvider) {
    $routeProvider.
        when('/subreg/:subregID', {controller:'registrationCtrl', templateUrl:'registration.html', reloadOnSearch: true}).
        when('/subreg', {controller:'registrationCtrl', templateUrl:'registration.html'});
        //otherwise({redirectTo:'/login', templateUrl: 'login.html', reloadOnSearch: false});
    $locationProvider.html5Mode(true);
})
.run( function($rootScope, $location, $routeParams) {
    //console.log($rootScope);
    //console.log($location);
    //console.log($routeParams);
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        //console.log("next.templateUrl="+next.templateUrl);
        //console.log("-------------------");
        //console.log("next");
        //console.log(next);
        //console.log("-------------------");
        //console.log("current");
        //console.log(current);
        //console.log("-------------------");
    });

})










/**************************************************************************************************************************** 

RegistrationCtrl 

*****************************************************************************************************************************/

.controller('registrationCtrl',['$scope', '$location', '$log', '$rootScope', '$routeParams', function($scope, $location, $log, $rootScope, $routeParams) {
    //console.log("registrationCtrl");
    //console.log($routeParams);
    //console.log($location);

    $scope.redirectToMain = function() {
        var pathArray = window.location.pathname.split( '/' );
        var host = pathArray[2];
        parent.location.href = host + "/login";
    }

}]);


