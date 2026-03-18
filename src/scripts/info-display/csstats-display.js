const displayCSStatsStats = (responseObject) => {
    if (!responseObject?.base || !responseObject?.cs2) {
        showErrorCSStats('Failed to parse CSStats data');
        return;
    }

    const { base, cs2 } = responseObject;

    const premierLastRankBgString = CONSTANTS.getPremierRankBackground(base.cs2.last_rank?.main);
    const premierBestRankBgString = CONSTANTS.getPremierRankBackground(base.cs2.best_rank?.main);

    const premierLastRankBg = document.getElementById('csstats-stats-premiere-current-elo');
    const premierBestRankBg = document.getElementById('csstats-stats-premiere-best-elo');

    if (premierLastRankBgString && premierLastRankBg) premierLastRankBg.style.backgroundImage = `url('${chrome.runtime.getURL(`imgs/premiere/${premierLastRankBgString}.png`)}')`;
    if (premierBestRankBgString && premierBestRankBg) premierBestRankBg.style.backgroundImage = `url('${chrome.runtime.getURL(`imgs/premiere/${premierBestRankBgString}.png`)}')`;

    const csgoLastRankBg = document.getElementById('csstats-last-csgo-rank');
    const csgoBestRankBg = document.getElementById('csstats-best-csgo-rank');

    if (csgoLastRankBg && base.csgo) csgoLastRankBg.style.backgroundImage = `url('${chrome.runtime.getURL(`imgs/csgo/${base.csgo.last_rank}.png`)}')`;
    if (csgoBestRankBg && base.csgo) csgoBestRankBg.style.backgroundImage = `url('${chrome.runtime.getURL(`imgs/csgo/${base.csgo.best_rank}.png`)}')`;

    const formatEloWithDecimal = (main, decimal) => {
        if (!main) return '---';
        return `${main}<span class="elo-decimal">,${decimal || '0'}</span>`;
    };

    const premierCurrentEl = document.getElementById('csstats-stats-premiere-current-elo');
    const premierBestEl = document.getElementById('csstats-stats-premiere-best-elo');

    if (premierCurrentEl) {
        premierCurrentEl.innerHTML = formatEloWithDecimal(base.cs2.last_rank?.main, base.cs2.last_rank?.decimal);
        premierCurrentEl.classList.add(`premiere-${premierLastRankBgString}`)
    }

    if (premierBestEl) {
        premierBestEl.innerHTML = formatEloWithDecimal(base.cs2.best_rank?.main, base.cs2.best_rank?.decimal);
        premierBestEl.classList.add(`premiere-${premierBestRankBgString}`)
    }

    const elements = {
        kd: ['csstats-stats-kd', cs2.kd],
        winrate: ['csstats-stats-winrate', cs2.wr],
        hs: ['csstats-stats-hs', cs2.hs],
        adr: ['csstats-stats-adr', cs2.adr],
        matches: ['csstats-stats-matches', cs2.matches],
        csgoMatches: ['csstats-stats-csgo-matches', base.csgo?.wins ?? "N/A"]
    };

    Object.values(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) el.innerText = value;
    });
};
