'use strict';

cs142App.controller('FollowerListController', ['$scope', '$firebaseArray','$routeParams',
function($scope, $firebaseArray, $routeParams) {
  $scope.main = {};
  
  $scope.auth.$onAuth(function(authData) {

    $scope.main.followingIndex = 0;

    var usersRef = new Firebase("https://nooz.firebaseio.com/users/");
    $scope.main.users = $firebaseArray(usersRef);
    var curatorRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.shared.authData.uid + "/following/");
    $scope.main.curators = $firebaseArray(curatorRef);
    console.log("loaded curators");
  });
  


  /**
  * List of all articles reposted by the following person the user has selected
  */
  function updateVisibleArticle(id){
    // $scope.main.followeeArticles = currentUser.following[$scope.main.followingIndex].reposted_articles;
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + id +"/articles/");
    $scope.main.followeeArticles = $firebaseArray(articlesRef);
    console.log("gotArticles");
    console.log(id);
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
  $scope.main.followingClickHandler = function(id, index){
    $scope.curatorId = id;
    $scope.main.followingIndex = index;
    updateVisibleArticle(id);
  };

  // $scope.main.showArticle = function(index) {
    
  // }

  updateVisibleArticle();

}
]);

//follower-list
