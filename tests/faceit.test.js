import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fetchFaceitPlayer, mapFaceitPlayer } from '../src/scripts/faceit.js';

const fixture = (name) => JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8'));

const fakeApi = (responses) => {
    const requested = [];
    const getJson = async (path) => {
        requested.push(path);
        const body = responses[path] ?? fixture('faceit-player-notfound');
        if (body.errors?.[0]?.http_status === 404) throw new Error('not_found');
        if (body instanceof Error) throw body;
        return body;
    };
    return { getJson, requested };
};

const S1MPLE = '76561198034202275';
const S1MPLE_PATH = '/players/ac71ba3c-d3d4-45e7-8be2-26aa3986867d';
const CS2_ONLY = '76561198745758968';
const CS2_ONLY_PATH = '/players/054dcd6e-76c9-4e98-a08d-9bdcd7bb4daa';
const NO_CS2 = '76561198879168165';
const NO_CS2_PATH = '/players/7e6451c9-68fe-4478-82a5-150447db0949';

test('player with CS2 and CS:GO', async () => {
    const { getJson } = fakeApi({
        [`/players?game=cs2&game_player_id=${S1MPLE}`]: fixture('faceit-player-lookup-cs2'),
        [`${S1MPLE_PATH}/stats/cs2`]: fixture('faceit-stats-cs2'),
        [`${S1MPLE_PATH}/stats/csgo`]: fixture('faceit-stats-csgo'),
        [`${S1MPLE_PATH}/bans`]: fixture('faceit-bans')
    });

    assert.deepEqual(await fetchFaceitPlayer(S1MPLE, getJson), {
        nickname: 'akkaman321',
        country: 'ua',
        profileUrl: 'https://www.faceit.com/en/players/akkaman321',
        activatedAt: Date.UTC(2013, 6, 27, 10, 56, 1),
        banned: null,
        games: {
            cs2: { level: 10, elo: 3669, kd: 1.39, winRate: 56, headshots: 51, matches: 1334 },
            csgo: { level: 10, elo: 4416, kd: 1.35, winRate: 53, headshots: 47, matches: 4477 }
        }
    });
});

test('CS:GO history migrated to CS2 is not counted as CS2 matches', async () => {
    const { getJson } = fakeApi({
        [`/players?game=cs2&game_player_id=${NO_CS2}`]: fixture('faceit-nocs2-lookup-cs2'),
        [`${NO_CS2_PATH}/stats/cs2`]: fixture('faceit-nocs2-stats-cs2'),
        [`${NO_CS2_PATH}/stats/csgo`]: fixture('faceit-nocs2-stats-csgo'),
        [`${NO_CS2_PATH}/bans`]: fixture('faceit-nocs2-bans')
    });

    const player = await fetchFaceitPlayer(NO_CS2, getJson);

    assert.equal(player.country, 'es');
    assert.deepEqual(player.games, {
        cs2: { level: 3, elo: 889, kd: null, winRate: null, headshots: null, matches: 0 },
        csgo: { level: 2, elo: 889, kd: 1.33, winRate: 50, headshots: 36, matches: 86 }
    });
});

test('CS2 totals below the CS:GO history count as no CS2 matches', () => {
    const cs2 = fixture('faceit-nocs2-stats-cs2');
    const player = mapFaceitPlayer({
        player: fixture('faceit-nocs2-lookup-cs2'),
        stats: { cs2: { ...cs2, lifetime: { ...cs2.lifetime, Matches: '80', Wins: '40' } }, csgo: fixture('faceit-nocs2-stats-csgo') }
    });

    assert.deepEqual(player.games.cs2, { level: 3, elo: 889, kd: null, winRate: null, headshots: null, matches: 0 });
});

test('missing lifetime totals are unknown instead of zero or negative', () => {
    const cs2 = fixture('faceit-stats-cs2');
    const csgo = fixture('faceit-stats-csgo');
    const { Wins, ...cs2WithoutWins } = cs2.lifetime;
    const { 'K/D Ratio': kd, ...csgoWithoutKd } = csgo.lifetime;
    const { Matches, ...cs2WithoutMatches } = cs2.lifetime;
    const map = (cs2Lifetime, csgoLifetime) =>
        mapFaceitPlayer({
            player: fixture('faceit-player-lookup-cs2'),
            stats: { cs2: { lifetime: cs2Lifetime }, csgo: { lifetime: csgoLifetime } }
        }).games.cs2;

    assert.deepEqual(map(cs2WithoutWins, csgo.lifetime), { level: 10, elo: 3669, kd: 1.39, winRate: null, headshots: 51, matches: 1334 });
    assert.deepEqual(map(cs2.lifetime, csgoWithoutKd), { level: 10, elo: 3669, kd: null, winRate: 56, headshots: 51, matches: 1334 });
    assert.deepEqual(map(cs2WithoutMatches, csgo.lifetime), { level: 10, elo: 3669, kd: null, winRate: null, headshots: null, matches: null });
});

