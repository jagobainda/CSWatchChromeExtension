const setBackgroundImage = (element, path) => {
    element.style.backgroundImage = `url('${chrome.runtime.getURL(path)}')`;
};

const displayPremierRating = (id, rating) => {
    const element = document.getElementById(id);
    if (!element || rating == null) return;

    const thousands = Math.floor(rating / 1000);
    const background = CONSTANTS.getPremierRankBackground(thousands);

    const decimal = document.createElement('span');
    decimal.className = 'elo-decimal';
    decimal.innerText = `,${String(rating % 1000).padStart(3, '0')}`;

    element.replaceChildren(String(thousands), decimal);

    if (!background) return;

    element.classList.add(`premiere-${background}`);
    setBackgroundImage(element, `imgs/premiere/${background}.png`);
};

const displayCSGORank = (id, rank) => {
    const element = document.getElementById(id);
    if (!element || rank == null) return;

    element.innerText = '';
    setBackgroundImage(element, `imgs/csgo/${rank}.png`);
};

const displayCSStatsStats = ({ premier, csgo, stats }) => {
    displayPremierRating('csstats-stats-premiere-current-elo', premier?.current);
    displayPremierRating('csstats-stats-premiere-best-elo', premier?.best);
    displayCSGORank('csstats-last-csgo-rank', csgo?.currentRank);
    displayCSGORank('csstats-best-csgo-rank', csgo?.bestRank);

    const values = {
        'csstats-stats-kd': stats?.kd?.toFixed(2),
        'csstats-stats-winrate': stats?.winRate != null ? `${stats.winRate}%` : null,
        'csstats-stats-hs': stats?.hs != null ? `${stats.hs}%` : null,
        'csstats-stats-adr': stats?.adr,
        'csstats-stats-matches': stats?.matches,
        'csstats-stats-csgo-matches': csgo?.wins
    };

    Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element && value != null) element.innerText = String(value);
    });
};
