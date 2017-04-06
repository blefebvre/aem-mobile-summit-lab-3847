angular.module('mixology.services.drinks', ['mixology.services.config'])

// Drinks service
.factory('Drinks', ['$http', '$q', 'config', function($http, $q, config) {

    var getAllDrinks = function() {
        return $q(function(resolve, reject) {

            /******************************************************
             * Module 2, exercise 2: replace the following  
             * reject(..) line with the code from the workbook.
             ******************************************************/
            reject("Lab module 2, exercise 2 not yet implemented!");
    
        });
    };

    var getDrinkByName = function(name) {
        return $q(function(resolve, reject) {
            $http
                .get(config.apiURL + config.singleDrinkRecipePrefix + name + config.caasExtension)
                .then(function success(response) {
                    resolve(response.data);
                }, function error(response) {
                    reject("Error: " + JSON.stringify(response));
                });
        });
    };

    return {
        getAllDrinks: getAllDrinks,
        getDrinkByName: getDrinkByName
    };
}]);