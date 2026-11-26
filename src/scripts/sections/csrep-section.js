const createCSRepSection = (steamId) => {
    const { profileCustomization, headerTitle, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = CONSTANTS.CONTAINER_IDS.CSREP;

    const csRepLogo = document.createElement('img');
    csRepLogo.src = chrome.runtime.getURL('imgs/logos/csrep-logo.png');
    csRepLogo.className = 'cs-rep-logo';
    csRepLogo.alt = 'CSRep Logo';

    const csRepLinkTitle = CONSTANTS.createLinkTitle('CSREP.GG', 'cs-rep-link-title', `https://csrep.gg/player/${steamId}`);

    headerTitle.appendChild(csRepLogo);
    headerTitle.appendChild(csRepLinkTitle);

    return profileCustomization;
};
