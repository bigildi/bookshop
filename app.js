var bookApp = angular.module('bookApp', ['ngResource','ngRoute', 'ngCart']);

bookApp.controller('searchCtrl', function ($scope, $location) {
    $scope.submit = function() {
        if ($scope.searchTerm) {
            $location.path('/search/' + $scope.searchTerm);
        }
    };
});

bookApp.controller('ListCtrl', function ($scope, ListService, $routeParams) {
    $scope.searchTerm = "maze";
    ListService.get({ q: $routeParams.s }, function (response) {
        $scope.bookResults = response.items;
        $scope.orderProp = 'volumeInfo.title';
    });
});

bookApp.controller('bookCtrl', function ($scope, BookService, $routeParams) {
    BookService.get({volumeId: $routeParams.id}, function (response) {
        $scope.book = response;
    });
});

bookApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html'
        })
        .when('/search/:s', {
            templateUrl: 'templates/book-list.html',
            controller: 'ListCtrl'
        })
        .when('/book/:id', {
            templateUrl: 'templates/book-page.html',
            controller: 'bookCtrl'
        })
        .when('/cart', {
            templateUrl: 'templates/cart-page.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});

bookApp.filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});