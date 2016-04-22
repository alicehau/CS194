'use strict';

cs142App.controller('UserListController', ['$scope',
  function($scope) {
    $scope.main.title = 'Users';

    $scope.main.callBack = function(model) {
      var parsedJson = JSON.parse(model);
      $scope.$apply(function() {
        $scope.main.userList = parsedJson;
      });
    };
    $scope.FetchModel("/user/list", $scope.main.callBack);

  }
]);
