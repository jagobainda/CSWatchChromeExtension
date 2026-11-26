const createAccountStatsSection = () => {
    const { profileCustomization, headerTitle, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = 'account-stats-container';

    const accountStatsLinkTitle = CONSTANTS.createLinkTitle('ACCOUNT STATS', 'account-stats-link-title', 'https://chromewebstore.google.com/detail/cswatch-stats-viewer/nklafihgaifhoahbfcfiaemfmpoplkch');

    headerTitle.appendChild(accountStatsLinkTitle);

    const statItems = [
        CONSTANTS.createStatItem({ id: 'account-stats-idle-hours',          label: 'Estimated IDLE hours',  containerTitle: 'Estimation of IDLE hours or hours spent outside official/Faceit servers. Since it is an estimate, it may have a certain margin of error' }),
        CONSTANTS.createStatItem({ id: 'account-stats-steam-creation',      label: 'Steam creation',        valueClasses: 'text-csstats-blue' }),
        CONSTANTS.createStatItem({ id: 'account-stats-faceit-creation',     label: 'Faceit creation',       valueClasses: 'text-faceit-orange' }),
        CONSTANTS.createStatItem({ id: 'account-stats-creation-difference', label: 'Creation difference' }),
    ];

    statItems.forEach(item => favoriteGroupContent.appendChild(item));

    return profileCustomization;
};