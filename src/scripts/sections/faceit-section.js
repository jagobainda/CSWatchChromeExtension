const getFaceitValues = ({ playerData, stats }, game) => {
    const { KD, WINRATE, HS, MATCHES } = CONSTANTS.FACEIT_KEYS;
    const lifetime = stats[game]?.lifetime;
    const csgoMatches = stats.csgo?.lifetime?.[MATCHES] ?? 0;

    return {
        level: playerData.games[game]?.skill_level,
        elo: playerData.games[game]?.faceit_elo ?? 'N/A',
        kd: lifetime?.[KD] ?? 'N/A',
        winRate: `${lifetime?.[WINRATE] ?? 0} %`,
        hs: `${lifetime?.[HS] ?? 0} %`,
        matches: String(game === CONSTANTS.GAMES.CS2 ? (stats.cs2?.lifetime?.[MATCHES] ?? 0) - csgoMatches : csgoMatches)
    };
};

const createFaceitStats = (data, game) => {
    const { level, elo, kd, winRate, hs, matches } = getFaceitValues(data, game);
    const valueClass = 'css-text-faceit';

    return [
        el('div', { className: 'css-stat css-faceit-level', dataset: { game } },
            el('img', { className: 'css-faceit-level-icon', src: chrome.runtime.getURL(`imgs/faceit/${level ? `lvl${level}` : 'unranked'}.svg`), alt: 'Faceit Level' }),
            el('div', { className: 'css-stat-label css-faceit-elo' }, String(elo))
        ),
        createStat({ label: 'K/D', value: kd, game, valueClass }),
        createStat({ label: 'Win rate', value: winRate, game, valueClass }),
        createStat({ label: 'HS%', value: hs, game, valueClass }),
        createStat({ label: 'Matches', value: matches, game, valueClass })
    ];
};

const createFaceitSection = (faceitRequest) => {
    const section = createSection({ id: 'css-faceit', title: 'FACEIT.COM', logo: 'imgs/logos/faceit-logo.png', games: true });

    section.load(faceitRequest, (data) => {
        const { country, nickname, games } = data.playerData;
        const banReason = data.bans?.items?.[0]?.reason;

        section.setLink(`https://www.faceit.com/es/players/${encodeURIComponent(nickname)}`);
        if (banReason) section.addToHeader(el('div', { className: 'css-badge css-badge-danger' }, `Banned for ${banReason}`));
        if (!games.csgo) section.disableGame(CONSTANTS.GAMES.CSGO);

        section.render([
            el('div', { className: 'css-badge' },
                el('img', { className: 'css-flag', src: `https://flagcdn.com/w20/${country.toLowerCase()}.png`, title: country.toLowerCase(), alt: 'Country flag' }),
                nickname
            ),
            ...createFaceitStats(data, CONSTANTS.GAMES.CS2),
            ...createFaceitStats(data, CONSTANTS.GAMES.CSGO)
        ], (game) => {
            const { elo, kd, winRate, hs, matches } = getFaceitValues(data, game);
            return [['Nickname', nickname], ['Elo', elo], ['K/D', kd], ['Win rate', winRate], ['HS', hs], ['Matches', matches]];
        });
    });

    return section.element;
};
