const GAMES = ['cs2', 'csgo'];
const PROFILE_URL_PREFIX = 'https://www.faceit.com/';

const STAT_KEYS = Object.freeze({
    KD: 'Average K/D Ratio',
    WIN_RATE: 'Win Rate %',
    HEADSHOTS: 'Average Headshots %',
    TOTAL_MATCHES: 'Total Matches',
    MATCHES: 'Matches'
});

const toNumber = (value) => value === undefined || value === null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value);

const mapGame = (game, gameData, lifetime = {}) => {
    if (!gameData) return null;

    const level = toNumber(gameData.skill_level);

    return {
        level: Number.isInteger(level) && level >= 1 && level <= 10 ? level : null,
        elo: toNumber(gameData.faceit_elo),
        kd: toNumber(lifetime[STAT_KEYS.KD]),
        winRate: toNumber(lifetime[STAT_KEYS.WIN_RATE]),
        headshots: toNumber(lifetime[STAT_KEYS.HEADSHOTS]),
        matches: toNumber(game === 'cs2' ? lifetime[STAT_KEYS.TOTAL_MATCHES] ?? lifetime[STAT_KEYS.MATCHES] : lifetime[STAT_KEYS.MATCHES])
    };
};

const findActiveBan = (bans, now) => bans?.items?.find(ban => !ban.ends_at || Date.parse(ban.ends_at) > now);

export const mapFaceitPlayer = ({ player, stats = {}, bans }, now = Date.now()) => {
    const profileUrl = player.faceit_url?.replace('{lang}', 'en');
    const ban = findActiveBan(bans, now);

    return {
        nickname: player.nickname,
        country: /^[a-z]{2}$/.test(player.country) ? player.country : null,
        profileUrl: profileUrl?.startsWith(PROFILE_URL_PREFIX) ? profileUrl : null,
        activatedAt: Date.parse(player.activated_at) || null,
        banned: ban ? { reason: ban.reason ?? null } : null,
        games: Object.fromEntries(GAMES.map(game => [game, mapGame(game, player.games?.[game], stats[game]?.lifetime)]))
    };
};

const findPlayer = async (steamId, getJson) => {
    try {
        return await getJson(`/players?game=cs2&game_player_id=${steamId}`);
    } catch (error) {
        if (error.message !== 'not_found') throw error;
        return getJson(`/players?game=csgo&game_player_id=${steamId}`);
    }
};

export const fetchFaceitPlayer = async (steamId, getJson) => {
    const player = await findPlayer(steamId, getJson);
    const playerPath = `/players/${encodeURIComponent(player.player_id)}`;
    const games = GAMES.filter(game => player.games?.[game]);

    const [bans, ...gameStats] = await Promise.allSettled([
        getJson(`${playerPath}/bans`),
        ...games.map(game => getJson(`${playerPath}/stats/${game}`))
    ]);

    return mapFaceitPlayer({
        player,
        bans: bans.value,
        stats: Object.fromEntries(games.map((game, index) => [game, gameStats[index].value]))
    });
};
