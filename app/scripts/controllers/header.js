angular.module('maktaba.controllers')
  .controller('HeaderCtrl', ['$scope', '$state', '$window', 'Users', 'Auth',
    function($scope, $state, $window, Users, Auth) {
      // logout
      $scope.logout = function() {
        Auth.logout();
        console.log('logging out');
        $window.location = '/';
      };

      $scope.goto = function() {
        $state.go('addDocument');
        console.log('I MA     NNNN');
      };



    }
  ]);
