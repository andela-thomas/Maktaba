(function() {
  'use strict';
  angular.module('maktaba.controllers', []);
  angular.module('maktaba.services', []);
  angular.module('maktaba.filters', []);
  angular.module('maktaba.directives', []);

  //Require Services
  require('./services/auth');
  require('./services/users');
  require('./services/document');

  // Require Controllers
  require('./controllers/footer');
  require('./controllers/home');
  require('./controllers/about');
  require('./controllers/header');
  require('./controllers/login');
  require('./controllers/dashboard');
  require('./controllers/document');
  window.app = angular.module('maktaba', [
    'maktaba.controllers',
    'maktaba.services',
    'maktaba.filters',
    'maktaba.directives',
    'ngRoute',
    'ui.router',
    'ngResource',
  ]);

  window.app.run(['$rootScope', '$location', 'Users', 'Auth',
    function($rootScope, $location, Users, Auth) {
      $(function() {
        $(".button-collapse").sideNav({
          closeOnClick: true
        });
      });
      // Get token
      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        //Do your things
        if (Auth.isLoggedIn()) {
          // Get the current logged in user
          Users.user(function(err, res) {
            if (res) {
              $rootScope.isLoggedIn = Auth.isLoggedIn();
              $rootScope.user = res;
            } else {
              console.log('Error', err);
            }
          });
        }
      });


      $rootScope.menu = [{
        name: 'Home',
        state: 'home'
      }, {
        name: 'About',
        state: 'about'
      }];
    }
  ]);

  window.app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    // pass the token to the headers
    $httpProvider.interceptors.push('Interceptor');
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/404');

    // Now set up the states
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeCtrl',
        templateUrl: 'views/home.html'
      })
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl',
        templateUrl: 'views/dashboard.html'
      })
      .state('document', {
        url: '/user/{id}/document',
        controller: 'DocumentCtrl',
        templateUrl: 'views/document.html'
      })
      .state('about', {
        url: '/about',
        controller: 'AboutCtrl',
        templateUrl: 'views/about.html'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/login.html'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'views/404.html',
        controller: function($scope) {}
      });

    $locationProvider.html5Mode(true);
  }]);
})();
