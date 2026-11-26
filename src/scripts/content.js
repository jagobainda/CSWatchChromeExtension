const loadCSStatsStats = async (steamId) => {
    try {
        const data = await request('csstats', steamId);

        if (!data.csgo) document.getElementById('csstats-csgo-button')?.classList.add('disabled');

        displayCSStatsStats(data);
    } catch (error) {
        showErrorCSStats(error.message === 'not_found' ? 'No data' : 'Failed to fetch CSStats data');
    }
};

const loadFaceitStats = async (faceitRequest) => {
    try {
        const data = await faceitRequest;

        if (data.bans?.items?.length > 0) showBanned(data.bans.items[0].reason);

        if (!data.playerData?.games?.csgo) document.getElementById('faceit-csgo-button')?.classList.add('disabled');

        displayFaceitStats(data);
        setFaceitEventListeners(data);
    } catch (error) {
        showErrorFaceit(error.message === 'blocked' ? 'Faceit data not found' : 'Failed to fetch player data');
    }
};

const loadAccountStats = async (steamRequest, faceitRequest) => {
    const [steam, faceit] = await Promise.allSettled([steamRequest, faceitRequest]);

    displayAccountStats({
        steamCreation: steam.value?.memberSince ?? null,
        faceitCreation: Date.parse(faceit.value?.playerData?.activated_at) || null
    });
};

const getSteamId = () => {
    const steamId = [...document.scripts]
        .map(script => script.textContent.match(/g_rgProfileData\s*=\s*\{[^]*?"steamid":"(\d{17})"/)?.[1])
        .find(Boolean) ?? location.pathname.match(/^\/profiles\/(\d{17})/)?.[1];

    return CONSTANTS.STEAM_ID_PATTERN.test(steamId ?? '') ? steamId : null;
};

const toggleSectionButton = (section, game, faceitData) => {
    const buttons = {
        csstats: {
            [CONSTANTS.GAMES.CSGO]: document.getElementById('csstats-csgo-button'),
            [CONSTANTS.GAMES.CS2]: document.getElementById('csstats-cs2-button')
        },
        faceit: {
            [CONSTANTS.GAMES.CSGO]: document.getElementById('faceit-csgo-button'),
            [CONSTANTS.GAMES.CS2]: document.getElementById('faceit-cs2-button')
        }
    };

    const sectionButtons = buttons[section];

    if (!sectionButtons) return;

    Object.keys(sectionButtons).forEach(key => {
        sectionButtons[key]?.classList.remove('selected');
    });

    sectionButtons[game]?.classList.add('selected');

    if (section === 'csstats') {
        const csStatsContainer = document.getElementById(CONSTANTS.CONTAINER_IDS.CSSTATS);

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
        if (!faceitData) return;

        const { KD, WINRATE, HS, MATCHES } = CONSTANTS.FACEIT_KEYS;

        const toggleStats = faceitData.stats[game];
        const toggleElo = faceitData.playerData.games[game]?.faceit_elo;
        const toggleLvl = faceitData.playerData.games[game]?.skill_level;

        if (!toggleStats?.lifetime) console.warn(`No hay datos de stats para ${game}`);

        const lvlIcon = document.getElementById('faceit-stats-level-icon');
        const elo = document.getElementById('faceit-stats-elo');
        const kd = document.getElementById('faceit-stats-kd');
        const winrate = document.getElementById('faceit-stats-winrate');
        const hs = document.getElementById('faceit-stats-hs');
        const matches = document.getElementById('faceit-stats-matches');

        const getMatches = () => {
            const cs2Matches = faceitData.stats.cs2?.lifetime?.[MATCHES] ?? 0;
            const csgoMatches = faceitData.stats.csgo?.lifetime?.[MATCHES] ?? 0;

            return game === CONSTANTS.GAMES.CS2 ? cs2Matches - csgoMatches : csgoMatches;
        };

        if (lvlIcon && toggleLvl) lvlIcon.src = chrome.runtime.getURL(`imgs/faceit/lvl${toggleLvl}.svg`);
        if (elo) elo.innerText = toggleElo ?? 'N/A';
        if (kd) kd.innerText = toggleStats?.lifetime?.[KD] ?? 'N/A';
        if (winrate) winrate.innerText = `${toggleStats?.lifetime?.[WINRATE] ?? 0} %`;
        if (hs) hs.innerText = `${toggleStats?.lifetime?.[HS] ?? 0} %`;
        if (matches) matches.innerText = getMatches().toString();
    }
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

const createTemplate = (steamId) => {
    const mainContainer = document.createElement('div');
    mainContainer.id = CONSTANTS.ROOT_ID;

    const csRepSection = createCSRepSection(steamId);
    const csStatsSection = createCSStatsSection(steamId);
    const faceitSection = createFaceitSection();
    const accountStatsSection = createAccountStatsSection();

    mainContainer.appendChild(csRepSection);
    mainContainer.appendChild(csStatsSection);
    mainContainer.appendChild(faceitSection);
    mainContainer.appendChild(accountStatsSection);

    return mainContainer;
};

const setEventListeners = () => {

    const copyCSStatsToClipboardDiv = document.getElementById('copy-csstats-stats-to-clipboard');
    copyCSStatsToClipboardDiv?.addEventListener('click', () => copyCSStatsStatsToClipboard());

    const copyFaceitToClipboardDiv = document.getElementById('copy-faceit-stats-to-clipboard');
    copyFaceitToClipboardDiv?.addEventListener('click', () => copyFaceitStatsToClipboard());

    const csstatsCsgoButton = document.getElementById('csstats-csgo-button');
    csstatsCsgoButton?.addEventListener('click', () => toggleSectionButton('csstats', CONSTANTS.GAMES.CSGO));

    const csstatsCs2Button = document.getElementById('csstats-cs2-button');
    csstatsCs2Button?.addEventListener('click', () => toggleSectionButton('csstats', CONSTANTS.GAMES.CS2));
};

const setFaceitEventListeners = (faceitData) => {
    const nickname = faceitData.playerData?.nickname;
    const faceitLinkTitle = document.getElementById('faceit-link-title');
    if (faceitLinkTitle && nickname) faceitLinkTitle.href = `https://www.faceit.com/es/players/${encodeURIComponent(nickname)}`;

    const faceitCsgoButton = document.getElementById('faceit-csgo-button');
    faceitCsgoButton?.addEventListener('click', () => toggleSectionButton('faceit', CONSTANTS.GAMES.CSGO, faceitData));

    const faceitCs2Button = document.getElementById('faceit-cs2-button');
    faceitCs2Button?.addEventListener('click', () => toggleSectionButton('faceit', CONSTANTS.GAMES.CS2, faceitData));
};

(() => {
    if (!/^\/(id|profiles)\/[^/]+\/?$/.test(location.pathname) || document.getElementById(CONSTANTS.ROOT_ID)) return;

    const steamId = getSteamId();
    const target = document.querySelector('.profile_customization_area') ?? document.querySelector('.profile_leftcol');

    if (!steamId || !target) return;

    target.insertBefore(createTemplate(steamId), target.firstChild);

    toggleSectionButton('csstats', CONSTANTS.GAMES.CS2);
    toggleSectionButton('faceit', CONSTANTS.GAMES.CS2);

    setEventListeners();
    showErrorCSRep('CSRep.gg – Coming soon');

    const faceitRequest = request('faceit', steamId);

    loadCSStatsStats(steamId);
    loadFaceitStats(faceitRequest);
    loadAccountStats(request('steam', steamId), faceitRequest);
})();
