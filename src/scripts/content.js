/// <reference types="chrome"/>

let responseData = null;

const loadUserStats = async () => {
    const userId = getUserId();

    if (!userId) {
        showError('User ID not found');
        return;
    }

    await chrome.runtime.sendMessage(
        { action: 'fetchPlayerData', userId },
        (response) => {
            if (!response || !response.success) {
                showError('Failed to fetch player data');
                return;
            }

            const isAutoflagged = response.data.player.autoflagger.length > 0;

            if (isAutoflagged) showAutoflagged();

            const hasFaceit = response.data.player.faceitInfo.player_id !== undefined;

            if (hasFaceit) showFaceitFilter();

            displayStats(response, true);

            responseData = response;
        }
    );
}

const getUserId = () => {
    const steamIdSpan = document.getElementById('steam-id-hidden');

    if (!steamIdSpan) return null;

    return steamIdSpan.innerText;
}

const showAutoflagged = () => {
    const container = document.getElementById('is-autoflagged');

    container.style.display = 'block';
}

const showFaceitFilter = () => {
    const container = document.getElementById('faceit-filter-button');

    container.style.display = 'block';
}

const displayStats = (responseObject, faceitAdjustment) => {
    if (!responseObject) {
        showError('Failed to fetch player data');
        return;
    }

    const data = responseObject.data.csWatchAnalysis.breakdown;

    if (data.length < 1) {
        showError(responseObject.data.csWatchAnalysis.message);
        return;
    }

    const totalScore = responseObject.data.csWatchAnalysis.totalScore
    const unadjustedScore = responseObject.data.csWatchAnalysis.unadjustedScore
    const version = responseObject.data.csWatchAnalysis.version
    const faceitAdjustmentValue = responseObject.data.csWatchAnalysis.faceitAdjustment

    const kdRatio = document.getElementById('cs-watch-stats-kd-ratio');
    const timeToDamage = document.getElementById('cs-watch-stats-time-to-damage');
    const preaimDegree = document.getElementById('cs-watch-stats-preaim-degree');
    const aimRating = document.getElementById('cs-watch-stats-aim-rating');
    const winRate = document.getElementById('cs-watch-stats-win-rate');
    const riskRate = document.getElementById('cs-watch-stats-risk-rate');
    const analysisVersion = document.getElementById('analysis-version');

    if (!kdRatio || !timeToDamage || !preaimDegree || !aimRating || !winRate || !riskRate || !analysisVersion) {
        showError('Failed to fetch player data');
        return;
    }

    const kdRatioObject = data.find(item => item.type === 'kd');
    const timeToDamageObject = data.find(item => item.type === 'reaction');
    const preaimDegreeObject = data.find(item => item.type === 'preaim');
    const aimRatingObject = data.find(item => item.type === 'aim');
    const winRateObject = data.find(item => item.type === 'winrate');

    kdRatio.innerText = kdRatioObject.value;
    timeToDamage.innerText = timeToDamageObject.value + " ms";
    preaimDegree.innerText = preaimDegreeObject.value + "º";
    aimRating.innerText = aimRatingObject.value + " %";
    winRate.innerText = winRateObject.value + " %";
    riskRate.innerText = (faceitAdjustment ? totalScore : unadjustedScore) + " %";
    analysisVersion.innerText = "v" + version;

    const metrics = {
        kdRatio,
        timeToDamage,
        preaimDegree,
        aimRating,
        winRate
    };

    const scores = {
        kdRatio: kdRatioObject,
        timeToDamage: timeToDamageObject,
        preaimDegree: preaimDegreeObject,
        aimRating: aimRatingObject,
        winRate: winRateObject
    };

    const colorClasses = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500"];

    Object.keys(metrics).forEach(key => {
        const el = metrics[key];
        const scoreObj = scores[key];

        el.classList.remove(...colorClasses);

        const message = getV11MetricMessage(scoreObj.score, faceitAdjustment, faceitAdjustmentValue);

        el.classList.add(message.color);
        el.title = message.text;
    });

    riskRate.classList.add(getV11RiskLevel(faceitAdjustment ? totalScore : unadjustedScore).color);
    riskRate.title = getV11RiskLevel(faceitAdjustment ? totalScore : unadjustedScore).text;
}

const switchFaceitFilter = () => {
    const faceitFilterButton = document.getElementById('faceit-filter-button');
    faceitFilterButton?.classList.toggle('filter-applied');

    displayStats(responseData, faceitFilterButton?.classList.contains('filter-applied'));
};

const createColorScheme = (baseColor) => ({
    color: `text-${baseColor}-500`,
    bgColor: `bg-${baseColor}-500/20`,
    borderColor: `border-${baseColor}-500`
});

