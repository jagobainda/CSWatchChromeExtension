const getSteamId = () => {
    const steamId = [...document.scripts]
        .map(script => script.textContent.match(/g_rgProfileData\s*=\s*\{[^]*?"steamid":"(\d{17})"/)?.[1])
        .find(Boolean) ?? location.pathname.match(/^\/profiles\/(\d{17})/)?.[1];

    return CONSTANTS.STEAM_ID_PATTERN.test(steamId ?? '') ? steamId : null;
};

(() => {
    if (!/^\/(id|profiles)\/[^/]+\/?$/.test(location.pathname) || document.getElementById(CONSTANTS.ROOT_ID)) return;

    const steamId = getSteamId();
    const target = document.querySelector('.profile_customization_area') ?? document.querySelector('.profile_leftcol');

    if (!steamId || !target) return;

    const nickname = document.querySelector('.actual_persona_name')?.textContent.trim() || 'Unknown';
    const faceitRequest = request('faceit', steamId);
    const fragment = document.createDocumentFragment();

    fragment.append(el('div', { id: CONSTANTS.ROOT_ID },
        createCSStatsSection(steamId, request('csstats', steamId), nickname),
        createFaceitSection(faceitRequest),
        createAccountSection(steamId, request('steam', steamId), faceitRequest)
    ));

    target.prepend(fragment);
})();
