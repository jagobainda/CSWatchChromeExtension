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

    const statItems = [
        CONSTANTS.createStatItem({ id: 'account-stats-idle-hours',          initialValue: '000 (00%)',  label: 'Estimated IDLE hours',  containerTitle: 'Estimation of IDLE hours or hours spent outside official/Faceit servers. Since it is an estimate, it may have a certain margin of error' }),
        CONSTANTS.createStatItem({ id: 'account-stats-steam-creation',      initialValue: '00-00-0000', label: 'Steam creation',        valueClasses: 'text-csstats-blue' }),
        CONSTANTS.createStatItem({ id: 'account-stats-faceit-creation',     initialValue: '00-00-0000', label: 'Faceit creation',       valueClasses: 'text-faceit-orange' }),
        CONSTANTS.createStatItem({ id: 'account-stats-creation-difference', initialValue: '000 days',   label: 'Creation difference' }),
    ];

    statItems.forEach(item => favoriteGroupContent.appendChild(item));

    return profileCustomization;
};