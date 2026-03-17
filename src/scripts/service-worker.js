chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchPlayerData') {
        fetch(`https://shapi.jagoba.dev/External/GetPlayerInfo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.userId)
        })
            .then(response => {
                const status = response.status;
                if (!response.ok) return sendResponse({ success: false, status, error: `HTTP ${status}` });
                return response.json().then(data => sendResponse({ success: true, status, data }));
            })
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'fetchFaceitData') {
        fetch(`https://shapi.jagoba.dev/External/GetFaceitCompleteData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request.userId)
        })
            .then(response => {
                const status = response.status;
                if (!response.ok) return sendResponse({ success: false, status, error: `HTTP ${status}` });
                return response.json().then(data => sendResponse({ success: true, status, data }));
            })
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'fetchCSStatsData') {
        const userId = request.userId;
        const endpoint = request.endpoint || '';
        const url = `https://csstats.gg/player/${userId}${endpoint}`;

        fetch(url)
            .then(response => {
                const status = response.status;
                if (!response.ok) return sendResponse({ success: false, status, error: `HTTP ${status}` });
                return response.text().then(html => sendResponse({ success: true, status, data: html }));
            })
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }

});