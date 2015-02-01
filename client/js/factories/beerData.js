'use strict';

angular
    .module('BeerDataService', [])
    .factory('beerData', ['$resource', '$q', function($resource, $q) {

        var beerTypes = [];

        return {
            addReview: function(review) {
                var d = $q.defer();

                $resource('/beer').save(review, function(data) {
                    d.resolve(data)
                }, function(err) {
                    d.reject();
                });

                return d.promise;
            },

            deleteReview: function(id) {
                var d = $q.defer();

                $resource('/beer').delete(id, function(data) {
                    d.resolve();
                }, function(err) {
                    d.reject();
                });

                return d.promise;
            },

            listBeerTypes: function() {
                var d = $q.defer();

                if (beerTypes.length) {
                    d.resolve(beerTypes);
                } else {
                    $resource('/beer').get(function(data) {
                        beerTypes = data.types;
                        d.resolve(beerTypes);
                    }, function(err) {
                        d.reject();
                    });
                }

                return d.promise;
            },

            listReviews: function() {
              return $resource('/beer/all').query();
            },

            updateReview: function(review) {
                var d = $q.defer();

                $resource('/beer').save(review, function() {
                    d.resolve()
                }, function(err) {
                    d.reject(err);
                });

                return d.promise;
            }
        };
    }]);