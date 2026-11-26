const STEAM_FLAGS_URL = 'https://community.fastly.steamstatic.com/public/images/countryflags/';

const createFlag = (country) =>
    el('img', { className: 'css-flag', src: `${STEAM_FLAGS_URL}${country}.gif`, alt: country.toUpperCase(), title: country.toUpperCase(), onerror: (event) => event.target.remove() });

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
        el(
            'div',
            { className: 'css-stat css-faceit-level', dataset: { game: gameKey } },
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

        section.setAvailableGames(games);

        section.render(
            [el('div', { className: 'css-badge' }, country && createFlag(country), nickname), ...CONSTANTS.GAME_TOGGLES.flatMap(({ game }) => createFaceitStats(game, games[game]))],
            (game) => {
                const { elo, kd, winRate, headshots, matches } = formatFaceitGame(games[game]);
                return [
                    ['Nickname', nickname],
                    ['Elo', elo],
                    ['K/D', kd],
                    ['Win rate', winRate],
                    ['HS', headshots],
                    ['Matches', matches]
                ];
            }
        );
    });

    return section.element;
};