test('CS:GO stats not found leave nothing to subtract from CS2', async () => {
    const { getJson } = fakeApi({
        [`/players?game=cs2&game_player_id=${S1MPLE}`]: fixture('faceit-player-lookup-cs2'),
        [`${S1MPLE_PATH}/stats/cs2`]: fixture('faceit-stats-cs2'),
        [`${S1MPLE_PATH}/bans`]: fixture('faceit-bans')
    });

    const player = await fetchFaceitPlayer(S1MPLE, getJson);

    assert.deepEqual(player.games, {
        cs2: { level: 10, elo: 3669, kd: 1.36, winRate: 54, headshots: 48, matches: 5811 },
        csgo: { level: 10, elo: 4416, kd: null, winRate: null, headshots: null, matches: null }
    });
});

test('CS2 stats are unknown when the CS:GO stats needed to separate them fail', async () => {
    const { getJson } = fakeApi({
        [`/players?game=cs2&game_player_id=${S1MPLE}`]: fixture('faceit-player-lookup-cs2'),
        [`${S1MPLE_PATH}/stats/cs2`]: fixture('faceit-stats-cs2'),
        [`${S1MPLE_PATH}/stats/csgo`]: new Error('blocked'),
        [`${S1MPLE_PATH}/bans`]: fixture('faceit-bans')
    });

    const player = await fetchFaceitPlayer(S1MPLE, getJson);

    assert.deepEqual(player.games.cs2, { level: 10, elo: 3669, kd: null, winRate: null, headshots: null, matches: null });
});

test('player with CS2 only does not request CS:GO stats', async () => {
    const { getJson, requested } = fakeApi({
        [`/players?game=cs2&game_player_id=${CS2_ONLY}`]: fixture('faceit-nocsgo-lookup-cs2'),
        [`${CS2_ONLY_PATH}/stats/cs2`]: fixture('faceit-nocsgo-stats-cs2'),
        [`${CS2_ONLY_PATH}/bans`]: fixture('faceit-nocsgo-bans')
    });

    const player = await fetchFaceitPlayer(CS2_ONLY, getJson);

    assert.deepEqual(player.games, {
        cs2: { level: 10, elo: 2816, kd: 1.2, winRate: 54, headshots: 37, matches: 921 },
        csgo: null
    });
    assert.equal(
        requested.some((path) => path.includes('csgo')),
        false
    );
});

test('player without account on either game', async () => {
    const { getJson, requested } = fakeApi({});

    await assert.rejects(fetchFaceitPlayer(S1MPLE, getJson), { message: 'not_found' });
    assert.deepEqual(requested, [`/players?game=cs2&game_player_id=${S1MPLE}`, `/players?game=csgo&game_player_id=${S1MPLE}`]);
});

test('failed stats and bans requests keep the player data', async () => {
    const failure = new Error('blocked');
    const { getJson } = fakeApi({
        [`/players?game=cs2&game_player_id=${S1MPLE}`]: fixture('faceit-player-lookup-cs2'),
        [`${S1MPLE_PATH}/stats/cs2`]: failure,
        [`${S1MPLE_PATH}/stats/csgo`]: failure,
        [`${S1MPLE_PATH}/bans`]: failure
    });

    const player = await fetchFaceitPlayer(S1MPLE, getJson);

    assert.equal(player.banned, null);
    assert.deepEqual(player.games.cs2, { level: 10, elo: 3669, kd: null, winRate: null, headshots: null, matches: null });
});

test('active ban is reported with its reason', () => {
    const player = mapFaceitPlayer({ player: fixture('faceit-player-lookup-cs2'), bans: fixture('faceit-bans-banned') });

    assert.deepEqual(player.banned, { reason: 'multiple accounts' });
});

test('unexpected profile url and country are dropped', () => {
    const player = mapFaceitPlayer({ player: { ...fixture('faceit-player-lookup-cs2'), faceit_url: 'javascript:alert(1)', country: '<b>' } });

    assert.equal(player.profileUrl, null);
    assert.equal(player.country, null);
});

test('player with CS:GO only is found with the CS:GO lookup', async () => {
    const { cs2, ...games } = fixture('faceit-player-lookup-csgo').games;
    const { getJson, requested } = fakeApi({
        [`/players?game=csgo&game_player_id=${S1MPLE}`]: { ...fixture('faceit-player-lookup-csgo'), games },
        [`${S1MPLE_PATH}/stats/csgo`]: fixture('faceit-stats-csgo'),
        [`${S1MPLE_PATH}/bans`]: fixture('faceit-bans')
    });

    const player = await fetchFaceitPlayer(S1MPLE, getJson);

    assert.deepEqual(player.games, {
        cs2: null,
        csgo: { level: 10, elo: 4416, kd: 1.35, winRate: 53, headshots: 47, matches: 4477 }
    });
    assert.equal(
        requested.some((path) => path.endsWith('/stats/cs2')),
        false
    );
});

test('expired ban is ignored and active ban is reported', () => {
    const [ban] = fixture('faceit-bans-banned').items;
    const bans = { items: [{ ...ban, ends_at: '2025-03-11T17:01:43.849Z' }] };
    const player = fixture('faceit-player-lookup-cs2');

    assert.equal(mapFaceitPlayer({ player, bans }, Date.UTC(2026, 0, 1)).banned, null);
    assert.deepEqual(mapFaceitPlayer({ player, bans }, Date.UTC(2024, 11, 1)).banned, { reason: 'multiple accounts' });
});
