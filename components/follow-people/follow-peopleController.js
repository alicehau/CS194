'use strict';

cs142App.controller('FollowPeopleController', ['$scope', '$routeParams',
  '$location', '$firebaseArray', '$http',
  function($scope, $routeParams, $location, $firebaseArray, $http) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    $scope.main = {};
    if ($scope.shared.authData) {
      $scope.currUid = $scope.shared.authData.uid;
          var usersRef = new Firebase("https://nooz.firebaseio.com/users/");
          $scope.main.users = $firebaseArray(usersRef);
          var curatorsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.currUid + "/following")
          $scope.main.curators = $firebaseArray(curatorsRef);
          $scope.main.leftToFollow = [];
          $scope.main.curators.$loaded()
          .then(function(){
            $scope.main.users.$loaded().then(function(){
              getUsersLeftToFollow();
              console.log("loading " + $scope.main.users);
            });
          });
    }

    $scope.main.followUser = function(followId) {
      var followingRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.currUid + '/following');
      var following = $firebaseArray(followingRef);
      following.$add(followId).then(function() {
          console.log('Successfully followed! ');
          getUsersLeftToFollow();
        }).catch(function(error) {
          console.log('Error trying to follow!');
        });
    };


    function getUsersLeftToFollow() {
      $scope.main.leftToFollow = [];
      angular.forEach($scope.main.users, function(user) {
          var isCurator = false;
          angular.forEach($scope.main.curators, function(curator) {
            if (user.$id == curator.$value) {
              isCurator = true;
            }
          });
          if (!isCurator && user.$id != $scope.shared.authData.uid) {
            $scope.main.leftToFollow.push(user);
          }
        });
    }




    $scope.addArticle = function() {
      var ref = new Firebase("https://nooz.firebaseio.com");
      var authData = ref.getAuth();
      var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + authData.uid + "/articles/");
      $scope.main.articles = $firebaseArray(articlesRef);

      var encodedURI = encodeURIComponent($scope.articleLink);

      $http.get("http://api.diffbot.com/v3/article?token=90d8a5387254ad57971dc32a4a59e9b2&url=" + encodedURI)
          .then(function(response) {
              var obj = response.data;
              $scope.articleData = obj['objects'][0]["html"];
              $scope.articleTitle = obj['objects'][0]['title'];
              console.log("Success response");

              obj['objects'][0].comment = $scope.articleComment;
              obj['objects'][0].timestamp = Firebase.ServerValue.TIMESTAMP;
              $scope.main.articles.$add(obj['objects'][0]);

              $scope.articleTitle = '';
              $scope.articleLink = '';
              $scope.articleComment = '';

              $location.path("/userPosts");
      });
    };
  }
]);
