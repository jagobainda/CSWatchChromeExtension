const request = (type, steamId) => new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, steamId }, (response) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else if (!response) reject(new Error('no_response'));
        else if (!response.ok) reject(new Error(response.error));
        else resolve(response.data);
    });
});
