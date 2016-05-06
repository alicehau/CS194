'use strict';

cs142App.controller('FollowerListController', ['$scope',
function($scope) {
  var currentUser = $scope.shared.currentUser;
  $scope.main = {};
  $scope.main.followingIndex = 0;
  //track which index of following entry we are hovering over, null by default
  $scope.main.hoverIndex = null;
  //list of users george follows
  $scope.main.following = $scope.shared.currentUser.following;



  /**
  * List of all articles reposted by the following person the user has selected
  */
  function updateVisibleArticle(){
    $scope.main.followeeArticles = currentUser.following[$scope.main.followingIndex].reposted_articles;
  }

  /**
  * Set the class name for a following entry
  */
  $scope.main.getClassNameForHeadshot = function(value){
    console.log("called");
    if (value === $scope.main.hoverIndex){
      return "hover";
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

  /**
  * Set value of index of following entry user is hovered over
  */
  $scope.main.followingHover = function(value){
    var id = "#headshot" + value;
    console.log("hover" + id);
    $scope.main.hoverIndex = value;
  };

  updateVisibleArticle();

}
]);
