const GAMES = ['cs2', 'csgo'];
const PROFILE_URL_PREFIX = 'https://www.faceit.com/';

const STAT_KEYS = Object.freeze({
    MATCHES: 'Matches',
    WINS: 'Wins',
    KD_TOTAL: 'K/D Ratio',
    HEADSHOTS_TOTAL: 'Total Headshots %'
});

const NO_STATS = Object.freeze({ kd: null, winRate: null, headshots: null, matches: null });
const NO_LIFETIME = Object.freeze({ lifetime: null });

const toNumber = (value) => (value === undefined || value === null || value === '' || !Number.isFinite(Number(value)) ? null : Number(value));

const mapStats = (lifetime, excluded) => {
    const total = (key) => {
        const value = toNumber(lifetime[key]);
        const subtracted = excluded ? toNumber(excluded[key]) : 0;
        return value === null || subtracted === null ? null : value - subtracted;
    };
    const matchesTotal = total(STAT_KEYS.MATCHES);

    if (matchesTotal === null) return NO_STATS;

    const matches = Math.max(0, matchesTotal);
    const average = (key, digits = 0, scale = 1) => {
        const value = total(key);
        return matches > 0 && value !== null && value >= 0 ? Number(((value * scale) / matches).toFixed(digits)) : null;
    };

    return {
        kd: average(STAT_KEYS.KD_TOTAL, 2),
        winRate: average(STAT_KEYS.WINS, 0, 100),
        headshots: average(STAT_KEYS.HEADSHOTS_TOTAL),
        matches
    };
};

const mapGame = (gameData, lifetime, excluded) => {
    if (!gameData) return null;

    const level = toNumber(gameData.skill_level);

    return {
        level: Number.isInteger(level) && level >= 1 && level <= 10 ? level : null,
        elo: toNumber(gameData.faceit_elo),
        ...(lifetime && excluded !== undefined ? mapStats(lifetime, excluded) : NO_STATS)
    };
};

const findActiveBan = (bans, now) => bans?.items?.find((ban) => !ban.ends_at || Date.parse(ban.ends_at) > now);

export const mapFaceitPlayer = ({ player, stats = {}, bans }, now = Date.now()) => {
    const profileUrl = player.faceit_url?.replace('{lang}', 'en');
    const ban = findActiveBan(bans, now);

    return {
        nickname: player.nickname,
        country: /^[a-z]{2}$/.test(player.country) ? player.country : null,
        profileUrl: profileUrl?.startsWith(PROFILE_URL_PREFIX) ? profileUrl : null,
        activatedAt: Date.parse(player.activated_at) || null,
        banned: ban ? { reason: ban.reason ?? null } : null,
        games: {
            cs2: mapGame(player.games?.cs2, stats.cs2?.lifetime, player.games?.csgo ? stats.csgo?.lifetime : null),
            csgo: mapGame(player.games?.csgo, stats.csgo?.lifetime, null)
        }
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
    const games = GAMES.filter((game) => player.games?.[game]);

    const [bans, ...gameStats] = await Promise.allSettled([getJson(`${playerPath}/bans`), ...games.map((game) => getJson(`${playerPath}/stats/${game}`))]);

    return mapFaceitPlayer({
        player,
        bans: bans.value,
        stats: Object.fromEntries(games.map((game, index) => [game, gameStats[index].reason?.message === 'not_found' ? NO_LIFETIME : gameStats[index].value]))
    });
};
