
document.getElementById("submit-article").onclick = function () {
  var comment = document.getElementById('comment-text-area').value;
  document.getElementsByClassName("loader")[0].style.display = "block";
  document.getElementById('header').innerHTML = "Posting...";

  var parent = document.getElementById("mainPopup");
  var child = document.getElementById("form");
  parent.removeChild(child);

  chrome.tabs.getSelected(null,function(tab) {
      chrome.runtime.sendMessage({url: tab.url, comment: comment}, function(response) {
        });
  });

 };

 chrome.extension.onMessage.addListener(
   function(message, sender, sendResponse) {
     document.getElementById("mainPopup").style.backgroundColor = '#54c859';
     document.getElementsByClassName("loader")[0].style.display = "none";
     document.getElementById('header').innerHTML = "Done!";

  });
