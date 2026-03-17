/// <reference types="chrome"/>

let responseData = null;

let faceitResponseData = null;

let csStatsResponseData = null;

const loadCSRepStats = async () => {
    const userId = getUserId();

    if (!userId) {
        showErrorCSRep('User ID not found');
        return;
    }

    await chrome.runtime.sendMessage(
        { action: 'fetchPlayerData', userId },
        (response) => {
            console.log(response)
            if (!response) {
                showErrorCSRep('Failed to fetch player data');
                return;
            }

            if (response.status === 403) {
                showErrorCSRep('CSRep.gg – Coming soon');
                return;
            }

            if (!response.success) {
                showErrorCSRep('Failed to fetch player data');
                return;
            }

            const isAutoflagged = response.data.player.autoflagger.length > 0;

            if (isAutoflagged) showAutoflagged();

            const hasFaceit = response.data.player.faceitInfo.player_id !== undefined;

            if (hasFaceit) showFaceitFilter();

            displayCSRepStats(response, true);

            responseData = response;
        }
    );
};

const loadCSStatsStats = async () => {
    const userId = getUserId();

    if (!userId) {
        showErrorCSStats('User ID not found');
        return;
    }

    try {
        const baseResponse = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'fetchCSStatsData', userId: userId },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError.message);
                    } else if (response.success) {
                        resolve(response.data);
                    } else {
                        reject(response.error);
                    }
                }
            );
        });

        const cs2StatsResponse = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { action: 'fetchCSStatsData', userId: userId, endpoint: '/stats' },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError.message);
                    } else if (response.success) {
                        resolve(response.data);
                    } else {
                        reject(response.error);
                    }
                }
            );
        });

        csStatsResponseData = {
            base: baseResponse,
            cs2Stats: cs2StatsResponse
        };

        const parsedBase = parseCSStatsBase(baseResponse);
        const parsedCs2 = parseCSStatsCS2(cs2StatsResponse);

        if (!parsedBase?.csgo) document.getElementById('csstats-csgo-button')?.classList.add('disabled');

        displayCSStatsStats({ base: parsedBase, cs2: parsedCs2 });
    } catch (error) {
        console.error('Error fetching CSStats data:', error);
        showErrorCSStats('Failed to fetch CSStats data');
    }
};

const loadFaceitStats = () => {
    return new Promise((resolve) => {
        const userId = getUserId();

        if (!userId) {
            showErrorFaceit('User ID not found');
            resolve();
            return;
        }

        chrome.runtime.sendMessage(
            { action: 'fetchFaceitData', userId },
            (response) => {
                if (!response) {
                    showErrorFaceit('Failed to fetch Faceit data');
                    resolve();
                    return;
                }

                if (response.status === 403) {
                    showErrorFaceit('Faceit data not found');
                    resolve();
                    return;
                }

                if (!response.success) {
                    showErrorFaceit('Failed to fetch player data');
                    resolve();
                    return;
                }

                const isBanned = response.data.bans.items.length > 0;

                if (isBanned) {
                    const banReason = response.data.bans.items[0].reason;

                    showBanned(banReason);
                }

                const hasCsgo = !!response.data.playerData?.games?.csgo;

                if (!hasCsgo)document.getElementById('faceit-csgo-button')?.classList.add('disabled');
                console.log(response)
                displayFaceitStats(response);

                faceitResponseData = response;

                resolve();
            }
        );
    });
};

const loadAccountStats = async () => {
    const userId = getUserId();

    if (!userId) {
        showErrorFaceit('User ID not found');
        return;
    }

    const steamCreationDate = await getSteamCreationDate();
    const faceitCreationDate = formatDate(faceitResponseData.data.playerData.activated_at);

    const data = {
        idleHours: "Coming soon",
        steamCreationDate: steamCreationDate,
        faceitCreationDate: faceitCreationDate,
        dateDifference: getDateDifference(steamCreationDate, faceitCreationDate) + " days"
    }

    displayAccountStats(data);
};

const getUserId = () => {
    const steamIdSpan = document.getElementById('steam-id-hidden');

    if (!steamIdSpan) return null;

    return steamIdSpan.innerText;
};

