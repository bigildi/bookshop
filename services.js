bookApp.factory('ListService', function ($resource) {
    return $resource('https://www.googleapis.com/books/v1/volumes', {
            maxResults: '10',
            callback: 'JSON_CALLBACK',
            key: 'AIzaSyDj2BMbS1VLXFaMo3pe5mQ6c7MgivIqiJg'
        },
        {
            get: { method: 'JSONP' }
        }
    );
});
bookApp.factory('BookService', function ($resource) {
    return $resource('https://www.googleapis.com/books/v1/volumes/:volumeId', {
            callback: 'JSON_CALLBACK',
            key: 'AIzaSyDj2BMbS1VLXFaMo3pe5mQ6c7MgivIqiJg'
        },
        {
            get: { method: 'JSONP' }
        }
    );
});

