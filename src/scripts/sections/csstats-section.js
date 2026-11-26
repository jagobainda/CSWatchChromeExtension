const createCSStatsSection = (steamId) => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = CONSTANTS.CONTAINER_IDS.CSSTATS;


    const csStatsLinkTitle = CONSTANTS.createLinkTitle('CSSTATS.GG', 'cs-stats-link-title', `https://csstats.gg/player/${steamId}`);

    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    const csStatsLogo = document.createElement('img');
    csStatsLogo.src = chrome.runtime.getURL('imgs/logos/csstats-logo.svg');
    csStatsLogo.alt = 'CSStats Logo';

    const { csgoButton, cs2Button } = CONSTANTS.createGameToggleButtons('csstats');
    const copyToClipboard = CONSTANTS.createCopyToClipboardButton('copy-csstats-stats-to-clipboard');

    const cs2 = CONSTANTS.GAMES.CS2;
    const csgo = CONSTANTS.GAMES.CSGO;
    const premierClasses = 'premiere-rank-badge premiere-rank-padding cs-typography';
    const blue = 'text-csstats-blue';

    const statItems = [
        CONSTANTS.createStatItem({ id: 'csstats-stats-premiere-current-elo', label: 'Current', valueClasses: premierClasses, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-premiere-best-elo',    label: 'Best',    valueClasses: premierClasses, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-kd',           label: 'K/D',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-winrate',       label: 'Win rate',   valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-hs',            label: 'HS%',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-adr',           label: 'ADR',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-matches',       label: 'Matches',    valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-last-csgo-rank',      label: 'Last',       valueClasses: 'premiere-rank-badge', containerClasses: 'hidden', dataGame: csgo }),
        CONSTANTS.createStatItem({ id: 'csstats-best-csgo-rank',      label: 'Best',       valueClasses: 'premiere-rank-badge', containerClasses: 'hidden', dataGame: csgo }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-csgo-matches',  label: 'CS:GO MM Wins', valueClasses: blue, containerClasses: 'hidden', dataGame: csgo }),
    ];

    logoContainer.appendChild(csStatsLogo);
    headerTitle.appendChild(logoContainer);
    headerTitle.appendChild(csStatsLinkTitle);
    headerComplementsContainer.appendChild(csgoButton);
    headerComplementsContainer.appendChild(cs2Button);
    headerComplementsContainer.appendChild(copyToClipboard);
    statItems.forEach(item => favoriteGroupContent.appendChild(item));

    return profileCustomization;
};
