
//diffbot callback when done, then saves to firebase
var callback = function(response, url, comment){
  console.log("CALLBACK ");
  console.log(response);
  var responseJSON = JSON.parse(response).objects[0];
  responseJSON.comment = comment;
  //user who is posting this article
  var userId = "191e913d-baf5-49c8-847a-f31f81f0f4b7";//Kirby Gee
  var firebaseConnection = new Firebase("https://nooz.firebaseio.com/users/" + userId + "/articles/");
  var newArticleRef = firebaseConnection.push();
  responseJSON.timestamp = Firebase.ServerValue.TIMESTAMP;
  console.log(responseJSON.timestamp);
  newArticleRef.set(responseJSON, function(error){
    console.log("success");
    chrome.tabs.create({url:chrome.extension.getURL("browser_action.html")});

  });

};
var comment = "";
  //recieve message handler from browser_action, then calls diffbot api
  chrome.extension.onMessage.addListener(
    function(message, sender, sendResponse) {
      console.log(message);
      var url = message.url;
      var comment = message.comment;
      console.log(url + " -> " + comment);
      var theUrl = "http://api.diffbot.com/v3/article?token=90d8a5387254ad57971dc32a4a59e9b2&url=" + encodeURIComponent(url);
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          callback(xmlHttp.responseText, url, comment);
        }
      };
      xmlHttp.open("GET", theUrl, true); // true for asynchronous
      xmlHttp.send(null);
    });
