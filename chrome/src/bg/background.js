
//diffbot callback when done, then saves to firebase
var callback = function(response, url){
  console.log("CALLBACK");
  var responseJSON = JSON.parse(response).objects[0];

  //user who is posting this article
  var userId = "a5259060-7663-448c-a240-006b8dda32b2";
  var firebaseConnection = new Firebase("https://nooz.firebaseio.com/users/" + userId + "/articles/");
  var newArticleRef = firebaseConnection.push();
  newArticleRef.set(responseJSON);

};

  //recieve message handler from browser_action, then calls diffbot api
  chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
      var url = message.url;
      var theUrl = "http://api.diffbot.com/v3/article?token=3f53f3925380eaac09a03a8c5ea11634&url=http%3A%2F%2Fwww.nytimes.com%2F2016%2F05%2F19%2Fus%2Fpolitics%2Fdonald-trump-supreme-court-nominees.html%3Fhp%26action%3Dclick%26pgtype%3DHomepage%26clickSource%3Dstory-heading%26module%3Da-lede-package-region%26region%3Dtop-news%26WT.nav%3Dtop-news%26_r%3D0";
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText, url);
      };
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    });
