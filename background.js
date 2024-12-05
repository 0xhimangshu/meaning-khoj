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
    
    if (request.type === 'SUMMARIZE_TEXT') {
        const text = request.text;
        
        fetch('https://api.meaningcloud.com/summarization-1.0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                key: 'demo', // Using demo key for free tier
                txt: text,
                sentences: '1'
            })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({
                success: true,
                summary: data.summary
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