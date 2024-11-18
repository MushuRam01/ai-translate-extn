document.addEventListener('DOMContentLoaded', function () {
  const replaceButton = document.getElementById("replace-headings");
  const phraseInput = document.getElementById("phrase");

  // Load saved phrase from storage
  chrome.storage.sync.get(["headingReplacementPhrase"], (result) => {
    phraseInput.value = result.headingReplacementPhrase || "Default Replacement Phrase";
  });

  // Listen for the button click
  replaceButton.addEventListener("click", () => {
    const phrase = phraseInput.value;

    // Save the phrase in storage
    chrome.storage.sync.set({ headingReplacementPhrase: phrase }, () => {
      console.log(`Saved replacement phrase: ${phrase}`);
    });

    // Send a message to the content script to replace random words
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "replaceRandomWords", phrase });
    });
  });
});
