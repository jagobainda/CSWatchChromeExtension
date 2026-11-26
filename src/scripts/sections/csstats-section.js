const PREMIER_CLASS = 'css-rank-badge css-premier-padding css-typography';

const createPremierStat = (label, rating) => {
    if (rating == null) return createStat({ label, game: CONSTANTS.GAMES.CS2, valueClass: PREMIER_CLASS });

    const thousands = Math.floor(rating / 1000);
    const tier = CONSTANTS.getPremierTier(thousands);

    return createStat({
        label,
        game: CONSTANTS.GAMES.CS2,
        valueClass: `${PREMIER_CLASS} css-premier-${tier}`,
        style: { backgroundImage: assetBackground(`imgs/premiere/${tier}.png`) },
        value: [String(thousands), el('span', { className: 'css-elo-decimal' }, `,${String(rating % 1000).padStart(3, '0')}`)]
    });
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

    section.load(csstatsRequest, ({ premier, csgo }) => {
        if (!csgo) section.disableGame(CONSTANTS.GAMES.CSGO);

        const format = (value) => value?.toLocaleString('en-US') ?? CONSTANTS.PLACEHOLDER;

        section.render([
            createPremierStat('Current', premier?.current),
            createPremierStat('Best', premier?.best),
            createCSGORankStat('Last', csgo?.currentRank),
            createCSGORankStat('Best', csgo?.bestRank),
            createStat({ label: 'CS:GO MM Wins', value: csgo?.wins, game: CONSTANTS.GAMES.CSGO, valueClass: 'css-text-csstats' })
        ], (game) => game === CONSTANTS.GAMES.CS2
            ? [['Nickname', nickname], ['Premier', format(premier?.current)], ['Best', format(premier?.best)]]
            : [['Nickname', nickname], ['Last rank', format(csgo?.currentRank)], ['Best rank', format(csgo?.bestRank)], ['MM wins', format(csgo?.wins)]]);
    });

    return section.element;
};
