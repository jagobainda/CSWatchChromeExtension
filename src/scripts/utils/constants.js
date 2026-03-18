window.CONSTANTS = window.CONSTANTS || {};

CONSTANTS.state = {
    responseData: null,
    faceitResponseData: null,
    csStatsResponseData: null,
};

CONSTANTS.GAMES = Object.freeze({
    CS2: 'cs2',
    CSGO: 'csgo',
});

CONSTANTS.CONTAINER_IDS = Object.freeze({
    CSREP: 'cs-rep-stats-container',
    CSSTATS: 'csstats-stats-container',
    FACEIT: 'faceit-stats-container',
});

CONSTANTS.FACEIT_KEYS = Object.freeze({
    KD: 'k5',
    WINRATE: 'k6',
    HS: 'k8',
    MATCHES: 'm1',
});

CONSTANTS.METRIC_TYPES = Object.freeze({
    KD: 'kd',
    REACTION: 'reaction',
    PREAIM: 'preaim',
    AIM: 'aim',
    WINRATE: 'winrate',
});

CONSTANTS.CLIPBOARD_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" ' +
    'class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 ' +
    '2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 ' +
    '1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 ' +
    '1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';

CONSTANTS.getPremierRankBackground = (rank) => {
    if (!rank) return '';
    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum)) return '';
    if (rankNum >= 30) return '30plus';
    if (rankNum >= 25) return '25_30';
    if (rankNum >= 20) return '20_25';
    if (rankNum >= 15) return '15_20';
    if (rankNum >= 10) return '10_15';
    if (rankNum >= 5) return '5_10';
    if (rankNum >= 0) return '0_5';
    return '';
};

CONSTANTS.createGameToggleButtons = (sectionPrefix) => {
    const createButton = (game, label, iconFile) => {
        const button = document.createElement('div');
        const icon = document.createElement('img');
        icon.src = chrome.runtime.getURL(`imgs/icons/${iconFile}`);
        icon.alt = label;
        icon.className = 'game-toggle-icon';
        button.appendChild(icon);
        button.className = 'header-button';
        button.id = `${sectionPrefix}-${game}-button`;
        return button;
    };

    return {
        csgoButton: createButton(CONSTANTS.GAMES.CSGO, 'CS:GO', 'csgo.png'),
        cs2Button: createButton(CONSTANTS.GAMES.CS2, 'CS2', 'cs2.png'),
    };
};

CONSTANTS.createCopyToClipboardButton = (id) => {
    const btn = document.createElement('div');
    btn.innerHTML = CONSTANTS.CLIPBOARD_SVG;
    btn.className = 'header-button';
    btn.id = id;
    return btn;
};

CONSTANTS.waitForElement = (selector, timeoutMs = 5000) => {
    return new Promise((resolve) => {
        const existing = document.querySelector(selector);
        if (existing) {
            resolve(existing);
            return;
        }

        let resolved = false;
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el && !resolved) {
                resolved = true;
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });

        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                observer.disconnect();
                resolve(null);
            }
        }, timeoutMs);
    });
};

CONSTANTS.createStatItem = ({ id, initialValue = '', label, valueClasses = '', containerClasses = '', dataGame = null, containerTitle = null, bgImage = null }) => {
    const container = document.createElement('div');
    container.className = ['stats-item', containerClasses].filter(Boolean).join(' ');
    if (dataGame) container.dataset.game = dataGame;
    if (containerTitle) container.title = containerTitle;

    const valueEl = document.createElement('span');
    valueEl.innerText = initialValue;
    valueEl.id = id;
    valueEl.className = ['stats-item-value', valueClasses].filter(Boolean).join(' ');
    if (bgImage) valueEl.style.backgroundImage = bgImage;

    const labelEl = document.createElement('div');
    labelEl.innerText = label;
    labelEl.className = 'stats-item-label';

    container.appendChild(valueEl);
    container.appendChild(labelEl);
    return container;
};
