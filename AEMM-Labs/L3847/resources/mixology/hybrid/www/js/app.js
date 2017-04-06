// Mixology App
angular.module('mixology', [
        'ionic', 
        // Controllers
        'mixology.controllers.shared', 
        'mixology.controllers.news',
        'mixology.controllers.drinks',
        'mixology.controllers.collections',
        // Services
        'mixology.services.config', 
        'mixology.services.news',
        'mixology.services.drinks',
        'mixology.services.collections'
    ])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.news', {
    url: '/news',
    views: {
      'tab-news': {
        templateUrl: 'templates/tab-news.html',
        controller: 'NewsCtrl'
      }
    }
  })
  .state('tab.news-detail', {
    url: '/news/:articleName',
    views: {
      'tab-news': {
        templateUrl: 'templates/news-detail.html',
        controller: 'NewsDetailCtrl'
      }
    }
  })

  .state('tab.drinks', {
    url: '/drinks',
    views: {
      'tab-drinks': {
        templateUrl: 'templates/tab-drinks.html',
        controller: 'DrinksCtrl'
      }
    }
  })
  .state('tab.drink-detail', {
    url: '/drinks/:drinkName',
    views: {
      'tab-drinks': {
        templateUrl: 'templates/drink-detail.html',
        controller: 'DrinkDetailCtrl'
      }
    }
  })

  .state('tab.collections', {
    url: '/collections',
    views: {
      'tab-collections': {
        templateUrl: 'templates/tab-collections.html',
        controller: 'CollectionsCtrl'
      }
    }
  })
  .state('tab.collection-detail', {
    url: '/collections/:collectionName',
    views: {
      'tab-collections': {
        templateUrl: 'templates/collection-detail.html',
        controller: 'CollectionDetailCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/news');

});
