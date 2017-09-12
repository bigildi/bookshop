var bookApp = angular.module('bookApp', ['ngResource','ngRoute', 'ngCart']);

bookApp.controller('searchCtrl', function ($scope, $location) {
    $scope.submit = function() {
        if ($scope.searchTerm) {
            $location.path('/search/' + $scope.searchTerm);
        }
    };
});

bookApp.controller('bookCtrl', function ($scope, ListService, $routeParams) {
    $scope.searchTerm = "maze";
    ListService.get({ q: $routeParams.s }, function (response) {
        $scope.bookResults = response.items;
        $scope.orderProp = 'volumeInfo.title';
    });
});

bookApp.controller('booCtrl', function ($scope, BookService, $routeParams) {
    BookService.get({volumeId: $routeParams.id}, function (response) {
        $scope.book = response;
        $scope.title = response.volumeInfo.title;
        $scope.authors = response.volumeInfo.authors ? response.volumeInfo.authors : [];
        $scope.description = response.volumeInfo.description ? response.volumeInfo.description : '';
        $scope.thumbnail = response.volumeInfo.imageLinks.thumbnail ? response.volumeInfo.imageLinks.thumbnail : '';
        $scope.item = response;
    });
});

bookApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html'
        })
        .when('/search/:s', {
            templateUrl: 'templates/book-list.html',
            controller: 'bookCtrl'
        })
        .when('/book/:id', {
            templateUrl: 'templates/book-page.html',
            controller: 'booCtrl'
        })
        .when('/cart', {
            templateUrl: 'templates/cart-page.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});