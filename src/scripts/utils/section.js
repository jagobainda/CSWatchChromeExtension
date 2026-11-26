const ERROR_MESSAGES = Object.freeze({
    not_found: 'No data',
    blocked: 'Blocked by the data source',
    timeout: 'The data source took too long to respond'
});

const assetBackground = (path) => `url('${chrome.runtime.getURL(path)}')`;

const createClipboardIcon = () => {
    const namespace = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(namespace, 'svg');
    const path = document.createElementNS(namespace, 'path');

    Object.entries({ width: 16, height: 16, fill: 'currentColor', viewBox: '0 0 16 16' }).forEach(([name, value]) => icon.setAttribute(name, value));
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', CONSTANTS.CLIPBOARD_ICON_PATH);
    icon.append(path);

    return icon;
};

const createStat = ({ label, value, game, title, valueClass, style }) =>
    el(
        'div',
        { className: 'css-stat', dataset: game && { game }, title },
        el('span', { className: ['css-stat-value', valueClass].filter(Boolean).join(' '), style }, value ?? CONSTANTS.PLACEHOLDER),
        el('div', { className: 'css-stat-label' }, label)
    );

const createSection = ({ id, title, href, logo, games = false, emptyMessage = ERROR_MESSAGES.not_found }) => {
    let selectedGame = CONSTANTS.GAMES.CS2;
    let copyPairs = () => [];

    const titleGroup = el(
        'div',
        { className: 'css-header-group' },
        logo && el('div', { className: 'css-logo' }, el('img', { src: chrome.runtime.getURL(logo), alt: '' })),
        externalLink(href, { className: 'css-link-title' }, title)
    );
    const body = el('div', { className: 'showcase_content_bg css-stats' });

    const gameButtons = games
        ? CONSTANTS.GAME_TOGGLES.map(({ game, label, icon }) =>
              el(
                  'div',
                  { className: 'css-header-button', dataset: { game }, title: label, onclick: () => selectGame(game) },
                  el('img', { className: 'css-game-icon', src: chrome.runtime.getURL(icon), alt: label })
              )
          )
        : [];

    const selectGame = (game) => {
        selectedGame = game;
        gameButtons.forEach((button) => button.classList.toggle('css-selected', button.dataset.game === game));
        body.querySelectorAll('[data-game]').forEach((item) => item.classList.toggle('css-hidden', item.dataset.game !== game));
    };

    const copy = () => {
        const text = copyPairs(selectedGame)
            .map(([label, value]) => `${label}: ${value}`)
            .join(' | ');
        if (text) navigator.clipboard.writeText(text).catch((error) => console.error('Failed to copy stats to clipboard:', error));
    };

    const copyButton = el('div', { className: 'css-header-button css-disabled', title: 'Copy', onclick: copy }, createClipboardIcon());

    const showMessage = (message) => body.replaceChildren(el('p', { className: 'css-status' }, message));

    const render = (items, pairs) => {
        body.replaceChildren(...items);
        copyPairs = pairs;
        copyButton.classList.remove('css-disabled');
        selectGame(selectedGame);
    };

    const setAvailableGames = (available) => {
        gameButtons.forEach((button) => button.classList.toggle('css-disabled', !available[button.dataset.game]));
        if (!available[CONSTANTS.GAMES.CS2] && available[CONSTANTS.GAMES.CSGO]) selectGame(CONSTANTS.GAMES.CSGO);
    };

    showMessage('Loading…');
    selectGame(selectedGame);

    return {
        element: el(
            'div',
            { className: 'profile_customization', id },
            el('div', { className: 'profile_customization_header' }, el('div', { className: 'css-header' }, titleGroup, el('div', { className: 'css-header-group' }, gameButtons, copyButton))),
            el('div', { className: 'favoritegroup_showcase' }, body)
        ),
        render,
        setAvailableGames,
        addToHeader: (node) => titleGroup.append(node),
        setLink: (url) => titleGroup.querySelector('.css-link-title').setAttribute('href', url),
        load: (promise, onData) =>
            promise.then(onData).catch((error) => {
                gameButtons.forEach((button) => button.classList.add('css-disabled'));
                showMessage(error.message === 'not_found' ? emptyMessage : (ERROR_MESSAGES[error.message] ?? 'Failed to load data'));
            })
    };
};
