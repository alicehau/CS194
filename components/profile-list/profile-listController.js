'use strict';

cs142App.controller('ProfileListController', ['$scope', '$firebaseArray','$routeParams', '$location',
	function($scope, $firebaseArray, $routeParams, $location) {
		$scope.main = {};
		$scope.main.items = ["Follow", "Your Posts", "Favorites"];


		$scope.main.itemClicked = function(index){
			console.log("clicked on " + index);
			switch (index) {
				case 0: $location.path("/followPeople");
					break;
				case 1: $location.path("/userPosts");
					break;

			}
		};
	}
]);

//follower-list
