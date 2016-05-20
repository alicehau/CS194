//gets called immediately once the chrome icon is pressed
chrome.tabs.getSelected(null,function(tab) {
    chrome.extension.sendMessage({
          url: tab.url
      });
});
