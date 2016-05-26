'use strict';

cs142App.controller('ArticlePostController', ['$scope', '$routeParams', 
  '$location', '$firebaseArray', '$http',
  function($scope, $routeParams, $location, $firebaseArray, $http) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */


    $scope.main = {};
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.shared.authData.uid + "/articles/");
    $scope.main.articles = $firebaseArray(articlesRef);
    $scope.addArticle = function() {

      var encodedURI = encodeURIComponent($scope.articleLink);

      $http.get("http://api.diffbot.com/v3/article?token=3f53f3925380eaac09a03a8c5ea11634&url=" + encodedURI)
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
      });
    };
  }
]);
