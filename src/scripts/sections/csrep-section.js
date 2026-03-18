const createCSRepSection = () => {
    const { profileCustomization, headerTitle, favoriteGroupContent } = createSectionStructure();

    favoriteGroupContent.id = CONSTANTS.CONTAINER_IDS.CSREP;

    const csRepLogo = document.createElement('img');
    csRepLogo.src = chrome.runtime.getURL('imgs/logos/csrep-logo.png');
    csRepLogo.className = 'cs-rep-logo';
    csRepLogo.alt = 'CSRep Logo';

    const csRepLinkTitle = document.createElement('a');
    csRepLinkTitle.target = '_blank';
    csRepLinkTitle.innerText = 'CSREP.GG';
    csRepLinkTitle.className = 'link-title';
    csRepLinkTitle.id = 'cs-rep-link-title';

    headerTitle.appendChild(csRepLogo);
    headerTitle.appendChild(csRepLinkTitle);

    return profileCustomization;
};
