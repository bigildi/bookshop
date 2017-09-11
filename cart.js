angular.module('ngCart', ['ngCart.directives'])

    .run(['$rootScope', 'cartService','cartItem', 'store', function ($rootScope, cartService, cartItem, store) {

        $rootScope.$on('cartService:change', function(){
            cartService.$save();
        });

        if (angular.isObject(store.get('bookShopCart'))) {
            cartService.$restore(store.get('bookShopCart'));

        } else {
            cartService.init();
        }
    }])

    .service('cartService', ['$rootScope', '$window', 'cartItem', 'store', function ($rootScope, $window, cartItem, store) {

        this.init = function(){
            this.$cart = {
                items : []
            };
        };

        this.addItem = function (id, name, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart !== 'object') {
                var newItem = new cartItem(id, name, data);
                this.$cart.items.push(newItem);
            }

            $rootScope.$broadcast('cartService:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            return this.getCart().items.length;
        };

        this.removeItem = function (index) {
            var item = this.$cart.items.splice(index, 1)[0] || {};
            $rootScope.$broadcast('cartService:change', {});
        };

        this.removeItemById = function (id) {
            var item;
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if(item.getId() === id) {
                    item = cart.items.splice(index, 1)[0] || {};
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('cartService:change', {});
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                items:items
            }
        };

        this.$restore = function(storedCart){
            var _self = this;
            _self.init();

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new cartItem(item._id,  item._name, item._data));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set('bookShopCart', JSON.stringify(this.getCart()));
        }

    }])

    .factory('cartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, data) {
            this.setId(id);
            this.setName(name);
            this.setData(data);
        };

        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };

        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };

        item.prototype.getName = function(){
            return this._name;
        };

        item.prototype.setData = function(data){
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };

        return item;
    }])

    .service('store', ['$window', function ($window) {

        return {
            get: function (key) {
                if ( $window.localStorage.getItem(key) )  {
                    var cart = angular.fromJson( $window.localStorage.getItem(key) ) ;
                    return JSON.parse(cart);
                }
                return false;
            },
            set: function (key, val) {

                if (val !== undefined) {
                    $window.localStorage.setItem(key, angular.toJson(val));
                }
                return $window.localStorage.getItem(key);
            }
        }
    }])

    .controller('CartController',['$scope', 'cartService', function($scope, ngCart) {
        $scope.ngCart = ngCart;
    }]);

angular.module('ngCart.directives', [])

    .controller('CartController',['$scope', 'cartService', function($scope, ngCart) {
        $scope.ngCart = ngCart;
    }])

    .directive('ngcartAddtocart', ['cartService', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                data:'='
            },
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'templates/cart/addtocart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemById(attrs.id);
                };
            }
        };
    }])

    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'templates/cart/cart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link:function(scope, element, attrs){}
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: function(element, attrs) {
                if ( typeof attrs.templateUrl == 'undefined' ) {
                    return 'templates/cart/summary.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);