const getSteamCreationDate = async () => {
    try {
        const userId = getUserId();
        const response = await fetch(`https://steamcommunity.com/profiles/${userId}/badges/1?l=english`);
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const dateElement = doc.querySelector('.badge_description');

        if (!dateElement) return "Unknown";

        const creationText = dateElement.textContent.trim().replace("Member since ", "");
        return formatDate(creationText);
    } catch (error) {
        console.error('Error fetching Steam creation date:', error);
    }

    return "Unknown";
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const getDateDifference = (date1, date2) => {
    const parseDate = (dateStr) => {
        if (!dateStr || dateStr === "Unknown") return null;

        const [day, month, year] = dateStr.split('-');

        if (!day || !month || !year) return null;

        const timestamp = new Date(`${year}-${month}-${day}`).getTime();

        return isNaN(timestamp) ? null : timestamp;
    };

    const date1ms = parseDate(date1);
    const date2ms = parseDate(date2);

    if (date1ms === null || date2ms === null) return "Unknown";

    return Math.floor((date2ms - date1ms) / (1000 * 60 * 60 * 24));
};

const toggleSectionButton = (section, game) => {
    const buttons = {
        csstats: {
            csgo: document.getElementById('csstats-csgo-button'),
            cs2: document.getElementById('csstats-cs2-button')
        },
        faceit: {
            csgo: document.getElementById('faceit-csgo-button'),
            cs2: document.getElementById('faceit-cs2-button')
        }
    };

    const sectionButtons = buttons[section];

    if (!sectionButtons) return;

    Object.keys(sectionButtons).forEach(key => {
        sectionButtons[key]?.classList.remove('selected');
    });

    sectionButtons[game]?.classList.add('selected');

    if (section === 'csstats') {
        const csStatsContainer = document.getElementById('csstats-stats-container');

        if (!csStatsContainer) return;

        const statsItems = csStatsContainer.querySelectorAll('.stats-item');

        statsItems.forEach(item => {
            const itemGame = item.dataset.game;
            if (itemGame === game) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    if (section === 'faceit') {
        if (!faceitResponseData) return;

        const toggleStats = faceitResponseData.data.stats[game];
        const toggleElo = faceitResponseData.data.playerData.games[game]?.faceit_elo;
        const toggleLvl = faceitResponseData.data.playerData.games[game]?.skill_level;

        if (!toggleStats?.lifetime) console.warn(`No hay datos de stats para ${game}`);

        const lvlIcon = document.getElementById('faceit-stats-level-icon');
        const elo = document.getElementById('faceit-stats-elo');
        const kd = document.getElementById('faceit-stats-kd');
        const winrate = document.getElementById('faceit-stats-winrate');
        const hs = document.getElementById('faceit-stats-hs');
        const matches = document.getElementById('faceit-stats-matches');

        const getMatches = () => {
            const cs2Matches = faceitResponseData.data.stats.cs2?.lifetime?.m1 ?? 0;
            const csgoMatches = faceitResponseData.data.stats.csgo?.lifetime?.m1 ?? 0;

            return game === 'cs2' ? cs2Matches - csgoMatches : csgoMatches;
        };

        if (lvlIcon && toggleLvl) lvlIcon.src = chrome.runtime.getURL(`imgs/faceit/lvl${toggleLvl}.svg`);
        if (elo) elo.innerText = toggleElo ?? 'N/A';
        if (kd) kd.innerText = toggleStats?.lifetime?.k5 ?? 'N/A';
        if (winrate) winrate.innerText = `${toggleStats?.lifetime?.k6 ?? 0} %`;
        if (hs) hs.innerText = `${toggleStats?.lifetime?.k8 ?? 0} %`;
        if (matches) matches.innerText = getMatches().toString();
    }
};

const switchFaceitFilter = () => {
    const faceitFilterButton = document.getElementById('faceit-filter-button');
    faceitFilterButton?.classList.toggle('filter-applied');

    displayCSRepStats(responseData, faceitFilterButton?.classList.contains('filter-applied'));
};

const createSectionStructure = () => {
    const profileCustomization = document.createElement('div');
    profileCustomization.className = 'profile_customization';

    const header = document.createElement('div');
    header.className = 'profile_customization_header';

    const headerContent = document.createElement('div');
    headerContent.className = 'profile-customization-header-content';

    const headerTitle = document.createElement('div');
    headerTitle.className = 'profile-customization-header-title';

    const headerComplementsContainer = document.createElement('div');
    headerComplementsContainer.className = 'profile-customization-header-title';

    const favoriteGroup = document.createElement('div');
    favoriteGroup.className = 'favoritegroup_showcase';

    const favoriteGroupContent = document.createElement('div');
    favoriteGroupContent.className = 'showcase_content_bg stats-container';

    header.appendChild(headerContent);
    headerContent.appendChild(headerTitle);
    headerContent.appendChild(headerComplementsContainer);
    favoriteGroup.appendChild(favoriteGroupContent);
    profileCustomization.appendChild(header);
    profileCustomization.appendChild(favoriteGroup);

    return {
        profileCustomization,
        headerTitle,
        headerComplementsContainer,
        favoriteGroupContent
    };
};

const createTemplate = () => {
    const mainContainer = document.createElement('div');
    mainContainer.id = 'cs-rep-main-container';

    const csRepSection = createCSRepSection();

    const csStatsSection = createCSStatsSection();

    const faceitSection = createFaceitSection();

    const accountStatsSeccion = createAccountStatsSection();

    mainContainer.appendChild(csRepSection);
    mainContainer.appendChild(csStatsSection);
    mainContainer.appendChild(faceitSection);
    mainContainer.appendChild(accountStatsSeccion);

    return mainContainer;
};

const setEventListeners = () => {
    const copyCSRepToClipboardDiv = document.getElementById('copy-cs-rep-stats-to-clipboard');
    copyCSRepToClipboardDiv?.addEventListener('click', () => copyCSRepStatsToClipboard());

    const copyCSStatsToClipboardDiv = document.getElementById('copy-csstats-stats-to-clipboard');
    copyCSStatsToClipboardDiv?.addEventListener('click', () => copyCSStatsStatsToClipboard());

    const copyFaceitToClipboardDiv = document.getElementById('copy-faceit-stats-to-clipboard');
    copyFaceitToClipboardDiv?.addEventListener('click', () => copyFaceitStatsToClipboard());

    const userId = getUserId();

    const csRepLinkTitle = document.getElementById('cs-rep-link-title');
    csRepLinkTitle?.addEventListener('click', () => window.open(`https://csrep.gg/player/${userId}`, '_blank'));

    const csStatsLinkTitle = document.getElementById('cs-stats-link-title');
    csStatsLinkTitle?.addEventListener('click', () => window.open(`https://csstats.gg/player/${userId}`, '_blank'));

    const faceitLinkTitle = document.getElementById('faceit-link-title');
    faceitLinkTitle?.addEventListener('click', () => window.open(`https://www.faceit.com/es/players/${faceitResponseData.data.playerData.nickname}`, '_blank'));

    const faceitFilterButton = document.getElementById('faceit-filter-button');
    faceitFilterButton?.addEventListener('click', () => switchFaceitFilter());

    const csstatsCsgoButton = document.getElementById('csstats-csgo-button');
    csstatsCsgoButton?.addEventListener('click', () => toggleSectionButton("csstats", "csgo"));

    const csstatsCs2Button = document.getElementById('csstats-cs2-button');
    csstatsCs2Button?.addEventListener('click', () => toggleSectionButton("csstats", "cs2"));

    const faceitCsgoButton = document.getElementById('faceit-csgo-button');
    faceitCsgoButton?.addEventListener('click', () => toggleSectionButton("faceit", "csgo"));

    const faceitCs2Button = document.getElementById('faceit-cs2-button');
    faceitCs2Button?.addEventListener('click', () => toggleSectionButton("faceit", "cs2"));
};

(async () => {
    if (!/^https:\/\/steamcommunity\.com\/(id|profiles)\/[^/]+\/?$/.test(window.location.href)) return;

    setTimeout(async () => {
        const template = createTemplate();

        const profileCustomizationArea = document.querySelector('.profile_customization_area');
        const profileLeftcol = document.querySelector('.profile_leftcol');

        if (profileCustomizationArea) profileCustomizationArea.insertBefore(template, profileCustomizationArea.firstChild);
        if (!profileCustomizationArea && profileLeftcol) profileLeftcol.insertBefore(template, profileLeftcol.firstChild);

        toggleSectionButton("csstats", "cs2");
        toggleSectionButton("faceit", "cs2");

        setEventListeners();

        await Promise.all([
            loadCSRepStats(),
            loadFaceitStats(),
            loadCSStatsStats()
        ]);

        await loadAccountStats();
    }, 50);
})();