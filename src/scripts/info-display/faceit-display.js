const displayFaceitStats = (responseObject) => {
    const { playerData, stats } = responseObject.data;
    const { country, nickname, games } = playerData;
    const { cs2, csgo } = stats;

    const flag = document.getElementById('faceit-user-flag');
    const faceitNickname = document.getElementById('faceit-user-nickname');

    if (flag) {
        flag.src = `https://flagcdn.com/w20/${country.toLowerCase()}.png`;
        flag.title = country.toLowerCase();
    }
    if (faceitNickname) faceitNickname.innerText = nickname;

    document.getElementById('faceit-user-nickname-container')?.classList.remove('hidden');

    const lvlIcon = document.getElementById('faceit-stats-level-icon');
    if (lvlIcon && games.cs2?.skill_level) lvlIcon.src = chrome.runtime.getURL(`imgs/faceit/lvl${games.cs2.skill_level}.svg`);

    if (!cs2?.lifetime) console.warn('No hay datos de CS2 disponibles');

    const { KD, WINRATE, HS, MATCHES } = CONSTANTS.FACEIT_KEYS;
    const csgoMatches = csgo?.lifetime?.[MATCHES] ?? 0;
    const cs2Matches = cs2?.lifetime?.[MATCHES] ?? 0;
    const cs2OnlyMatches = csgo?.lifetime ? (cs2Matches - csgoMatches) : cs2Matches;

    const statsMap = {
        'faceit-stats-elo': games.cs2?.faceit_elo ?? 'N/A',
        'faceit-stats-kd': cs2?.lifetime?.[KD] ?? 'N/A',
        'faceit-stats-winrate': `${cs2?.lifetime?.[WINRATE] ?? 0} %`,
        'faceit-stats-hs': `${cs2?.lifetime?.[HS] ?? 0} %`,
        'faceit-stats-matches': cs2OnlyMatches.toString()
    };

    Object.entries(statsMap).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = value;
    });
};
