'use strict';

cs142App.controller('UserPostsController', ['$scope', '$firebaseArray','$routeParams', '$firebaseObject',
function($scope, $firebaseArray, $routeParams, $firebaseObject) {
  $scope.main = {};
  
  $scope.auth.$onAuth(function(authData) {
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + authData.uid +"/articles/");
    $scope.main.myArticles = $firebaseArray(articlesRef).reverse();
    console.log("got Articles for " + authData.uid);
    console.log($scope.main.myArticles);
    $scope.userID = authData.uid;
  });

  $scope.main.mode = "static";
  $scope.main.editIndex = -1;


  $scope.editComment = function(articleID, index){
    var commentRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID + "/articles/" + articleID);
    $scope.commentObj = new $firebaseObject(commentRef);

    $scope.commentObj.$loaded().then(function () {
      console.log($scope.commentObj.comment);
      $scope.main.currentText = $scope.commentObj.comment;
      console.log("index: " + index);
      $scope.main.editIndex = index;
      $scope.main.mode = "edit";
    });
  };

  $scope.setComment = function(articleID, comment, index){
    var commentRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID + "/articles/" + articleID);
    commentRef.update({comment: $scope.main.currentText});
    $scope.main.mode = "static";
    $scope.main.editIndex = -1;
  };

  $scope.deleteArticle = function(articleID) {
    var articleRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID +"/articles/" + articleID);
    articleRef.remove();
    console.log(articleID + " removed");
  }

}
]);

//follower-list
