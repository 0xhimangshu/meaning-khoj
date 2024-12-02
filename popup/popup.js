document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('word-input');
    const searchBtn = document.getElementById('search-btn');
    const resultContainer = document.getElementById('result-container');
    const wordTitle = document.getElementById('word-title');
    const definition = document.getElementById('definition');
    const example = document.getElementById('example');

    // Set theme based on system preference
    function setTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

    // Set initial theme
    setTheme();

    async function searchWord(word) {
        try {
            resultContainer.innerHTML = '<div class="loading">Loading...</div>';

            // Use chrome.runtime.sendMessage instead of direct fetch
            chrome.runtime.sendMessage(
                {
                    type: 'FETCH_DEFINITION',
                    word: word
                },
                response => {
                    if (response.success && response.data && response.data[0]) {
                        const wordData = response.data[0];
                        const meaning = wordData.meanings[0];
                        const def = meaning.definitions[0];

                        // Clear loading message
                        resultContainer.innerHTML = '';

                        // Display results
                        wordTitle.textContent = wordData.word;
                        definition.textContent = def.definition;
                        
                        // Show example if available
                        if (def.example) {
                            example.textContent = `Example: "${def.example}"`;
                            example.style.display = 'block';
                        } else {
                            example.style.display = 'none';
                        }

                        resultContainer.appendChild(wordTitle);
                        resultContainer.appendChild(definition);
                        resultContainer.appendChild(example);
                    } else {
                        resultContainer.innerHTML = `
                            <div class="error-message">
                                No definition found for "${word}"
                            </div>
                        `;
                    }
                }
            );

        } catch (error) {
            resultContainer.innerHTML = `
                <div class="error-message">
                    No definition found for "${word}"
                </div>
            `;
        }
    }

    function handleSearch() {
        const word = wordInput.value.trim();
        if (word) {
            searchWord(word);
        }
    }

    // Search when button is clicked
    searchBtn.addEventListener('click', handleSearch);

    // Search when Enter key is pressed 
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Focus input when popup opens
    wordInput.focus();
});