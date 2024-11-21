const toggleButton = document.getElementById("toggle-extension");
const languageSelector = document.getElementById("language-selector");

chrome.storage.local.get(["enabled", "language"], (settings) => {
    toggleButton.checked = settings.enabled ?? true;
    languageSelector.value = settings.language ?? "es";
});

toggleButton.addEventListener("change", () => {
    const isEnabled = toggleButton.checked;
    chrome.storage.local.set({ enabled: isEnabled });
    chrome.tabs.reload(); // Reload to apply changes
});

languageSelector.addEventListener("change", (event) => {
    const selectedLanguage = event.target.value;
    chrome.storage.local.set({ language: selectedLanguage });
});
