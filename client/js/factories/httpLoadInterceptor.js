'use strict';

angular
    .module('HttpLoadInterceptor', [])
    .factory('httpLoadInterceptor', ['$q', function($q) {

        var observerCallback = undefined;
        var numLoadings = 0;

        var notifyObservers = function() {
            if (observerCallback) {
                observerCallback(numLoadings);
            }
        };

        return {
            registerObserverCallback: function(callback) {
                observerCallback = callback;
            },

            request: function (config) {

                numLoadings++;
                notifyObservers();
                return config || $q.when(config);

            },
            response: function (response) {

                --numLoadings;
                notifyObservers();
                return response || $q.when(response);

            },
            responseError: function (response) {

                --numLoadings;
                notifyObservers();
                return $q.reject(response);
            }
        };
    }]);
