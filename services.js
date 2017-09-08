bookApp.factory('BookService', function ($resource) {
    return $resource('https://www.googleapis.com/books/v1/volumes', {
            maxResults: '2',
            callback: 'JSON_CALLBACK',
            key: 'AIzaSyATldFLGtPPZVLecasP0nFXkX6RqXa7VEI'
        },
        {
            get: { method: 'JSONP' }
        }
    );
});
