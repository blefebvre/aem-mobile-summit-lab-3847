angular.module('mixology.services.config', [])

.constant('config', {

    /***********************************************************
     * Module 2, exercise 1: replace 'null' with the hostname 
     * the app will use to fetch it's data. This can be 
     * 'http://localhost:4503', or (in a real scenario), the 
     * IP/hostname of the server.
     ***********************************************************/
    // API URL
    apiURL: null,
    
    // Path to fetch an array of drink recipes
    drinkRecipesJSON: '/content/entities/drinks/recipes.caas.1.json',
    // Path to fetch an array of drink collections
    drinkCollectionsJSON: '/content/entities/drinks/collections.caas.json',
    // Path prefix for fetching a single drink
    singleDrinkRecipePrefix: '/content/entities/drinks/recipes/',
    // CaaS Extension
    caasExtension: '.caas.2.json',
    // Collections JSON
    collectionsJSON: '/content/entities/drinks/collections.caas.1.json',
    // Prefix for fetching a single collection
    singleCollectionPrefix: '/content/entities/drinks/collections/',

    // Content sync constants
    newsExportConfigPath: '/content/mobileapps/we-mix/content/jcr:content/exportConfigs/newsExportConfig.pge-updates.json',
    // Return redirect zip path param
    returnZipPathParam: 'returnRedirectZipPath=true',
    // If modified since param
    ifModifiedSinceParam: 'ifModifiedSince=',
    // Path to news entity
    pathToNewsEntity: '/content/entities/mix/news.caas.page.infinity.json',
    // Path to update manifest
    pathToUpdateManifest: '/www/pge-package-update.json',
    // Key to store timestamp under in localStorage
    newsLastUpdatedTimestampKey: 'newsLastUpdatedTimestamp',
    // Key to store news cache path in localStorage
    newsCachedDataPathKey: 'newsCachedDataPath',
    // Key to store cache root path in localStorage
    newsCachedRootPathKey: 'newsCachedRootPath'
});