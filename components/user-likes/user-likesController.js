'use strict';

cs142App.controller('UserLikesController', ['$scope', '$firebaseArray','$routeParams', '$firebaseObject',
function($scope, $firebaseArray, $routeParams, $firebaseObject) {
  $scope.main = {};
  
  $scope.auth.$onAuth(function(authData) {
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + authData.uid +"/likes/");
    $scope.main.myLikes = $firebaseArray(articlesRef);
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
    var articleRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID +"/likes/" + articleID);
    var articleObj = $firebaseObject(articleRef);
    articleObj.$loaded().then(function() {
      $scope.main.deleteID = articleObj['firebaseID'];
      var likeIDsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID);
      var obj = $firebaseObject(likeIDsRef);
      obj.$loaded().then(function() {
        delete obj.likeIDs[$scope.main.deleteID];
        obj.$save();
        console.log("articleID: " + $scope.main.deleteID);
      });
      var articleRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.userID +"/likes/" + articleID);
      articleRef.remove();

    });







    console.log(articleID + " removed");
  }

}
]);

//follower-list
