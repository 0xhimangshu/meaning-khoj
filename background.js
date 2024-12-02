chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'FETCH_DEFINITION') {
        const word = request.word;
        
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                sendResponse({
                    success: true,
                    data: data
                });
            })
            .catch(error => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });
  
        return true;
    }
});