const getV11RiskLevel = (score, applyFaceit, faceitAdjustmentValue) => {
    score = Math.min(score, 100);
    if (applyFaceit) score += faceitAdjustmentValue;
    if (score >= 98) return { text: "Extremely High Risk", ...createColorScheme("red") };
    if (score >= 90) return { text: "Very High Risk", ...createColorScheme("red") };
    if (score >= 75) return { text: "High Risk", ...createColorScheme("orange") };
    if (score >= 50) return { text: "Medium Risk", ...createColorScheme("orange") };
    if (score >= 25) return { text: "Low Risk", ...createColorScheme("yellow") };
    return { text: "Very Low Risk", ...createColorScheme("green") };
};

const getV11MetricMessage = (score, applyFaceit, faceitAdjustmentValue) => {
    score = Math.min(score, 100);
    if (applyFaceit) score += faceitAdjustmentValue;
    if (score >= 100) return { text: "Extremely Suspicious", color: "text-red-500" };
    if (score >= 80) return { text: "Highly Suspicious", color: "text-red-500" };
    if (score >= 60) return { text: "Suspicious", color: "text-orange-500" };
    if (score >= 50) return { text: "Little Suspicious", color: "text-yellow-500" };
    return { text: "Normal", color: "text-green-500" };
};

const showError = (message) => {
    const container = document.getElementById('cs-watch-stats-container');

    if (!container) return;

    const error = document.createElement('p');

    error.innerText = message;

    container.innerHTML = '';
    container.appendChild(error);
}

const copyStatsToClipboard = async () => {
    const kdRatio = document.getElementById('cs-watch-stats-kd-ratio');
    const timeToDamage = document.getElementById('cs-watch-stats-time-to-damage');
    const preaimDegree = document.getElementById('cs-watch-stats-preaim-degree');
    const aimRating = document.getElementById('cs-watch-stats-aim-rating');
    const winRate = document.getElementById('cs-watch-stats-win-rate');
    const riskRate = document.getElementById('cs-watch-stats-risk-rate');

    const userNickname = document.querySelector('.actual_persona_name');

    if (!kdRatio || !timeToDamage || !preaimDegree || !aimRating || !winRate || !riskRate) return

    const stats = `Nickname: ${userNickname.innerText} | K/D: ${kdRatio.innerText} | TTD: ${timeToDamage.innerText} | Preaim: ${preaimDegree.innerText} | Aim Rating: ${aimRating.innerText} | Win rate: ${winRate.innerText} | Risk rate: ${riskRate.innerText}`;

    await navigator.clipboard.writeText(stats);
}

