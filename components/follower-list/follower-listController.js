'use strict';

cs142App.controller('FollowerListController', ['$scope',
function($scope) {
  var currentUser = $scope.shared.currentUser;
  $scope.main = {};
  $scope.main.followingIndex = 0;

  //list of users george follows
  $scope.main.following = $scope.shared.currentUser.following;



  /**
  * List of all articles reposted by the following person the user has selected
  */
  function updateVisibleArticle(){
    $scope.main.followeeArticles = currentUser.following[$scope.main.followingIndex].reposted_articles;
  }


  $scope.main.highlight = function(index){
    if (index === $scope.main.followingIndex){
      return "highlight";
    }
    return "";
  };

  /**
  * Click handler for each following entry. Update the articles listed
  */
  $scope.main.followingClickHandler = function(value){
    $scope.main.followingIndex = value;
    updateVisibleArticle();
  };

  updateVisibleArticle();

}
]);
