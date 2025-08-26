/// <reference types="chrome"/>

(async () => {
    const template = createTemplate();

    const profileCustomizationArea = document.querySelector('.profile_customization_area');

    setTimeout(() => {
        if (profileCustomizationArea) profileCustomizationArea.insertBefore(template, profileCustomizationArea.firstChild);
        setEventListeners();
    }, 50);
})();

function setEventListeners() {
    const copyToClipboardDiv = document.getElementById('copy-cs-watch-stats-to-clipboard');
    copyToClipboardDiv?.addEventListener('click', () => copyStatsToClipboard());
}

async function copyStatsToClipboard() {
    console.log('Copying stats to clipboard...');
    await navigator.clipboard.writeText("Hello, world!");
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
    csWatchLinkTitle.href = 'https://github.com/Jagoba/CSWatch';
    csWatchLinkTitle.target = '_blank';
    csWatchLinkTitle.innerText = 'CSWATCH.IN';
    csWatchLinkTitle.className = 'cs-watch-link-title';

    const copyToClipboard = document.createElement('div');
    copyToClipboard.innerText = 'Copy stats to clipboard';
    copyToClipboard.className = 'copy-cs-watch-stats-to-clipboard';
    copyToClipboard.id = 'copy-cs-watch-stats-to-clipboard';

    const favoriteGroup = document.createElement('div');
    favoriteGroup.className = 'favoritegroup_showcase';

    profileCustomization.appendChild(header);

    header.appendChild(headerContent);
    headerContent.appendChild(headerTitle);
    headerTitle.appendChild(csWatchLogo);
    headerTitle.appendChild(csWatchLinkTitle);
    headerContent.appendChild(copyToClipboard);

    profileCustomization.appendChild(favoriteGroup);
    container.appendChild(profileCustomization);

    return container;
}
