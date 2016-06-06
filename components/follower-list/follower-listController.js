'use strict';

cs142App.controller('FollowerListController', ['$scope', '$firebaseArray','$routeParams', '$firebaseObject',
function($scope, $firebaseArray, $routeParams, $firebaseObject) {
  $scope.main = {};

  $scope.shared.auth.$onAuth(function(authData) {

    $scope.main.followingIndex = 0;
    $scope.main.userID = authData.uid;

    var usersRef = new Firebase("https://nooz.firebaseio.com/users/");
    $scope.main.users = $firebaseArray(usersRef);
    var curatorRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.shared.authData.uid + "/following/");
    $scope.main.curators = $firebaseArray(curatorRef);

    var likesListRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID + "/likesIDArray/");
    $scope.main.likesIDArray = $firebaseArray(likesListRef);

    var likeIDsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID);
    // var obj = $firebaseObject(likeIDsRef);
    $scope.main.likesObj = $firebaseObject(likeIDsRef);
    if(!$scope.main.likesObj.likeIDs) { //if it's not initialized yet
      var obj = $firebaseObject(likeIDsRef);
          obj.$loaded().then(function() {
            if(!obj.likeIDs) { // if it doesn't exist, make it.
              obj.likeIDs = {"ID": "filler"};
              obj.$save();
              console.log("empty object saved");
            }
      });
    }
  });

  var list = [];
    for (var i = 0; i < 100; i++) {
      list.push({
        name: 'List Item ' + i,
        idx: i
      });
    }
    $scope.list = list;



  $scope.main.addLikes = function(articleObj, firebaseID, curatorID) {
      console.log("just added likes");
      if ($scope.main.likesObj.likeIDs[firebaseID]) {//already liked
          var articleRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID +"/likes/" + $scope.main.likesObj.likeIDs[firebaseID]);
          console.log("https://nooz.firebaseio.com/users/" + $scope.main.userID +"/likes/" + $scope.main.likesObj.likeIDs[firebaseID]);
          articleRef.remove();
          var likeIDsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID);
          var obj = $firebaseObject(likeIDsRef);
          obj.$loaded().then(function() {
            delete obj.likeIDs[firebaseID]
            obj.$save();
            console.log("AYY: " + firebaseID);
          });
      }
      else {
        console.log("not liked yet!");
        var likesRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID + "/likes/");
        $scope.main.likesArray = $firebaseArray(likesRef);
        articleObj.firebaseID = firebaseID;
        articleObj.curatorID = curatorID;
        articleObj.likeTime = Firebase.ServerValue.TIMESTAMP;
        $scope.main.likesArray.$add(articleObj).then(function(ref) {
          $scope.main.articleFirebaseID = ref.key();
          console.log($scope.main.articleFirebaseID);
          var likeIDsRef = new Firebase("https://nooz.firebaseio.com/users/" + $scope.main.userID);
          var obj = $firebaseObject(likeIDsRef);
          obj.$loaded().then(function() {
            if(!obj.likeIDs) { // if it doesn't exist, make it.
              obj.likeIDs = {};
              obj.$save();
              console.log("empty object saved");
            }
            var articleID = String(firebaseID);
            obj.likeIDs[articleID] = $scope.main.articleFirebaseID;
            obj.$save();
            $scope.main.idArray = JSON.parse(JSON.stringify(obj.likeIDs));
          });
        });
        // part 2
      }
  }


  /**
  * List of all articles reposted by the following person the user has selected
  */

  function updateVisibleArticle(id){
    // $scope.main.followeeArticles = currentUser.following[$scope.main.followingIndex].reposted_articles;
    var articlesRef = new Firebase("https://nooz.firebaseio.com/users/" + id +"/articles/");
    $scope.main.followeeArticles = $firebaseArray(articlesRef);
  }


  $scope.main.highlight = function(index){
    if (index === $scope.main.followingIndex){
      return "highlight";
    }
    return "";
  };


  $scope.main.articleHighlight = function(index) {
    if (index === $scope.main.articleIndex) {
      return "article-highlight";
    }
    return "";
  }

  $scope.main.articleClickHandler = function(index) {
    $scope.main.articleIndex = index;
  }
  // $scope.main.
  $scope.main.toggleHeart = function(firebaseID) {
    if($scope.main.likesObj.likeIDs) {
      if($scope.main.likesObj.likeIDs[firebaseID]) {
        return "red-heart";
      } else {
        return "";
      }
    }
  };

  /**
  * Click handler for each following entry. Update the articles listed
  */
  $scope.main.followingClickHandler = function(id, index){
    console.log("click " + index);
    $scope.curatorId = id;
    $scope.main.followingIndex = index;
    updateVisibleArticle(id);
  };


  updateVisibleArticle();

}
]);

//follower-list
