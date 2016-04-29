'use strict';

cs142App.controller('FollowerListController', ['$scope',
  function($scope) {
    var currentUser = $scope.shared.currentUser;
    $scope.main = {};
    $scope.main.visibleIndexSelected = 0;

    //list of users george follows
    $scope.main.following = $scope.shared.currentUser.followers;

    //list of all articles reposted by the followee the user has selected
    $scope.main.followeeArticles = currentUser.followers[$scope.main.visibleIndexSelected].reposted_articles;

    //only show 3 people you follow at a time
    function updateVisibleIndex(value) {
        var newIndex = $scope.main.visibleIndexSelected + value;
        if (newIndex < 0 || newIndex > $scope.main.following.length - 3){
          return;
        }
        $scope.main.visibleIndexSelected = newIndex;
        $scope.main.followeeArticles = currentUser.followers[$scope.main.visibleIndexSelected].reposted_articles;
    }

    $scope.main.chevronClick = function(value) {
      updateVisibleIndex(value);
      console.log("printing!!" + $scope.main.visibleIndexSelected);
    };
  }
]);
