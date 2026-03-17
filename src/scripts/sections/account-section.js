const createAccountStatsSection = () => {
    const { profileCustomization, headerTitle, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = 'account-stats-container';

    const accountStatsLinkTitle = document.createElement('a');
    accountStatsLinkTitle.innerText = 'ACCOUNT STATS';
    accountStatsLinkTitle.className = 'link-title';
    accountStatsLinkTitle.id = 'account-stats-link-title';
    accountStatsLinkTitle.href = 'https://chromewebstore.google.com/detail/cswatch-stats-viewer/nklafihgaifhoahbfcfiaemfmpoplkch';
    accountStatsLinkTitle.target = '_blank';

    headerTitle.appendChild(accountStatsLinkTitle);

    const idleHoursContainer = document.createElement('div');
    idleHoursContainer.className = 'stats-item';
    idleHoursContainer.title = 'Estimation of IDLE hours or hours spent outside official/Faceit servers. Since it is an estimate, it may have a certain margin of error';

    const idleHours = document.createElement('span');
    idleHours.innerText = '000 (00%)';
    idleHours.id = 'account-stats-idle-hours';
    idleHours.className = 'stats-item-value';

    const idleHoursLabel = document.createElement('div');
    idleHoursLabel.innerText = 'Estimated IDLE hours';
    idleHoursLabel.className = 'stats-item-label';

    const steamCreationContainer = document.createElement('div');
    steamCreationContainer.className = 'stats-item';

    const steamCreation = document.createElement('span');
    steamCreation.innerText = '00-00-0000';
    steamCreation.id = 'account-stats-steam-creation';
    steamCreation.className = 'stats-item-value text-csstats-blue';

    const steamCreationLabel = document.createElement('div');
    steamCreationLabel.innerText = 'Steam creation';
    steamCreationLabel.className = 'stats-item-label';

    const faceitCreationContainer = document.createElement('div');
    faceitCreationContainer.className = 'stats-item';

    const faceitCreation = document.createElement('span');
    faceitCreation.innerText = '00-00-0000';
    faceitCreation.id = 'account-stats-faceit-creation';
    faceitCreation.className = 'stats-item-value text-faceit-orange';

    const faceitCreationLabel = document.createElement('div');
    faceitCreationLabel.innerText = 'Faceit creation';
    faceitCreationLabel.className = 'stats-item-label';

    const creationDifferenceContainer = document.createElement('div');
    creationDifferenceContainer.className = 'stats-item';

    const creationDifference = document.createElement('span');
    creationDifference.innerText = '000 days';
    creationDifference.id = 'account-stats-creation-difference';
    creationDifference.className = 'stats-item-value';

    const creationDifferenceLabel = document.createElement('div');
    creationDifferenceLabel.innerText = 'Creation difference';
    creationDifferenceLabel.className = 'stats-item-label';

    favoriteGroupContent.appendChild(idleHoursContainer);
    idleHoursContainer.appendChild(idleHours);
    idleHoursContainer.appendChild(idleHoursLabel);

    favoriteGroupContent.appendChild(steamCreationContainer);
    steamCreationContainer.appendChild(steamCreation);
    steamCreationContainer.appendChild(steamCreationLabel);

    favoriteGroupContent.appendChild(faceitCreationContainer);
    faceitCreationContainer.appendChild(faceitCreation);
    faceitCreationContainer.appendChild(faceitCreationLabel);

    favoriteGroupContent.appendChild(creationDifferenceContainer);
    creationDifferenceContainer.appendChild(creationDifference);
    creationDifferenceContainer.appendChild(creationDifferenceLabel);

    return profileCustomization;
};