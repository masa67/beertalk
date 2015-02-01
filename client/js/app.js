'use strict';

var btApp = angular
    .module('BtApp', [
        'ngRoute',
        'ngResource',
        'ngTable',
        'angularSpinner',
        'rcForm',
        'ui.bootstrap',
        'validation.match',
        'appRoutes',
        'HttpLoadInterceptor',
        'BeerDataService',
        'UserService',
        'MainPage',
        'LoginPage'
    ])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('httpLoadInterceptor');
    }]);