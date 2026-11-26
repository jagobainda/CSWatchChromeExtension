const createFaceitSection = () => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = CONSTANTS.CONTAINER_IDS.FACEIT;


    const faceitLinkTitle = CONSTANTS.createLinkTitle('FACEIT.COM', 'faceit-link-title');

    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    const faceitLogo = document.createElement('img');
    faceitLogo.src = chrome.runtime.getURL('imgs/logos/faceit-logo.png');
    faceitLogo.alt = 'Faceit Logo';

    const isBanned = document.createElement('div');
    isBanned.innerText = 'Banned';
    isBanned.className = 'is-autoflagged';
    isBanned.id = 'is-banned';

    const faceitUserNicknameContainer = document.createElement('div');
    faceitUserNicknameContainer.className = 'faceit-user-nickname hidden';
    faceitUserNicknameContainer.id = 'faceit-user-nickname-container';

    const flagImg = document.createElement('img');
    flagImg.className = 'faceit_country';
    flagImg.id = 'faceit-user-flag';
    flagImg.alt = 'Country flag';

    const nicknameSpan = document.createElement('span');
    nicknameSpan.id = 'faceit-user-nickname';

    faceitUserNicknameContainer.appendChild(flagImg);
    faceitUserNicknameContainer.appendChild(nicknameSpan);

    const { csgoButton, cs2Button } = CONSTANTS.createGameToggleButtons('faceit');
    const copyToClipboard = CONSTANTS.createCopyToClipboardButton('copy-faceit-stats-to-clipboard');

    const levelContainer = document.createElement('div');
    levelContainer.className = 'stats-item faceit-level-container';

    const levelIcon = document.createElement('img');
    levelIcon.src = chrome.runtime.getURL('imgs/faceit/unranked.svg');
    levelIcon.alt = 'Faceit Level';
    levelIcon.id = 'faceit-stats-level-icon';
    levelIcon.className = 'faceit-level-icon';

    const levelElo = document.createElement('div');
    levelElo.innerText = CONSTANTS.PLACEHOLDER;
    levelElo.id = 'faceit-stats-elo';
    levelElo.className = 'stats-item-label faceit-elo-label';

    levelContainer.appendChild(levelIcon);
    levelContainer.appendChild(levelElo);

    const orange = 'text-faceit-orange';
    const statItems = [
        CONSTANTS.createStatItem({ id: 'faceit-stats-kd',      label: 'K/D',      valueClasses: orange }),
        CONSTANTS.createStatItem({ id: 'faceit-stats-winrate',  label: 'Win rate', valueClasses: orange }),
        CONSTANTS.createStatItem({ id: 'faceit-stats-hs',       label: 'HS%',      valueClasses: orange }),
        CONSTANTS.createStatItem({ id: 'faceit-stats-matches',  label: 'Matches',  valueClasses: orange }),
    ];

    logoContainer.appendChild(faceitLogo);
    headerTitle.appendChild(logoContainer);
    headerTitle.appendChild(faceitLinkTitle);
    headerTitle.appendChild(isBanned);
    headerComplementsContainer.appendChild(csgoButton);
    headerComplementsContainer.appendChild(cs2Button);
    headerComplementsContainer.appendChild(copyToClipboard);
    favoriteGroupContent.appendChild(faceitUserNicknameContainer);
    favoriteGroupContent.appendChild(levelContainer);
    statItems.forEach(item => favoriteGroupContent.appendChild(item));

    return profileCustomization;
};
