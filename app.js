var bookApp = angular.module('bookApp', ['ngResource','ngRoute', 'ngCart']);

bookApp.controller('bookCtrl', function ($scope, ListService, $location) {
    $scope.searchTerm = "maze";

    $scope.searchBook = function () {
        ListService.get({ q: $scope.searchTerm }, function (response) {
            $scope.bookResults = response.items;
            $scope.pageUrl = location.host;
            $scope.orderProp = 'volumeInfo.title';

        });
    }
});

bookApp.controller('booCtrl', function ($scope, BookService, $routeParams) {
    BookService.get({volumeId: $routeParams.id}, function (response) {
        $scope.id = $routeParams.id;
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