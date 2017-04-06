angular.module('mixology.services.collections', ['mixology.services.config'])

// Collections service
.factory('Collections', ['$http', '$q', 'config', function($http, $q, config) {
    var getAllCollections = function() {
        return $q(function(resolve, reject) {
            
            /******************************************************
             * Module 2, exercise 3: replace the following  
             * reject(..) line with the code from the workbook.
             ******************************************************/
            reject("Lab module 2, exercise 3 not yet implemented!");
            
        });
    };

    var getCollectionByName = function(name) {
        return $q(function(resolve, reject) {
            $http.get(config.apiURL + config.singleCollectionPrefix + name + config.caasExtension)
                .then(function success(response) {
                    resolve(response.data);
                }, function error(response) {
                    reject("Error: " + JSON.stringify(response));
                });
        });
    };

    return {
        getAllCollections: getAllCollections,
        getCollectionByName: getCollectionByName
    };
}]);