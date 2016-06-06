'use strict';

cs142App.controller('LoginRegisterController', ['$scope', '$rootScope', 
  '$location', '$http', 'Auth', '$firebaseArray', '$firebaseObject',
  function($scope, $rootScope, $location, $http, Auth, $firebaseArray, $firebaseObject) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */

    $scope.main = {};

    //text typed into input box
    $scope.main.userEmail = "";
    $scope.main.userPassword = "";
    $scope.main.newUser = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      passwordReentry: ""
    };

    $scope.main.login = function() {
      var ref = new Firebase("https://nooz.firebaseio.com");
      ref.authWithPassword({
        email    : $scope.main.userEmail,
        password : $scope.main.userPassword
      }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $location.path("/followPeople");
      }
      });
    };

    $scope.main.register = function() {
      $scope.message = null;
      $scope.error = null;
      for (var key in $scope.main.newUser) {
        if ($scope.main.newUser[key].length === 0) {
          $scope.main.errorMessage = "Please fill out all forms";
          return;
        }
      }

      if ($scope.main.newUser.password !== $scope.main.newUser.passwordReentry) {
        $scope.main.errorMessage = "Passwords did not match";
        return;
      }

      Auth.$createUser({
        email: $scope.main.newUser.email,
        password: $scope.main.newUser.password
      }).then(function(userData) {
        $scope.main.message = "User created with uid: " + userData.uid;
              console.log("just registered a user id " + userData.uid);
        var usersRef = new Firebase("https://nooz.firebaseio.com/users/" + userData.uid + '/profile');
        var obj = $firebaseObject(usersRef);
        obj.first_name = $scope.main.newUser.first_name;
        obj.last_name = $scope.main.newUser.last_name;
        obj.user_description = $scope.main.newUser.user_description;
        obj.$save().then(function() {
          console.log('Profile saved! for ' + $scope.main.newUser.first_name);
        }).catch(function(error) {
          console.log('Error!');
        });
      }).catch(function(error) {
        console.log("ERROR IN MAKING PROFILE")
        $scope.error = error;
      });
    };
  }
]);
