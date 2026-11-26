const PREMIER_CLASS = 'css-rank-badge css-premier-padding css-typography';
const CSSTATS_VISIBLE_SEASONS = 3;

const formatCSStatsValue = (value) => value?.toLocaleString('en-US') ?? CONSTANTS.PLACEHOLDER;

const createPremierStat = (label, rating) => {
    if (rating == null) return createStat({ label, valueClass: PREMIER_CLASS });

    const thousands = Math.floor(rating / 1000);
    const tier = CONSTANTS.getPremierTier(thousands);

    return createStat({
        label,
        valueClass: `${PREMIER_CLASS} css-premier-${tier}`,
        style: { backgroundImage: assetBackground(`imgs/premiere/${tier}.png`) },
        value: thousands ? [String(thousands), el('span', { className: 'css-elo-decimal' }, `,${String(rating % 1000).padStart(3, '0')}`)] : String(rating)
    });
};

const createPremierSeason = ({ season, wins, current, best }, index) => el('div', { className: index < CSSTATS_VISIBLE_SEASONS ? 'css-season' : 'css-season css-season-extra' },
    el('div', { className: 'css-season-ratings' }, createPremierStat('Current', current), createPremierStat('Best', best)),
    el('div', { className: 'css-stat-label' }, `${season} · ${formatCSStatsValue(wins)} wins`)
);

const createPremierSeasons = (seasons) => {
    const container = el('div', { className: 'css-seasons', dataset: { game: CONSTANTS.GAMES.CS2 } }, seasons.map(createPremierSeason));

    if (seasons.length > CSSTATS_VISIBLE_SEASONS) {
        const showAll = `Show all (${seasons.length})`;
        const toggle = el('div', {
            className: 'css-seasons-toggle',
            onclick: () => { toggle.textContent = container.classList.toggle('css-expanded') ? 'Show less' : showAll; }
        }, showAll);
        container.append(toggle);
    }

    return container;
};

const createCSGORankStat = (label, rank) => createStat({
    label,
    game: CONSTANTS.GAMES.CSGO,
    valueClass: 'css-rank-badge',
    style: rank != null && { backgroundImage: assetBackground(`imgs/csgo/${rank}.png`) },
    value: rank != null ? '' : null
});

const createCSStatsSection = (steamId, csstatsRequest, nickname) => {
    const section = createSection({
        id: 'css-csstats',
        title: 'CSSTATS.GG',
        href: `https://csstats.gg/player/${steamId}`,
        logo: 'imgs/logos/csstats-logo.svg',
        games: true
    });

    section.load(csstatsRequest, ({ premierSeasons, csgo }) => {
        section.setAvailableGames({ [CONSTANTS.GAMES.CS2]: premierSeasons.length > 0, [CONSTANTS.GAMES.CSGO]: csgo });

        section.render([
            createPremierSeasons(premierSeasons),
            createCSGORankStat('Last', csgo?.currentRank),
            createCSGORankStat('Best', csgo?.bestRank),
            createStat({ label: 'CS:GO MM Wins', value: formatCSStatsValue(csgo?.wins), game: CONSTANTS.GAMES.CSGO, valueClass: 'css-text-csstats' })
        ], (game) => game === CONSTANTS.GAMES.CS2
            ? [['Nickname', nickname], ...premierSeasons.map(({ season, wins, current, best }) => [season, `${formatCSStatsValue(current)} (best ${formatCSStatsValue(best)}, ${formatCSStatsValue(wins)} wins)`])]
            : [['Nickname', nickname], ['Last rank', formatCSStatsValue(csgo?.currentRank)], ['Best rank', formatCSStatsValue(csgo?.bestRank)], ['MM wins', formatCSStatsValue(csgo?.wins)]]);
    });

    return section.element;
};
