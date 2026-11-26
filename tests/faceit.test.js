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
            cs2: { level: 10, elo: 3669, kd: 1.36, winRate: 54, headshots: 48, matches: 1070 },
            csgo: { level: 10, elo: 4416, kd: 1.35, winRate: 53, headshots: 47, matches: 4477 }
        }
    });
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
    assert.equal(requested.some(path => path.includes('csgo')), false);
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
