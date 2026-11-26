window.CONSTANTS = window.CONSTANTS || {};

CONSTANTS.ROOT_ID = 'css-root';

CONSTANTS.STEAM_ID_PATTERN = /^7656\d{13}$/;

CONSTANTS.PLACEHOLDER = '—';

CONSTANTS.GAMES = Object.freeze({
    CS2: 'cs2',
    CSGO: 'csgo',
});

CONSTANTS.GAME_TOGGLES = Object.freeze([
    { game: CONSTANTS.GAMES.CSGO, label: 'CS:GO', icon: 'imgs/icons/csgo.png' },
    { game: CONSTANTS.GAMES.CS2, label: 'CS2', icon: 'imgs/icons/cs2.png' },
]);

CONSTANTS.CLIPBOARD_ICON_PATH =
    'M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 ' +
    '1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 ' +
    '1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z';

const PREMIER_TIERS = [[30, '30plus'], [25, '25_30'], [20, '20_25'], [15, '15_20'], [10, '10_15'], [5, '5_10'], [0, '0_5']];

CONSTANTS.getPremierTier = (thousands) => PREMIER_TIERS.find(([min]) => thousands >= min)[1];
