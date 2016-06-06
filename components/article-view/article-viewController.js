'use strict';

cs142App.controller('ArticleViewController', ['$scope', '$routeParams',
  '$location', '$firebaseArray', '$http', '$firebaseObject',
  function($scope, $routeParams, $location, $firebaseArray, $http, $firebaseObject) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */

    var userID = $routeParams.userId;
    var articleId = $routeParams.articleId;

    console.log("userID: " + userID);
    console.log("atricleID: " + articleId);
    var articleRef = new Firebase("https://nooz.firebaseio.com/users/"+ userID +"/articles/" + articleId);
    $scope.articleObj = $firebaseObject(articleRef);

    $scope.articleObj.$loaded().then(function () {
      $scope.articleData = $scope.articleObj.html;
      $scope.articleTitle = $scope.articleObj.title;
    });

    $scope.main.backToLikes = function() {
        $location.path("/userLikes");
        $scope.shared.viewMode = "";
    };


    console.log("ArticleObj:");
    // console.log(articleObj);


    // $scope.articleData = articleObj.html;
    // console.log(articleObj.html);
    // $scope.articleTitle = articleObj.title;
    // console.log("line 17");

    // var articleObj = list.$getRecord(articleId);
    // console.log("article Obj:");
    // console.log(articleObj);

     $scope.viewArticle = function() {
        console.log("clicked viewArticle");
        $http.get("http://api.diffbot.com/v3/article?token=3f53f3925380eaac09a03a8c5ea11634&url=http%3A%2F%2Fwww.nytimes.com%2F2016%2F05%2F19%2Fus%2Fpolitics%2Fdonald-trump-supreme-court-nominees.html%3Fhp%26action%3Dclick%26pgtype%3DHomepage%26clickSource%3Dstory-heading%26module%3Da-lede-package-region%26region%3Dtop-news%26WT.nav%3Dtop-news%26_r%3D0")
            .then(function(response) {
                var obj = response.data;
                console.log(obj['objects'][0]["html"]);
                $scope.articleData = obj['objects'][0]["html"];
                $scope.articleTitle = obj['objects'][0]['title'];
                console.log("Success response");
        });

     };



    
      
  }
]);
