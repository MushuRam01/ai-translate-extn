// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "replaceRandomWords") {
    const replacementPhrase = request.phrase;
    console.log(`Replacing random words with: ${replacementPhrase}`);
    replaceRandomWords(replacementPhrase);
  }
  sendResponse();
});

// Function to replace random words
function replaceRandomWords(replacementPhrase) {
  // Regular expression to match words
  const regex = /\b\w+\b/g;

  // Get all text nodes in the document
  const textNodes = getTextNodesInDocument();

  textNodes.forEach(node => {
    let text = node.nodeValue;
    let newText = text.replace(regex, (word) => {
      return Math.random() > 0.7 ? replacementPhrase : word; // 30% chance to replace each word
    });
    
    // Only replace if the text has changed
    if (newText !== text) {
      node.nodeValue = newText;
      highlightTextNode(node); // Optional: Highlight the replaced word
    }
  });
}

// Helper function to get all text nodes in the document
function getTextNodesInDocument() {
  let textNodes = [];
  (function recursive(node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        recursive(node.childNodes[i]);
      }
    }
  })(document.body);
  return textNodes;
}

// Function to highlight the replaced word
function highlightTextNode(node) {
  // Highlight the replaced word with yellow background and red text
  const span = document.createElement("span");
  span.style.backgroundColor = "yellow";
  span.style.color = "red";
  span.style.fontWeight = "bold";
  span.textContent = node.nodeValue;
  
  // Replace the original node with the span
  node.replaceWith(span);
}
