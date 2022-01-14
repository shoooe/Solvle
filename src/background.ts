chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.id == null) return;
  chrome.tabs.executeScript(tab.id, {
    file: "inject.js",
  });
});
