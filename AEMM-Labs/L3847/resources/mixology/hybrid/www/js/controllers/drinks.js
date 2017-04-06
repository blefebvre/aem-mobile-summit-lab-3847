angular.module('mixology.controllers.drinks', [])

.controller('DrinksCtrl', ['$scope', 'Drinks', function($scope, Drinks) {
    var loadDrinkList = function(callback) {
        Drinks.getAllDrinks()
            .then(function success(drinks) {
                $scope.drinks = drinks;
                $scope.missingContentMessage = null;
            }, function error(err) {
                console.error(err);
                $scope.drinks = null;
                $scope.missingContentMessage = "Drinks content currently unavailable";
            })
            .finally(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
    };

    $scope.refreshDrinkList = function() {
        loadDrinkList(function callback() {
            console.log("Drinks list refreshed");
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    loadDrinkList();
}])

.controller('DrinkDetailCtrl', ['$scope', '$stateParams', 'Drinks', function($scope, $stateParams, Drinks) {
    Drinks.getDrinkByName($stateParams.drinkName)
        .then(function success(drink) {
            $scope.drink = drink;
        }, function error(err) {
            console.error(err);
        });
}]);