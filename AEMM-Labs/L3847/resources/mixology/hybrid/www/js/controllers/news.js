angular.module('mixology.controllers.news', [])

.controller('NewsCtrl', ['$scope', '$sce', 'News', function($scope, $sce, News) {
    var loadNews = function(callback) {
        News.getAllNewsItems()
            .then(function success(news) {
                $scope.news = news;
                $scope.missingContentMessage = null;
            }, function error(err) {
                console.error(err);
                $scope.news = null;
                $scope.missingContentMessage = "News content currently unavailable";
            })
            .finally(function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
    };

    $scope.refreshNews = function() {
        loadNews(function callback() {
            console.log("News refreshed");
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    document.addEventListener("deviceready", function() {
        loadNews();
    }, false);
}])

.controller('NewsDetailCtrl', ['$scope', '$stateParams', 'News', function($scope, $stateParams, News) {
    News.getArticleByName($stateParams.articleName)
        .then(function success(article) {
            $scope.article = article;
            $scope.articleBodyItems = News.transformArticleBody(article);
        }, function error(err) {
            console.error(err);
        });
}]);