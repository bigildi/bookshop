var bookApp = angular.module('bookApp', ['ngResource','ngRoute']);

bookApp.controller('bookCtrl', function ($scope, BookService, $location) {
    $scope.searchTerm = "maze";

    $scope.searchBook = function () {
        BookService.get({ q: $scope.searchTerm }, function (response) {
console.log(response.items);
            $scope.bookResults = response.items;
            $scope.pageUrl = location.host;
            $scope.orderProp = 'volumeInfo.title';

        });
    }
});

bookApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'book-list.html',   controller: 'bookCtrl'})
        .when('/book', {templateUrl: 'book-page.html'});
});
