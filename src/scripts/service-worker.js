chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchPlayerData') {
        fetch(`https://cswatch.in/api/players/${request.userId}`)
            .then(response => response.json())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});