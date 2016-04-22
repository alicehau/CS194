'use strict';

cs142App.controller('UserPhotosController', ['$scope', '$routeParams', '$location',
  function($scope, $routeParams, $location) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    var userId = $routeParams.userId;
    $scope.main = {};

    $scope.main.callBackPhotos = function(model) {
      var parsedJson = JSON.parse(model);
      $scope.$apply(function() {
        $scope.main.userPhotos = parsedJson;
      });
    };
    $scope.FetchModel("/photosOfUser/" + userId, $scope.main.callBackPhotos);

    $scope.main.callBackUser = function(model) {
      var parsedJson = JSON.parse(model);
      $scope.$apply(function() {
        $scope.main.user = parsedJson;
        $scope.shared.toolbarText = "Photos of " + $scope.main.user.first_name + " " + $scope.main.user.last_name;
      });
    };

    $scope.main.computePhotoSrc = function(file_name) {
      if (!file_name) {
        return ''; // Likely needed - delete to see why
      }
      return file_name.match(/^http:/) ? file_name :
        ('images/' + file_name);
    };
    $scope.FetchModel("/user/" + userId, $scope.main.callBackUser);

  }
]);
