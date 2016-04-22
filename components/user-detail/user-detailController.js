'use strict';

cs142App.controller('UserDetailController', ['$scope', '$routeParams', '$location',
  function($scope, $routeParams, $location) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
    $scope.main = {};
    var userId = $routeParams.userId;

    $scope.main.callBack = function(model) {
      var parsedJson = JSON.parse(model);
      $scope.$apply(function() {
        $scope.main.user = parsedJson;
        $scope.shared.toolbarText = $scope.main.user.first_name + " " + $scope.main.user.last_name;
      });
    };
    $scope.FetchModel("/user/" + userId, $scope.main.callBack);

  }
]);
