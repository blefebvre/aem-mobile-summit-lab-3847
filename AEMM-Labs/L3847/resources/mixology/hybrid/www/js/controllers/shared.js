angular.module('mixology.controllers.shared', [])

.controller('AppController', ['$scope', '$rootScope', '$state', '$ionicHistory', function($scope, $rootScope, $state, $ionicHistory) {
    $scope.getRating = function(number) {
        return new Array(number); 
    };

    $scope.goHref = function(href) {
        window.location.href = href;
    };

    $scope.goDrink = function(name) {
        // Navigate to the drinks tab, then the drink itself
        var afterTabLoadDeregister = $scope.$on("$ionicView.afterEnter", function() {
            afterTabLoadDeregister();
            $state.go('tab.drink-detail', {
                drinkName: name
            });
        });
        $state.go('tab.drinks');
    };

    $rootScope.backupIonicGoBack = $rootScope.$ionicGoBack;
    $rootScope.$ionicGoBack = function() {
        if ($ionicHistory.viewHistory().backView !== null) {
            // Go back in the Ionic history
            $scope.setBackButtonStatus(false);
            $ionicHistory.goBack();
        }
        else {
            // Reload the app, minus the hash
            // This is a workaround to help when authoring the app with the PhoneGap dev app
            window.location.href = window.location.href.substring(0, window.location.href.indexOf('#'));
        }
    };

    $scope.setBackButtonStatus = function(value) {
        $scope.showBackButton = value;
    };

    var deregisterBackButtonStatusSetter = $scope.$on("$ionicView.afterEnter", function(event, data){
        var topLevelStates = ['tab.news','tab.drinks','tab.collections'];
        if (topLevelStates.includes(data.stateName)) {
            $scope.setBackButtonStatus(false);
        } 
        else {
            $scope.setBackButtonStatus(true);
        }
        deregisterBackButtonStatusSetter();
    });
}]);