'use strict';

cs142App.controller('FollowPeopleController', ['$scope', '$routeParams', 
  '$location', '$firebaseArray',
  function($scope, $routeParams, $location, $firebaseArray) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    $scope.main = {};
    $scope.currUid = $scope.shared.authData.uid;
    var usersRef = new Firebase("https://nooz.firebaseio.com/users/");
    $scope.main.users = $firebaseArray(usersRef);
    var curatorsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.currUid + "/following")
    $scope.main.curators = $firebaseArray(curatorsRef);

    $scope.main.followUser = function(followId) {
      var followingRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.currUid + '/following');
      var following = $firebaseArray(followingRef);
      following.$add(followId).then(function() {
          console.log('Successfully followed! ');
        }).catch(function(error) {
          console.log('Error trying to follow!');
        });
    };
  }
]);