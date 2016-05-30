'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'firebase', 'ngSanitize']);

cs142App.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://nooz.firebaseio.com");
    return $firebaseAuth(ref);
  }
]);

cs142App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/users', {
      templateUrl: 'components/profile-list/profile-listTemplate.html',
      controller: 'ProfileListController'
    }).
    when('/addArticle', {
      templateUrl: 'components/article-post/article-postTemplate.html',
      controller: 'ArticlePostController'
    }).
    when('/login-register', {
      templateUrl: 'components/login-register/login-registerTemplate.html',
      controller: 'LoginRegisterController'
    }).
    when('/viewArticle/:userId/:articleId', {
      templateUrl: 'components/article-view/article-viewTemplate.html',
      controller: 'ArticleViewController'
    }).
    when('/followPeople', {
      templateUrl: 'components/follow-people/follow-peopleTemplate.html',
      controller: 'FollowPeopleController'
    }).
    when('/userPosts', {
      templateUrl: 'components/user-posts/user-postsTemplate.html',
      controller: 'UserPostsController'
    }).
    otherwise({
      redirectTo: '/login-register'
    });
  }
]);


cs142App.controller('MainController', ['$scope', '$location', 'Auth',
  function($scope, $location, Auth) {
    $scope.main = {};



    //store any shared variables between controllers
    $scope.shared = {};
    //store the logged in user
    $scope.shared.currentUser = window.noozModels.loggedInUserModel();
    $scope.shared.follow = true;
    $scope.shared.sidePaneReadingView = true;
    $scope.main.switchSidePane = function(val){
      $scope.shared.sidePaneReadingView  = val;
    };

   $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    $scope.auth.$onAuth(function(authData) {
      $scope.shared.authData = authData;
      // $scope.shared.uid = authData.uid;
      // if(authData){
      //   $scope.shared.loggedIn = true;
      // } else {
      //   $scope.shared.loggedIn = false;
      // }
    });

    $scope.main.logout = function() {
      $scope.auth.$unauth();
      $location.path('login-register');
    };
    /*
     * FetchModel - Fetch a model from the web server.
     *   url - string - The URL to issue the GET request.
     *   doneCallback - function - called with argument (model) when the
     *                  the GET request is done. The argument model is the object
     *                  containing the model. model is undefined in the error case.
     */
    $scope.FetchModel = function(url, doneCallback) {
      console.log("Fetch model: " + url);
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(){
        if (this.readyState === 4){
          doneCallback(this.responseText);
        }
      };
      xhr.open("GET", url);
      xhr.send();
    };

    $scope.main.callBack = function(model){
      var parsedJson = JSON.parse(model);
      console.log(parsedJson.version);
      $scope.$apply(function(){
        $scope.main.versionNumber = 'v' + parsedJson.version;
      });
    };

    $scope.FetchModel("http://localhost:3000/test/info", $scope.main.callBack);
  }
]);
