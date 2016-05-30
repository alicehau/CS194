'use strict';

cs142App.controller('ProfileListController', ['$scope', '$firebaseArray','$routeParams',
function($scope, $firebaseArray, $routeParams) {
  $scope.main = {};
  $scope.main.items = ["Follow", "Your Posts", "Favorites"];


  $scope.main.itemClicked = function(index){
    console.log("clicked on " + index);
  };
  }
]);

//follower-list
