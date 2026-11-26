const toFlagEmoji = (country) => String.fromCodePoint(...[...country.toUpperCase()].map(letter => 0x1F1A5 + letter.charCodeAt(0)));

const formatFaceitGame = (game) => ({
    elo: game?.elo ?? CONSTANTS.PLACEHOLDER,
    kd: game?.kd?.toFixed(2) ?? CONSTANTS.PLACEHOLDER,
    winRate: game?.winRate != null ? `${game.winRate}%` : CONSTANTS.PLACEHOLDER,
    headshots: game?.headshots != null ? `${game.headshots}%` : CONSTANTS.PLACEHOLDER,
    matches: game?.matches?.toLocaleString('en-US') ?? CONSTANTS.PLACEHOLDER
});

const createFaceitStats = (gameKey, game) => {
    const { elo, kd, winRate, headshots, matches } = formatFaceitGame(game);
    const valueClass = 'css-text-faceit';

    return [
        el('div', { className: 'css-stat css-faceit-level', dataset: { game: gameKey } },
            el('img', { className: 'css-faceit-level-icon', src: chrome.runtime.getURL(`imgs/faceit/${game?.level ? `lvl${game.level}` : 'unranked'}.svg`), alt: 'FACEIT level' }),
            el('div', { className: 'css-stat-label css-faceit-elo' }, String(elo))
        ),
        createStat({ label: 'K/D', value: kd, game: gameKey, valueClass }),
        createStat({ label: 'Win rate', value: winRate, game: gameKey, valueClass }),
        createStat({ label: 'HS%', value: headshots, game: gameKey, valueClass }),
        createStat({ label: 'Matches', value: matches, game: gameKey, valueClass })
    ];
};

const createFaceitSection = (faceitRequest) => {
    const section = createSection({ id: 'css-faceit', title: 'FACEIT.COM', logo: 'imgs/logos/faceit-logo.png', games: true, emptyMessage: 'No FACEIT account' });

    section.load(faceitRequest, ({ nickname, country, profileUrl, banned, games }) => {
        if (profileUrl) section.setLink(profileUrl);
        if (banned) section.addToHeader(el('div', { className: 'css-badge css-badge-danger' }, banned.reason ? `Banned for ${banned.reason}` : 'Banned'));

        CONSTANTS.GAME_TOGGLES.forEach(({ game }) => {
            if (!games[game]) section.disableGame(game);
        });
        if (!games.cs2 && games.csgo) section.selectGame(CONSTANTS.GAMES.CSGO);

        section.render([
            el('div', { className: 'css-badge' }, country && el('span', { title: country.toUpperCase() }, toFlagEmoji(country)), nickname),
            ...CONSTANTS.GAME_TOGGLES.flatMap(({ game }) => createFaceitStats(game, games[game]))
        ], (game) => {
            const { elo, kd, winRate, headshots, matches } = formatFaceitGame(games[game]);
            return [['Nickname', nickname], ['Elo', elo], ['K/D', kd], ['Win rate', winRate], ['HS', headshots], ['Matches', matches]];
        });
    });

    return section.element;
};
