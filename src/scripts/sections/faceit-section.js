const createFaceitSection = () => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = 'faceit-stats-container';

    const faceitLinkTitle = document.createElement('a');
    faceitLinkTitle.innerText = 'FACEIT.COM';
    faceitLinkTitle.className = 'link-title';
    faceitLinkTitle.id = 'faceit-link-title';

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
    flagImg.className = 'faceex_country';
    flagImg.id = 'faceit-user-flag';
    flagImg.alt = 'Country flag';

    const nicknameSpan = document.createElement('span');
    nicknameSpan.id = 'faceit-user-nickname';

    faceitUserNicknameContainer.appendChild(flagImg);
    faceitUserNicknameContainer.appendChild(nicknameSpan);

    const csgoButton = document.createElement('div');
    const csgoIcon = document.createElement('img');
    csgoIcon.src = chrome.runtime.getURL('imgs/icons/csgo.png');
    csgoIcon.alt = 'CS:GO';
    csgoIcon.style.width = '16px';
    csgoIcon.style.height = '16px';
    csgoIcon.style.borderRadius = '3px';
    csgoButton.appendChild(csgoIcon);
    csgoButton.className = 'header-button';
    csgoButton.id = 'faceit-csgo-button';

    const cs2Button = document.createElement('div');
    const cs2Icon = document.createElement('img');
    cs2Icon.src = chrome.runtime.getURL('imgs/icons/cs2.png');
    cs2Icon.alt = 'CS2';
    cs2Icon.style.width = '16px';
    cs2Icon.style.height = '16px';
    cs2Icon.style.borderRadius = '3px';
    cs2Button.appendChild(cs2Icon);
    cs2Button.className = 'header-button';
    cs2Button.id = 'faceit-cs2-button';

    const copyToClipboard = document.createElement('div');
    copyToClipboard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';
    copyToClipboard.className = 'header-button';
    copyToClipboard.id = 'copy-faceit-stats-to-clipboard';

    const levelContainer = document.createElement('div');
    levelContainer.className = 'stats-item';
    levelContainer.style.position = 'relative';

    const levelIcon = document.createElement('img');
    levelIcon.src = chrome.runtime.getURL('imgs/faceit/unranked.svg');
    levelIcon.alt = 'Faceit Level';
    levelIcon.id = 'faceit-stats-level-icon';
    levelIcon.style.height = '35px';
    levelIcon.style.width = 'auto';

    const levelElo = document.createElement('div');
    levelElo.innerText = '0000';
    levelElo.id = 'faceit-stats-elo';
    levelElo.className = 'stats-item-label';
    levelElo.style.position = 'absolute';
    levelElo.style.bottom = '0';
    levelElo.style.left = '50%';
    levelElo.style.transform = 'translateX(-50%)';
    levelElo.style.color = 'white';

    const kdContainer = document.createElement('div');
    kdContainer.className = 'stats-item';

    const kd = document.createElement('span');
    kd.innerText = '0.00';
    kd.id = 'faceit-stats-kd';
    kd.className = 'stats-item-value text-faceit-orange';

    const kdLabel = document.createElement('div');
    kdLabel.innerText = 'K/D';
    kdLabel.className = 'stats-item-label';

    const winrateContainer = document.createElement('div');
    winrateContainer.className = 'stats-item';

    const winrate = document.createElement('span');
    winrate.innerText = '00.0 %';
    winrate.id = 'faceit-stats-winrate';
    winrate.className = 'stats-item-value text-faceit-orange';

    const winrateLabel = document.createElement('div');
    winrateLabel.innerText = 'Win rate';
    winrateLabel.className = 'stats-item-label';

    const hsContainer = document.createElement('div');
    hsContainer.className = 'stats-item';

    const hs = document.createElement('span');
    hs.innerText = '00.0 %';
    hs.id = 'faceit-stats-hs';
    hs.className = 'stats-item-value text-faceit-orange';

    const hsLabel = document.createElement('div');
    hsLabel.innerText = 'HS%';
    hsLabel.className = 'stats-item-label';

    const matchesContainer = document.createElement('div');
    matchesContainer.className = 'stats-item';

    const matches = document.createElement('span');
    matches.innerText = '0000';
    matches.id = 'faceit-stats-matches';
    matches.className = 'stats-item-value text-faceit-orange';

    const matchesLabel = document.createElement('div');
    matchesLabel.innerText = 'Matches';
    matchesLabel.className = 'stats-item-label';

    logoContainer.appendChild(faceitLogo);
    headerTitle.appendChild(logoContainer);
    headerTitle.appendChild(faceitLinkTitle);
    headerTitle.appendChild(isBanned);
    headerComplementsContainer.appendChild(csgoButton);
    headerComplementsContainer.appendChild(cs2Button);
    headerComplementsContainer.appendChild(copyToClipboard);
    levelContainer.appendChild(levelIcon);
    levelContainer.appendChild(levelElo);
    favoriteGroupContent.appendChild(faceitUserNicknameContainer);
    favoriteGroupContent.appendChild(levelContainer);
    favoriteGroupContent.appendChild(kdContainer);
    kdContainer.appendChild(kd);
    kdContainer.appendChild(kdLabel);
    favoriteGroupContent.appendChild(winrateContainer);
    winrateContainer.appendChild(winrate);
    winrateContainer.appendChild(winrateLabel);
    favoriteGroupContent.appendChild(hsContainer);
    hsContainer.appendChild(hs);
    hsContainer.appendChild(hsLabel);
    favoriteGroupContent.appendChild(matchesContainer);
    matchesContainer.appendChild(matches);
    matchesContainer.appendChild(matchesLabel);

    return profileCustomization;
};
