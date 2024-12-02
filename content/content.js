// Popup styles configuration
const POPUP_STYLES = {
    tooltip: {
        className: 'extension-tooltip',
        offset: { x: 10, y: 10 }
    },
    word: {
        fontWeight: 'bold',
        marginBottom: '8px'
    },
    partOfSpeech: {
        fontSize: '12px',
        color: '#999',
        marginBottom: '8px'
    },
    definition: {
        marginBottom: '8px'
    },
    example: {
        fontStyle: 'italic',
        color: '#999',
        display: 'block'
    }
};

let popup = null;

document.addEventListener('mouseup', async (event) => {
    if (popup) {
        document.body.removeChild(popup);
        popup = null;
    }

    const selectedText = window.getSelection().toString().trim();
    
    if (!selectedText || selectedText.length > 50 || selectedText.includes(' ')) {
        return;
    }

    popup = document.createElement('div');
    popup.className = POPUP_STYLES.tooltip.className;
    popup.style.left = `${event.pageX + POPUP_STYLES.tooltip.offset.x}px`; 
    popup.style.top = `${event.pageY + POPUP_STYLES.tooltip.offset.y}px`;

    popup.textContent = 'Loading definition...';
    document.body.appendChild(popup);

    try {
        chrome.runtime.sendMessage(
            {
                type: 'FETCH_DEFINITION',
                word: selectedText
            },
            response => {
                if (response.success && response.data && response.data[0]) {
                    const wordData = response.data[0];
                    const meaning = wordData.meanings[0];
                    const definition = meaning.definitions[0];

                    const content = document.createElement('div');
                    
                    const wordEl = document.createElement('div');
                    Object.assign(wordEl.style, POPUP_STYLES.word);
                    wordEl.textContent = selectedText;
                    content.appendChild(wordEl);

                    if (meaning.partOfSpeech) {
                        const posEl = document.createElement('div');
                        Object.assign(posEl.style, POPUP_STYLES.partOfSpeech);
                        posEl.textContent = meaning.partOfSpeech;
                        content.appendChild(posEl);
                    }

                    const meaningEl = document.createElement('div');
                    Object.assign(meaningEl.style, POPUP_STYLES.definition);
                    meaningEl.textContent = definition.definition;
                    content.appendChild(meaningEl);

                    const exampleEl = document.createElement('div');
                    Object.assign(exampleEl.style, POPUP_STYLES.example);
                    exampleEl.textContent = definition.example ? 
                        `Example: "${definition.example}"` : 
                        'No example available';
                    content.appendChild(exampleEl);
                    popup.textContent = '';
                    popup.appendChild(content);

                } else {
                    popup.textContent = `No definition found for "${selectedText}"`;
                }
            }
        );
    } catch (error) {
        popup.textContent = `Error: ${error.message}`;
    }
});

document.addEventListener('mousedown', (event) => {
    if (popup && !popup.contains(event.target)) {
        document.body.removeChild(popup);
        popup = null;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup) {
        document.body.removeChild(popup);
        popup = null;
    }
});

window.addEventListener('scroll', () => {
    if (popup) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            popup.style.left = `${rect.left + window.scrollX}px`;
            popup.style.top = `${rect.bottom + window.scrollY + POPUP_STYLES.tooltip.offset.y}px`;
        }
    }
});
