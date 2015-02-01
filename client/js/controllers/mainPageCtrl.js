'use strict';

angular
    .module('MainPage', [])
    .controller('MainPageController',
        ['$scope', '$location', '$modal', 'httpLoadInterceptor', 'usSpinnerService', '$rootScope',
         'user', 'beerData',
        function($scope, $location, $modal, httpLoadInterceptor, usSpinnerService, $rootScope,
                 user, beerData) {

        $scope.BEER_TYPE_DEFAULT = '-- Select Beer Type ---';

        $scope.ajaxOn = false;
        $scope.beerTypes = [];
        $scope.loggedIn = false;
        $scope.models = {
            beerType: undefined,
            beerName: undefined,
            location: undefined,
            reviews: beerData.listReviews(),
            speech: undefined
        };
        $scope.publishOk = false;
        $scope.showPublishStatus = false;
        $scope.spinnerActive = false;
        $scope.spinnerSelected = undefined;
        $scope.username = user.username;

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
                    usSpinnerService.spin($scope.spinnerSelected);
                }
            } else {
                if ($scope.spinneractive) {
                    usSpinnerService.stop($scope.spinnerSelected);
                }
            }
        });

        if (!$scope.username) {
            user.immediateLogin().then(function(data) {
                $scope.username = data;
            });
        }

        beerData.listBeerTypes().then(function(data) {
            $scope.beerTypes = $scope.beerTypes.concat(data);
        }, function(err) {
            $scope.beerTypes = [ '<database failure, try again later>' ];
        });

        $scope.clickLogout = function() {
            $scope.showPublishStatus = false;
            user.logout().then(function() {
               $scope.username = undefined;
            });
        };

        $scope.clickReviewDelete = function(review) {
            var modalInstance = $modal.open({
                templateUrl: 'deleteModalContent.html',
                controller: 'DeleteModalInstanceCtrl'
            });

            modalInstance.result.then(function() {
                setActiveSpinner('spinner-2');
                beerData.deleteReview({id: review.id}).then(function() {
                    $scope.models.reviews = beerData.listReviews();
                }, function(err) {
                    console.log(err);
                });

            }, function() {
                // Operation cancelled by user.
            });
        };

        $scope.clickReviewForm = function() {
            $scope.showPublishStatus = false;
        };

        $scope.clickReviewPublish = function() {
            var models = $scope.models;

            var data = {
                type: models.beerType,
                name: models.beerName,
                location: models.location,
                speech: models.speech
            };
            setActiveSpinner('spinner-1');
            beerData.addReview(data).then(function() {
                $scope.showPublishStatus = true;
                $scope.publishOk = true;
                resetReviewForm();
                $scope.models.reviews = beerData.listReviews();
            }, function() {
                $scope.showPublishStatus = true;
                $scope.publishOk = false;
            });
        };

        $scope.clickReviewUpdate = function(review) {
            if (!review.name || !review.speech) {

                var modalInstance = $modal.open({
                    templateUrl: 'updateModalContent.html',
                    controller: 'UpdateModalInstanceCtrl',
                    resolve: {
                        cause: function() {
                            return 'invalid_data';
                        }
                    }
                });
            } else {
                review.$edit = false;

                setActiveSpinner('spinner-2');
                beerData.updateReview(review).then(function() {
                    // No need to do anything...
                }, function() {
                    var modalInstance = $modal.open({
                        templateUrl: 'updateModalContent.html',
                        controller: 'UpdateModalInstanceCtrl',
                        resolve: {
                            cause: function() {
                                return 'update_failed';
                            }
                        }
                    });

                    $scope.models.reviews = beerData.listReviews();
                });
            }
        };

        function setActiveSpinner(spinnerKey) {
            usSpinnerService.stop($scope.spinnerSelected);
            $scope.spinnerSelected = spinnerKey;
        }

        function resetReviewForm() {
            var models = $scope.models;

            models.beerType = undefined;
            models.beerName = undefined;
            models.location = undefined;
            models.speech = undefined;

            // This is not yet working...
            $scope.ReviewForm.$setPristine();

        }
    }])
    .controller('DeleteModalInstanceCtrl',
        ['$scope', '$modalInstance', function($scope, $modalInstance) {

        $scope.ok = function() {
            $modalInstance.close();
        };
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }])
    .controller('UpdateModalInstanceCtrl',
        ['$scope', '$modalInstance', 'cause', function($scope, $modalInstance, cause) {
            $scope.cause = cause;

            $scope.ok = function() {
                $modalInstance.close();
            };
        }]);
