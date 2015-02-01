'use strict';

angular
    .module('LoginPage', [])
    .controller('LoginPageController', [
        '$scope', '$location', 'httpLoadInterceptor','usSpinnerService', '$rootScope', 'user',
        function($scope, $location, httpLoadInterceptor, usSpinnerService, $rootScope, user) {

        $scope.ajaxOn = false;
        $scope.doReg = false;
        $scope.invalidCred = false;
        $scope.models = {
            username: undefined,
            email: undefined,
            password: undefined
        };
        $scope.spinnerActive = false;
        $scope.usernameReserved = false;

        $rootScope.$on('us-spinner:spin', function(event, key) {
            $scope.spinneractive = true;
        });

        $rootScope.$on('us-spinner:stop', function(event, key) {
            $scope.spinneractive = false;
        });

        httpLoadInterceptor.registerObserverCallback(function(numLoadings) {
            $scope.ajaxOn = numLoadings ? true : false;
            if ($scope.ajaxOn) {
                if (!$scope.spinneractive) {
                    usSpinnerService.spin('spinner-1');
                }
            } else {
                if ($scope.spinneractive) {
                    usSpinnerService.stop('spinner-1');
                }
            }
        });

        $scope.clickLogin = function() {
            var models = $scope.models;

            var data = {
                username: models.username,
                password: models.password
            };
            user.login(data).then(function() {
                $location.path('/');
            }, function(err) {
                $scope.invalidCred = true;
            });
        };

        $scope.clickRegister = function() {
            var models = $scope.models;

            var data = {
                username: models.username,
                email: models.email,
                password: models.password
            };
            user.register(data).then(function(data) {
                $location.path('/');
            }, function(err) {
                $scope.usernameReserved = true;
            });
        };

        $scope.clickRegisterNow = function() {
            $scope.doReg = true;
        };

        $scope.clickRenewPassword = function() {
        };
    }]);