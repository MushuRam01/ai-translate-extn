// Content script to replace words on the page
let enabled = true; // Check if the extension is enabled
let language = "es"; // Default language (Spanish)

// Function to replace text on the page
const replaceText = async () => {
    if (!enabled) return;

    const elements = document.body.querySelectorAll("*:not(script):not(style)");
    for (const element of elements) {
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent.trim();
                if (originalText) {
                    const translatedText = await translateText(originalText, language);
                    saveToLocalDatabase(originalText, translatedText);
                    node.textContent = translatedText;
                }
            }
        }
    }
};

// Function to call Gemini AI translation API
const translateText = async (text, targetLanguage) => {
    const response = await fetch("https://api.gemini-ai/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_API_KEY"
        },
        body: JSON.stringify({ text, target_language: targetLanguage })
    });
    const data = await response.json();
    return data.translated_text || text; // Fallback to original text if translation fails
};

// Function to store translations locally
const saveToLocalDatabase = (original, translated) => {
    const entry = { original, translated, timestamp: new Date() };
    const db = window.localStorage.getItem("translations") || "[]";
    const updatedDB = JSON.parse(db);
    updatedDB.push(entry);
    window.localStorage.setItem("translations", JSON.stringify(updatedDB));
};

// Observe changes to the DOM for dynamic content
const observer = new MutationObserver(replaceText);
observer.observe(document.body, { childList: true, subtree: true });

replaceText(); // Initial run
