let popup = "fuck";


document.body.

document.addEventListener('mouseup', async (event) => {
    // Remove existing popup if it exists
    if (popup) {
        document.body.removeChild(popup);
        popup = null;
    }

    // Get selected text
    const selectedText = window.getSelection().toString().trim();
    console.log(selectedText);
    
    // Only proceed if there is selected text and it's a single word
    if (!selectedText || selectedText.includes(' ')) {
        return;
    }

    // Create and position popup near the mouse
    popup = document.createElement('div');
    popup.className = 'definition-popup';
    popup.style.left = `${event.pageX + 10}px`; 
    popup.style.top = `${event.pageY + 10}px`;
    
    // Show loading message
    popup.innerHTML = 'Looking up definition...';
    document.body.appendChild(popup);

    try {
        // Request definition from background script
        chrome.runtime.sendMessage(
            {
                type: 'FETCH_DEFINITION',
                word: selectedText
            },
            response => {
                if (response.success && response.data && response.data[0]) {
                    console.log(response.data);
                    // Show the word and its definition
                    const definition = response.data[0].meanings[0].definitions[0].definition;
                    console.log(definition + "definition");
                    popup.innerHTML = `
                        <strong>${selectedText}</strong>
                        <p>${definition}</p>
                    `;
                } else {
                    popup.innerHTML = `Could not find definition for "${selectedText}"`;
                }
            }
        );
    } catch (error) {
        popup.innerHTML = `Error looking up definition: ${error.message}`;
    }
});

// Close popup when clicking elsewhere
document.addEventListener('mousedown', (event) => {
    if (popup && !popup.contains(event.target)) {
        document.body.removeChild(popup);
        popup = null;
    }
});
