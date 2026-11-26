const createCSStatsSection = () => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = CONSTANTS.CONTAINER_IDS.CSSTATS;


    const csStatsLinkTitle = document.createElement('a');
    csStatsLinkTitle.innerText = 'CSSTATS.GG';
    csStatsLinkTitle.className = 'link-title';
    csStatsLinkTitle.id = 'cs-stats-link-title';

    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    const csStatsLogo = document.createElement('img');
    csStatsLogo.src = chrome.runtime.getURL('imgs/logos/csstats-logo.svg');
    csStatsLogo.alt = 'CSStats Logo';

    const { csgoButton, cs2Button } = CONSTANTS.createGameToggleButtons('csstats');
    const copyToClipboard = CONSTANTS.createCopyToClipboardButton('copy-csstats-stats-to-clipboard');

    const cs2 = CONSTANTS.GAMES.CS2;
    const csgo = CONSTANTS.GAMES.CSGO;
    const premierBg = `url('${chrome.runtime.getURL('imgs/premiere/0_5.png')}')`;
    const csgoBg = `url('${chrome.runtime.getURL('imgs/csgo/1.png')}')`;
    const premierClasses = 'premiere-rank-badge premiere-rank-padding cs-typography';
    const blue = 'text-csstats-blue';

    const statItems = [
        CONSTANTS.createStatItem({ id: 'csstats-stats-premiere-current-elo', initialValue: '---', label: 'Current', valueClasses: premierClasses, containerClasses: 'hidden', dataGame: cs2, bgImage: premierBg }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-premiere-best-elo',    initialValue: '---', label: 'Best',    valueClasses: premierClasses, containerClasses: 'hidden', dataGame: cs2, bgImage: premierBg }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-kd',           initialValue: '0.00',    label: 'K/D',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-winrate',       initialValue: '00.0 %',  label: 'Win rate',   valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-hs',            initialValue: '00.0 %',  label: 'HS%',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-adr',           initialValue: '00',      label: 'ADR',        valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-matches',       initialValue: '0000',    label: 'Matches',    valueClasses: blue, containerClasses: 'hidden', dataGame: cs2 }),
        CONSTANTS.createStatItem({ id: 'csstats-last-csgo-rank',      initialValue: '',        label: 'Last',       valueClasses: 'premiere-rank-badge', containerClasses: 'hidden', dataGame: csgo, bgImage: csgoBg }),
        CONSTANTS.createStatItem({ id: 'csstats-best-csgo-rank',      initialValue: '',        label: 'Best',       valueClasses: 'premiere-rank-badge', containerClasses: 'hidden', dataGame: csgo, bgImage: csgoBg }),
        CONSTANTS.createStatItem({ id: 'csstats-stats-csgo-matches',  initialValue: '0000',    label: 'CS:GO MM Wins', valueClasses: blue, containerClasses: 'hidden', dataGame: csgo }),
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