const createTemplate = () => {
    const container = document.createElement('div');
    container.id = 'cs-watch-container';

    const profileCustomization = document.createElement('div');
    profileCustomization.className = 'profile_customization';

    const header = document.createElement('div');
    header.className = 'profile_customization_header';
    header.style.padding = '5px';
    header.style.setProperty('padding', '5px', 'important');

    const headerContent = document.createElement('div');
    headerContent.className = 'profile-customization-header-content';

    const headerTitle = document.createElement('div');
    headerTitle.className = 'profile-customization-header-title';

    const csWatchLogo = document.createElement('img');
    csWatchLogo.src = chrome.runtime.getURL('imgs/logo48.png');
    csWatchLogo.className = 'cs-watch-logo';
    csWatchLogo.alt = 'CSWatch Logo';

    const csWatchLinkTitle = document.createElement('a');
    csWatchLinkTitle.target = '_blank';
    csWatchLinkTitle.innerText = 'CSWATCH.IN';
    csWatchLinkTitle.className = 'cs-watch-link-title';
    csWatchLinkTitle.id = 'cs-watch-link-title';

    const headerComplementsContainer = document.createElement('div');
    headerComplementsContainer.className = 'profile-customization-header-title';

    const isAutoflagged = document.createElement('div');
    isAutoflagged.innerText = 'Autoflagged';
    isAutoflagged.className = 'is-autoflagged';
    isAutoflagged.id = 'is-autoflagged';

    const analysisVersion = document.createElement('span');
    analysisVersion.className = 'analysis-version';
    analysisVersion.id = 'analysis-version';
    analysisVersion.innerText = 'v0.0';
    analysisVersion.title = 'CSWatch Analysis Version';

    const copyToClipboard = document.createElement('div');
    copyToClipboard.innerText = 'Copy stats to clipboard';
    copyToClipboard.className = 'copy-cs-watch-stats-to-clipboard';
    copyToClipboard.id = 'copy-cs-watch-stats-to-clipboard';

    const favoriteGroup = document.createElement('div');
    favoriteGroup.className = 'favoritegroup_showcase';

    const favoriteGroupContent = document.createElement('div');
    favoriteGroupContent.className = 'showcase_content_bg cs-watch-stats-container';
    favoriteGroupContent.id = 'cs-watch-stats-container';

    const kdRatioContainer = document.createElement('div');
    kdRatioContainer.className = 'cs-watch-stats-item';

    const kdRatio = document.createElement('span');
    kdRatio.innerText = '0.00';
    kdRatio.id = 'cs-watch-stats-kd-ratio';
    kdRatio.className = 'cs-watch-stats-item-value';

    const kdRatioLabel = document.createElement('div');
    kdRatioLabel.innerText = 'K/D Ratio';
    kdRatioLabel.className = 'cs-watch-stats-item-label';

    const timeToDamageContainer = document.createElement('div');
    timeToDamageContainer.className = 'cs-watch-stats-item';

    const timeToDamage = document.createElement('span');
    timeToDamage.innerText = '000.0 ms';
    timeToDamage.id = 'cs-watch-stats-time-to-damage';
    timeToDamage.className = 'cs-watch-stats-item-value';

    const timeToDamageLabel = document.createElement('div');
    timeToDamageLabel.innerText = 'T to damage';
    timeToDamageLabel.className = 'cs-watch-stats-item-label';

    const preaimDegreeContainer = document.createElement('div');
    preaimDegreeContainer.className = 'cs-watch-stats-item';

    const preaimDegree = document.createElement('span');
    preaimDegree.innerText = '0.0º';
    preaimDegree.id = 'cs-watch-stats-preaim-degree';
    preaimDegree.className = 'cs-watch-stats-item-value';

    const preaimDegreeLabel = document.createElement('div');
    preaimDegreeLabel.innerText = 'Preaim Degree';
    preaimDegreeLabel.className = 'cs-watch-stats-item-label';

    const aimRatingContainer = document.createElement('div');
    aimRatingContainer.className = 'cs-watch-stats-item';

    const aimRating = document.createElement('span');
    aimRating.innerText = '000.0 %';
    aimRating.id = 'cs-watch-stats-aim-rating';
    aimRating.className = 'cs-watch-stats-item-value';

    const aimRatingLabel = document.createElement('div');
    aimRatingLabel.innerText = 'Aim Rating';
    aimRatingLabel.className = 'cs-watch-stats-item-label';

    const winRateContainer = document.createElement('div');
    winRateContainer.className = 'cs-watch-stats-item';

    const winRate = document.createElement('span');
    winRate.innerText = '000.0 %';
    winRate.id = 'cs-watch-stats-win-rate';
    winRate.className = 'cs-watch-stats-item-value';

    const winRateLabel = document.createElement('div');
    winRateLabel.innerText = 'Win rate';
    winRateLabel.className = 'cs-watch-stats-item-label';

    const riskRateContainer = document.createElement('div');
    riskRateContainer.className = 'cs-watch-stats-item';

    const riskRate = document.createElement('span');
    riskRate.innerText = '0 %';
    riskRate.id = 'cs-watch-stats-risk-rate';
    riskRate.className = 'cs-watch-stats-item-value';

    const riskRateLabel = document.createElement('div');
    riskRateLabel.innerText = 'Risk rate';
    riskRateLabel.className = 'cs-watch-stats-item-label';

    const faceitFilterButton = document.createElement('button');
    faceitFilterButton.innerText = 'FACEIT';
    faceitFilterButton.className = 'faceit-filter-button filter-applied';
    faceitFilterButton.id = 'faceit-filter-button';

    profileCustomization.appendChild(header);

    header.appendChild(headerContent);
    headerContent.appendChild(headerTitle);
    headerTitle.appendChild(csWatchLogo);
    headerTitle.appendChild(csWatchLinkTitle);
    headerTitle.appendChild(isAutoflagged);
    headerContent.appendChild(headerComplementsContainer);
    headerComplementsContainer.appendChild(analysisVersion);
    headerComplementsContainer.appendChild(copyToClipboard);

    profileCustomization.appendChild(favoriteGroup);

    favoriteGroup.appendChild(favoriteGroupContent);

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

    container.appendChild(profileCustomization);

    return container;
}

const setEventListeners = () => {
    const copyToClipboardDiv = document.getElementById('copy-cs-watch-stats-to-clipboard');
    copyToClipboardDiv?.addEventListener('click', () => copyStatsToClipboard());

    const csWatchLinkTitle = document.getElementById('cs-watch-link-title');
    const userId = getUserId();
    csWatchLinkTitle?.addEventListener('click', () => window.open(`https://cswatch.in/player/${userId}`, '_blank'));

    const faceitFilterButton = document.getElementById('faceit-filter-button');
    faceitFilterButton?.addEventListener('click', () => switchFaceitFilter());
}

(async () => {
    const template = createTemplate();

    const profileCustomizationArea = document.querySelector('.profile_customization_area');
    const profileLeftcol = document.querySelector('.profile_leftcol');

    setTimeout(() => {
        if (profileCustomizationArea) profileCustomizationArea.insertBefore(template, profileCustomizationArea.firstChild);
        if (!profileCustomizationArea && profileLeftcol) profileLeftcol.insertBefore(template, profileLeftcol.firstChild);

        setEventListeners();
        loadUserStats();
    }, 50);
})();