'use strict';

cs142App.controller('ProfileListController', ['$scope', '$firebaseArray','$routeParams', '$location',
	function($scope, $firebaseArray, $routeParams, $location) {
		$scope.main = {};
		$scope.main.items = ["Follow Curators", "My Posts", "Favorites"];

		$scope.main.itemClicked = function(index){
			console.log("clicked on " + index);
			$scope.main.followingIndex = index;
			switch (index) {
				case 0: $location.path("/followPeople");
					break;
				case 1: $location.path("/userPosts");
					break;
				case 2: $location.path("/userLikes");
					break;

			}
		};

		$scope.main.highlight = function(index){
		    if (index === $scope.main.followingIndex){
		      return "chosen";
		    }
		    return "";
		 };
	}
]);

//follower-list
