const createCSStatsSection = () => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = 'csstats-stats-container';

    const csStatsLinkTitle = document.createElement('a');
    csStatsLinkTitle.innerText = 'CSSTATS.GG';
    csStatsLinkTitle.className = 'link-title';
    csStatsLinkTitle.id = 'cs-stats-link-title';

    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';

    const csStatsLogo = document.createElement('img');
    csStatsLogo.src = chrome.runtime.getURL('imgs/logos/csstats-logo.svg');
    csStatsLogo.alt = 'CSStats Logo';

    const csgoButton = document.createElement('div');
    const csgoIcon = document.createElement('img');
    csgoIcon.src = chrome.runtime.getURL('imgs/icons/csgo.png');
    csgoIcon.alt = 'CS:GO';
    csgoIcon.style.width = '16px';
    csgoIcon.style.height = '16px';
    csgoIcon.style.borderRadius = '3px';
    csgoButton.appendChild(csgoIcon);
    csgoButton.className = 'header-button';
    csgoButton.id = 'csstats-csgo-button';

    const cs2Button = document.createElement('div');
    const cs2Icon = document.createElement('img');
    cs2Icon.src = chrome.runtime.getURL('imgs/icons/cs2.png');
    cs2Icon.alt = 'CS2';
    cs2Icon.style.width = '16px';
    cs2Icon.style.height = '16px';
    cs2Icon.style.borderRadius = '3px';
    cs2Button.appendChild(cs2Icon);
    cs2Button.className = 'header-button';
    cs2Button.id = 'csstats-cs2-button';

    const copyToClipboard = document.createElement('div');
    copyToClipboard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';
    copyToClipboard.className = 'header-button';
    copyToClipboard.id = 'copy-csstats-stats-to-clipboard';

    const premierCurrentEloContainer = document.createElement('div');
    premierCurrentEloContainer.className = 'stats-item hidden';
    premierCurrentEloContainer.dataset.game = 'cs2';

    const premierCurrentElo = document.createElement('span');
    premierCurrentElo.innerText = '---';
    premierCurrentElo.id = 'csstats-stats-premiere-current-elo';
    premierCurrentElo.className = 'stats-item-value premiere-rank-badge cs-typography';
    premierCurrentElo.style.backgroundImage = `url('${chrome.runtime.getURL('imgs/premiere/0_5.png')}')`;
    premierCurrentElo.style.padding = '0 0 2px 6px';

    const premierCurrentEloLabel = document.createElement('div');
    premierCurrentEloLabel.innerText = 'Current';
    premierCurrentEloLabel.className = 'stats-item-label';

    const premierBestEloContainer = document.createElement('div');
    premierBestEloContainer.className = 'stats-item hidden';
    premierBestEloContainer.dataset.game = 'cs2';

    const premierBestElo = document.createElement('span');
    premierBestElo.innerText = '---';
    premierBestElo.id = 'csstats-stats-premiere-best-elo';
    premierBestElo.className = 'stats-item-value premiere-rank-badge cs-typography';
    premierBestElo.style.backgroundImage = `url('${chrome.runtime.getURL('imgs/premiere/0_5.png')}')`;
    premierBestElo.style.padding = '0 0 2px 6px';

    const premierBestEloLabel = document.createElement('div');
    premierBestEloLabel.innerText = 'Best';
    premierBestEloLabel.className = 'stats-item-label';

    const kdContainer = document.createElement('div');
    kdContainer.className = 'stats-item hidden';
    kdContainer.dataset.game = 'cs2';

    const kd = document.createElement('span');
    kd.innerText = '0.00';
    kd.id = 'csstats-stats-kd';
    kd.className = 'stats-item-value text-csstats-blue';

    const kdLabel = document.createElement('div');
    kdLabel.innerText = 'K/D';
    kdLabel.className = 'stats-item-label';

    const winrateContainer = document.createElement('div');
    winrateContainer.className = 'stats-item hidden';
    winrateContainer.dataset.game = 'cs2';

    const winrate = document.createElement('span');
    winrate.innerText = '00.0 %';
    winrate.id = 'csstats-stats-winrate';
    winrate.className = 'stats-item-value text-csstats-blue';

    const winrateLabel = document.createElement('div');
    winrateLabel.innerText = 'Win rate';
    winrateLabel.className = 'stats-item-label';

    const hsContainer = document.createElement('div');
    hsContainer.className = 'stats-item hidden';
    hsContainer.dataset.game = 'cs2';

    const hs = document.createElement('span');
    hs.innerText = '00.0 %';
    hs.id = 'csstats-stats-hs';
    hs.className = 'stats-item-value text-csstats-blue';

    const hsLabel = document.createElement('div');
    hsLabel.innerText = 'HS%';
    hsLabel.className = 'stats-item-label';

    const adrContainer = document.createElement('div');
    adrContainer.className = 'stats-item hidden';
    adrContainer.dataset.game = 'cs2';

    const adr = document.createElement('span');
    adr.innerText = '00';
    adr.id = 'csstats-stats-adr';
    adr.className = 'stats-item-value text-csstats-blue';

    const adrLabel = document.createElement('div');
    adrLabel.innerText = 'ADR';
    adrLabel.className = 'stats-item-label';

    const matchesContainer = document.createElement('div');
    matchesContainer.className = 'stats-item hidden';
    matchesContainer.dataset.game = 'cs2';

    const matches = document.createElement('span');
    matches.innerText = '0000';
    matches.id = 'csstats-stats-matches';
    matches.className = 'stats-item-value text-csstats-blue';

    const matchesLabel = document.createElement('div');
    matchesLabel.innerText = 'Matches';
    matchesLabel.className = 'stats-item-label';

    const csgoLastEloContainer = document.createElement('div');
    csgoLastEloContainer.className = 'stats-item hidden';
    csgoLastEloContainer.dataset.game = 'csgo';

    const csgoLastElo = document.createElement('span');
    csgoLastElo.id = 'csstats-last-csgo-rank';
    csgoLastElo.className = 'stats-item-value premiere-rank-badge';
    csgoLastElo.style.backgroundImage = `url('${chrome.runtime.getURL('imgs/csgo/1.png')}')`;

    const csgoLastEloLabel = document.createElement('div');
    csgoLastEloLabel.innerText = 'Last';
    csgoLastEloLabel.className = 'stats-item-label';

    const csgoBestEloContainer = document.createElement('div');
    csgoBestEloContainer.className = 'stats-item hidden';
    csgoBestEloContainer.dataset.game = 'csgo';

    const csgoBestElo = document.createElement('span');
    csgoBestElo.id = 'csstats-best-csgo-rank';
    csgoBestElo.className = 'stats-item-value premiere-rank-badge';
    csgoBestElo.style.backgroundImage = `url('${chrome.runtime.getURL('imgs/csgo/1.png')}')`;

    const csgoBestEloLabel = document.createElement('div');
    csgoBestEloLabel.innerText = 'Best';
    csgoBestEloLabel.className = 'stats-item-label';

    const csgoMatchesContainer = document.createElement('div');
    csgoMatchesContainer.className = 'stats-item hidden';
    csgoMatchesContainer.dataset.game = 'csgo';

    const csgoMatches = document.createElement('span');
    csgoMatches.innerText = '0000';
    csgoMatches.id = 'csstats-stats-csgo-matches';
    csgoMatches.className = 'stats-item-value text-csstats-blue';

    const csgoMatchesLabel = document.createElement('div');
    csgoMatchesLabel.innerText = 'CS:GO Wins';
    csgoMatchesLabel.className = 'stats-item-label';

    logoContainer.appendChild(csStatsLogo);
    headerTitle.appendChild(logoContainer);
    headerTitle.appendChild(csStatsLinkTitle);
    headerComplementsContainer.appendChild(csgoButton);
    headerComplementsContainer.appendChild(cs2Button);
    headerComplementsContainer.appendChild(copyToClipboard);
    favoriteGroupContent.appendChild(premierCurrentEloContainer);
    premierCurrentEloContainer.appendChild(premierCurrentElo);
    premierCurrentEloContainer.appendChild(premierCurrentEloLabel);
    favoriteGroupContent.appendChild(premierBestEloContainer);
    premierBestEloContainer.appendChild(premierBestElo);
    premierBestEloContainer.appendChild(premierBestEloLabel);
    favoriteGroupContent.appendChild(kdContainer);
    kdContainer.appendChild(kd);
    kdContainer.appendChild(kdLabel);
    favoriteGroupContent.appendChild(winrateContainer);
    winrateContainer.appendChild(winrate);
    winrateContainer.appendChild(winrateLabel);
    favoriteGroupContent.appendChild(hsContainer);
    hsContainer.appendChild(hs);
    hsContainer.appendChild(hsLabel);
    favoriteGroupContent.appendChild(adrContainer);
    adrContainer.appendChild(adr);
    adrContainer.appendChild(adrLabel);
    favoriteGroupContent.appendChild(matchesContainer);
    matchesContainer.appendChild(matches);
    matchesContainer.appendChild(matchesLabel);
    favoriteGroupContent.appendChild(csgoLastEloContainer);
    csgoLastEloContainer.appendChild(csgoLastElo);
    csgoLastEloContainer.appendChild(csgoLastEloLabel);
    favoriteGroupContent.appendChild(csgoBestEloContainer);
    csgoBestEloContainer.appendChild(csgoBestElo);
    csgoBestEloContainer.appendChild(csgoBestEloLabel);
    favoriteGroupContent.appendChild(csgoMatchesContainer);
    csgoMatchesContainer.appendChild(csgoMatches);
    csgoMatchesContainer.appendChild(csgoMatchesLabel);

    return profileCustomization;
};
