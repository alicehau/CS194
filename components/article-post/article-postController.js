'use strict';

cs142App.controller('ArticlePostController', ['$scope', '$routeParams', 
  '$location', '$firebaseArray',
  function($scope, $routeParams, $location, $firebaseArray) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    $scope.uid = $scope.shared.authData.uid;

    $scope.main = {};
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.uid + "/articles/");
    $scope.main.articles = $firebaseArray(articlesRef);
    $scope.addArticle = function() {
      $scope.main.articles.$add({
        url: $scope.articleLink,
        comment: $scope.articleComment,
        title: $scope.articleTitle
      });
      //form fields bound to $scope
      $scope.articleTitle = '';
      $scope.articleLink = '';
      $scope.articleComment = '';
    };
  }
]);
