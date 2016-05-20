
//diffbot callback when done, then saves to firebase
var callback = function(response, url){
  console.log("CALLBACK");
  var responseJSON = JSON.parse(response).objects[0];

  //user who is posting this article
  var userId = "f437e85a-d5b9-4be6-ad27-63c50919e57f";
  var firebaseConnection = new Firebase("https://nooz.firebaseio.com/users/" + userId + "/articles/");
  var newArticleRef = firebaseConnection.push();
  newArticleRef.set(responseJSON);

};

  //recieve message handler from browser_action, then calls diffbot api
  chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
      var url = message.url;
      var theUrl = "http://api.diffbot.com/v3/article?token=3f53f3925380eaac09a03a8c5ea11634&url=" + url;
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText, url);
      };
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    });
