angular.module('mixology.services.news', ['mixology.services.config'])

// News service
.factory('News', ['$http', '$q', 'config', function($http, $q, config) {

    var getAllNewsItems = function() {
        // Fetch news from AEM via Content Sync
        return $q(function(resolve, reject) {
            console.log('---- News update started ----');
            // Query the Content Sync config node for the path to download it's .zip
            var contentSyncNewsQuery = config.apiURL + config.newsExportConfigPath + '?' + 
                    config.returnZipPathParam + '&' + config.ifModifiedSinceParam + getLastUpdatedTimestamp();
            console.log('Querying for a Content Sync zip: ' + contentSyncNewsQuery);
            $http.get(contentSyncNewsQuery)
                .then(function success(response) {
                    // Check if an update is available
                    if (response.data.updates === true) {
                        // An update is available! Fetch content from server
                        console.log('Update available!');
                        fetchDataFromServer(response.data.zipPath).then(function success(newsData) {
                            resolve(newsData);
                        }, function error(err) {
                            reject("Error: " + JSON.stringify(err));
                        });
                    }
                    else {
                        // No update is currently available. Return cached content
                        console.log('Content is up-to-date');
                        readCachedData(getCachedNewsJsonDataPath()).then(function success(newsData) {
                            resolve(newsData);
                        }, function error(err) {
                            reject("Error loading from cache: " + JSON.stringify(err));
                        });
                    }
                }, function error(response) {
                    // Issue querying server; try loading from cache
                    console.log("Issue querying for Content Sync zip: " + JSON.stringify(response));
                    if (getCachedNewsJsonDataPath() === null) {
                        reject("Error loading from cache after failed server connection: getCachedNewsJsonDataPath() === null");
                    }
                    else {
                        readCachedData(getCachedNewsJsonDataPath()).then(function success(newsData) {
                            resolve(newsData);
                        }, function error(err) {
                            reject("Error loading from cache after failed server connection: " + JSON.stringify(err));
                        });
                    }
                });
        });
    };

    var getArticleByName = function(name) {
        return $q(function(resolve, reject) {
            // An article has been selected, so we can assume that the data is available in the cache
            readCachedData(getCachedNewsJsonDataPath())
                .then(function success(newsData) {
                    for (var i = 0; i < newsData.length; i++) {
                        var currentItem = newsData[i];
                        if (currentItem.name === name) {
                            return resolve(currentItem);
                        }
                    }
                    reject('News item named [' + name + '] not found.');
                }, function error(err) {
                    reject("Error: " + JSON.stringify(err));
                });
        });
    };

    var transformArticleBody = function(article) {
    	return weMix.article.transformArticleHtml(article, getCachedRootPath());
    }

    /* Helpers */

    var performContentSyncDownload = function(src, id) {
        return $q(function(resolve, reject) {
            console.log('Requesting Content Sync zip: ' + src);
            var sync = ContentSync.sync({
                src: src,
                id: id,
                type: 'merge'
            });

            sync.on('complete', function(data) {
                var extractedContentDirectory = data.localPath;
                console.log("News data extracted to: " + extractedContentDirectory);
                setCachedRootPath(extractedContentDirectory);
                resolve(extractedContentDirectory);
            });

            sync.on('error', function(e) {
                reject("Error: " + JSON.stringify(e));
            });
        });
    };

    var fetchDataFromServer = function(zipPath) {
        return $q(function(resolve, reject) {
            // Download and extract the zip
            console.log('Fetching data from the server. Path: ' + zipPath);
            performContentSyncDownload(config.apiURL + zipPath, 'news')
                .then(function contentSyncSuccess(extractedContentDirectory) {
                    // First, set the last updated timestamp
                    $http.get(extractedContentDirectory + config.pathToUpdateManifest)
                        .then(function success(response) {
                            setLastUpdatedTimestamp(response.data.lastModified);
                        }, function error(response) {
                            console.log("Error reading update manifest: " + JSON.stringify(response));
                        });
                    return extractedContentDirectory;
                }, function contentSyncError(err) {
                    console.error("Error: " + err);
                })
                .then(function(extractedContentDirectory) {
                    // Read the downloaded News data
                    var dataPath = extractedContentDirectory + config.pathToNewsEntity;
                    setCachedNewsJsonDataPath(dataPath);
                    readCachedData(dataPath)
                        .then(function success(data) {
                            resolve(data);
                        }, function error(err) {
                            reject(err);
                        });
                });
        });
    };

    var readCachedData = function(dataPath) {
        return $q(function(resolve, reject) {
            $http.get(dataPath)
                .then(function success(response) {
                    console.log('Successfully read from filesystem');
                    var articles = weMix.article.attachHeroImageToArticles(response.data['_children'], getCachedRootPath());
                    resolve(articles);
                }, function error(response) {
                    reject("Error reading news entity from cache: " + JSON.stringify(response));
                });
        });
    };
    
    var setLastUpdatedTimestamp = function(timestamp) {
        console.log("Setting news last updated timestamp: " + timestamp);
        localStorage.setItem(config.newsLastUpdatedTimestampKey, timestamp);
    };
    var getLastUpdatedTimestamp = function() {
        var lastUpdatedTimestamp = localStorage.getItem(config.newsLastUpdatedTimestampKey) || 0;
        console.log('News last updated timestamp: ' + lastUpdatedTimestamp);
        return lastUpdatedTimestamp;
    };

    var setCachedNewsJsonDataPath = function(dataPath) {
        console.log("Setting cached news data path: " + dataPath)
        localStorage.setItem(config.newsCachedDataPathKey, dataPath);
    };
    var getCachedNewsJsonDataPath = function() {
        var cachedDataPath = localStorage.getItem(config.newsCachedDataPathKey);
        console.log('Cached news data path: ' + cachedDataPath);
        return cachedDataPath;
    };

    var setCachedRootPath = function(rootPath) {
        console.log("Setting cached data root path: " + rootPath)
        localStorage.setItem(config.newsCachedRootPathKey, rootPath);
    };
    var getCachedRootPath = function() {
        var cachedRootPath = localStorage.getItem(config.newsCachedRootPathKey);
        console.log('Cached data root path: ' + cachedRootPath);
        return cachedRootPath;
    };

    return {
        getAllNewsItems: getAllNewsItems,
        getArticleByName: getArticleByName,
        transformArticleBody: transformArticleBody
    }
}]);