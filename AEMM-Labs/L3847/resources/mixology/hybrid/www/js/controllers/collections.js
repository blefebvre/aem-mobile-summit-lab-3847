angular.module('mixology.controllers.collections', [])

.controller('CollectionsCtrl', ['$scope', 'Collections', function($scope, Collections) {
    var loadCollections = function(callback) {
        Collections.getAllCollections()
            .then(function success(collections) {
                $scope.collections = collections;
                $scope.missingContentMessage = null;
            }, function error(err) {
                console.error(err);
                $scope.collections = null;
                $scope.missingContentMessage = "Collections content currently unavailable";
            })
            .finally(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
    };

    $scope.refreshCollectionsList = function() {
        loadCollections(function callback() {
            console.log("Collections list refreshed");
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    loadCollections();
}])

.controller('CollectionDetailCtrl', ['$scope', '$stateParams', 'Collections', function($scope, $stateParams, Collections) {
    Collections.getCollectionByName($stateParams.collectionName)
        .then(function success(collection) {
            $scope.collection = collection;
        }, function error(err) {
            console.error(err);
        });

}]);
