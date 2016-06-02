
document.getElementById("submit-article").onclick = function () {
  console.log("button");
  var comment = document.getElementById('comment-text-area').value;

  // chrome.extension.sendMessage({content: comment, type: "comment"});

  chrome.tabs.getSelected(null,function(tab) {
      chrome.extension.sendMessage({url: tab.url, comment: comment});
  });
 };
