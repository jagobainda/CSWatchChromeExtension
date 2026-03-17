const createCSRepSection = () => {
    const { profileCustomization, headerTitle, headerComplementsContainer, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = 'cs-rep-stats-container';

    const csRepLogo = document.createElement('img');
    csRepLogo.src = chrome.runtime.getURL('imgs/logos/csrep-logo.png');
    csRepLogo.className = 'cs-rep-logo';
    csRepLogo.alt = 'CSRep Logo';

    const csRepLinkTitle = document.createElement('a');
    csRepLinkTitle.target = '_blank';
    csRepLinkTitle.innerText = 'CSREP.GG';
    csRepLinkTitle.className = 'link-title';
    csRepLinkTitle.id = 'cs-rep-link-title';

    const isAutoflagged = document.createElement('div');
    isAutoflagged.innerText = 'Autoflagged';
    isAutoflagged.className = 'is-autoflagged';
    isAutoflagged.id = 'is-autoflagged';

    const analysisVersion = document.createElement('span');
    analysisVersion.className = 'analysis-version';
    analysisVersion.id = 'analysis-version';
    analysisVersion.innerText = 'v0.0';
    analysisVersion.title = 'CSRep Analysis Version';

    const copyToClipboard = document.createElement('div');
    copyToClipboard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>';
    copyToClipboard.className = 'header-button';
    copyToClipboard.id = 'copy-cs-rep-stats-to-clipboard';

    const kdRatioContainer = document.createElement('div');
    kdRatioContainer.className = 'stats-item';

    const kdRatio = document.createElement('span');
    kdRatio.innerText = '0.00';
    kdRatio.id = 'cs-rep-stats-kd-ratio';
    kdRatio.className = 'stats-item-value';

    const kdRatioLabel = document.createElement('div');
    kdRatioLabel.innerText = 'K/D Ratio';
    kdRatioLabel.className = 'stats-item-label';

    const timeToDamageContainer = document.createElement('div');
    timeToDamageContainer.className = 'stats-item';

    const timeToDamage = document.createElement('span');
    timeToDamage.innerText = '000.0 ms';
    timeToDamage.id = 'cs-rep-stats-time-to-damage';
    timeToDamage.className = 'stats-item-value';

    const timeToDamageLabel = document.createElement('div');
    timeToDamageLabel.innerText = 'T to damage';
    timeToDamageLabel.className = 'stats-item-label';

    const preaimDegreeContainer = document.createElement('div');
    preaimDegreeContainer.className = 'stats-item';

    const preaimDegree = document.createElement('span');
    preaimDegree.innerText = '0.0º';
    preaimDegree.id = 'cs-rep-stats-preaim-degree';
    preaimDegree.className = 'stats-item-value';

    const preaimDegreeLabel = document.createElement('div');
    preaimDegreeLabel.innerText = 'Preaim Degree';
    preaimDegreeLabel.className = 'stats-item-label';

    const aimRatingContainer = document.createElement('div');
    aimRatingContainer.className = 'stats-item';

    const aimRating = document.createElement('span');
    aimRating.innerText = '000.0 %';
    aimRating.id = 'cs-rep-stats-aim-rating';
    aimRating.className = 'stats-item-value';

    const aimRatingLabel = document.createElement('div');
    aimRatingLabel.innerText = 'Aim Rating';
    aimRatingLabel.className = 'stats-item-label';

    const winRateContainer = document.createElement('div');
    winRateContainer.className = 'stats-item';

    const winRate = document.createElement('span');
    winRate.innerText = '000.0 %';
    winRate.id = 'cs-rep-stats-win-rate';
    winRate.className = 'stats-item-value';

    const winRateLabel = document.createElement('div');
    winRateLabel.innerText = 'Win rate';
    winRateLabel.className = 'stats-item-label';

    const riskRateContainer = document.createElement('div');
    riskRateContainer.className = 'stats-item';

    const riskRate = document.createElement('span');
    riskRate.innerText = '0 %';
    riskRate.id = 'cs-rep-stats-risk-rate';
    riskRate.className = 'stats-item-value';

    const riskRateLabel = document.createElement('div');
    riskRateLabel.innerText = 'Risk rate';
    riskRateLabel.className = 'stats-item-label';

    const faceitFilterButton = document.createElement('button');
    faceitFilterButton.innerText = 'FACEIT';
    faceitFilterButton.className = 'faceit-filter-button filter-applied';
    faceitFilterButton.id = 'faceit-filter-button';

    headerTitle.appendChild(csRepLogo);
    headerTitle.appendChild(csRepLinkTitle);
    headerTitle.appendChild(isAutoflagged);
    headerComplementsContainer.appendChild(analysisVersion);
    headerComplementsContainer.appendChild(copyToClipboard);
    favoriteGroupContent.appendChild(kdRatioContainer);
    kdRatioContainer.appendChild(kdRatio);
    kdRatioContainer.appendChild(kdRatioLabel);
    favoriteGroupContent.appendChild(timeToDamageContainer);
    timeToDamageContainer.appendChild(timeToDamage);
    timeToDamageContainer.appendChild(timeToDamageLabel);
    favoriteGroupContent.appendChild(preaimDegreeContainer);
    preaimDegreeContainer.appendChild(preaimDegree);
    preaimDegreeContainer.appendChild(preaimDegreeLabel);
    favoriteGroupContent.appendChild(aimRatingContainer);
    aimRatingContainer.appendChild(aimRating);
    aimRatingContainer.appendChild(aimRatingLabel);
    favoriteGroupContent.appendChild(winRateContainer);
    winRateContainer.appendChild(winRate);
    winRateContainer.appendChild(winRateLabel);
    favoriteGroupContent.appendChild(riskRateContainer);
    riskRateContainer.appendChild(riskRate);
    riskRateContainer.appendChild(riskRateLabel);
    favoriteGroupContent.appendChild(faceitFilterButton);

    return profileCustomization;
};
