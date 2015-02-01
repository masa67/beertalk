'use strict';

angular
    .module('UserService', [])
    .factory('user', ['$resource', '$q', function($resource, $q) {

        return {
            email: undefined,
            username: undefined,

            immediateLogin: function() {
                var d = $q.defer();

                var _this = this;

                $resource('/user').get(function(data) {
                    _this.username = data.username;
                    _this.email = data.email;
                    d.resolve(data.username);
                });

                return d.promise;
            },
            login: function(userdata) {
                var d = $q.defer();

                var _this = this;

                $resource('/user/login').save(userdata, function(data) {
                    _this.username = data.username;
                    _this.email = data.email;
                    d.resolve();
                }, function(err) {
                    d.reject(err);
                });

                return d.promise;
            },
            logout: function() {
                var d = $q.defer();

                var _this = this;

                $resource('/user/logout').get(function() {
                    _this.username = undefined;
                    _this.email = undefined;
                    d.resolve();
                });

                return d.promise;
            },
            register: function(userdata) {
                var d = $q.defer();

                var _this = this;

                $resource('/user/register').save(userdata, function(data) {
                    _this.username = data.username;
                    _this.email = data.email;
                    d.resolve();
                }, function(err) {
                    d.reject(err);
                })

                return d.promise;
            }
        };
    }]);