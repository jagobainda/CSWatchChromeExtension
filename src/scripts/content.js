/// <reference types="chrome"/>

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

function setEventListeners() {
    const copyToClipboardDiv = document.getElementById('copy-cs-watch-stats-to-clipboard');
    copyToClipboardDiv?.addEventListener('click', () => copyStatsToClipboard());


}

async function loadUserStats() {
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

            displayStats(response.data.csWatchAnalysis.breakdown, response.data.csWatchAnalysis.totalScore)
        }
    );
}

function getUserId() {
    const steamIdSpan = document.getElementById('steam-id-hidden');

    if (!steamIdSpan) return null;

    return steamIdSpan.innerText;
}

function showAutoflagged() {
    const container = document.getElementById('is-autoflagged');

    container.style.display = 'block';
}

function displayStats(data, totalScore) {
    const kdRatio = document.getElementById('cs-watch-stats-kd-ratio');
    const timeToDamage = document.getElementById('cs-watch-stats-time-to-damage');
    const preaimDegree = document.getElementById('cs-watch-stats-preaim-degree');
    const aimRating = document.getElementById('cs-watch-stats-aim-rating');
    const winRate = document.getElementById('cs-watch-stats-win-rate');
    const riskRate = document.getElementById('cs-watch-stats-risk-rate');

    if (!kdRatio || !timeToDamage || !preaimDegree || !aimRating || !winRate || !riskRate) return

    kdRatio.innerText = data.find(item => item.type === 'kd').value;
    timeToDamage.innerText = data.find(item => item.type === 'reaction').value + " ms";
    preaimDegree.innerText = data.find(item => item.type === 'preaim').value + "º";
    aimRating.innerText = data.find(item => item.type === 'aim').value + " %";
    winRate.innerText = data.find(item => item.type === 'winrate').value + " %";
    riskRate.innerText = totalScore + " %";
}

function showError(message) {
    const container = document.getElementById('cs-watch-stats-container');

    if (!container) return;

    const error = document.createElement('p');

    error.innerText = message;

    container.innerHTML = '';
    container.appendChild(error);
}

async function copyStatsToClipboard() {
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

function createTemplate() {
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
    csWatchLinkTitle.href = 'https://github.com/jagobainda/CSWatchChromeExtension';
    csWatchLinkTitle.target = '_blank';
    csWatchLinkTitle.innerText = 'CSWATCH.IN';
    csWatchLinkTitle.className = 'cs-watch-link-title';

    const isAutoflagged = document.createElement('div');
    isAutoflagged.innerText = 'Autoflagged';
    isAutoflagged.className = 'is-autoflagged';
    isAutoflagged.id = 'is-autoflagged';

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

    profileCustomization.appendChild(header);

    header.appendChild(headerContent);
    headerContent.appendChild(headerTitle);
    headerTitle.appendChild(csWatchLogo);
    headerTitle.appendChild(csWatchLinkTitle);
    headerTitle.appendChild(isAutoflagged);
    headerContent.appendChild(copyToClipboard);

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

    container.appendChild(profileCustomization);

    return container;
}
