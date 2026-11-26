import { parseCSStatsBase } from './parsers/csstats-parser.js';
import { parseSteamMemberSince } from './parsers/steam-parser.js';
import { fetchFaceitPlayer } from './faceit.js';
import { mapLeetifySummary } from './leetify.js';
import { fetchResource } from './http.js';

const FACEIT_API_URL = 'https://open.faceit.com/data/v4';
const FACEIT_API_KEY = '9b120352-0750-4534-a1d2-e82a4838707e';

const STEAM_ID_PATTERN = /^7656\d{13}$/;
const CACHE_TTL_MS = 5 * 60 * 1000;
const ERROR_CODES = new Set(['not_found', 'blocked', 'http', 'timeout', 'invalid']);

const cache = new Map();

const fetchCSStats = async (steamId) => {
    const data = parseCSStatsBase(await fetchResource(`https://csstats.gg/player/${steamId}`, 'text'));

    if (!data.premierSeasons.length && !data.csgo) throw new Error('not_found');

    return data;
};

const fetchSteam = async (steamId) => {
    const html = await fetchResource(`https://steamcommunity.com/profiles/${steamId}/badges/1?l=english`, 'text');
    const memberSince = parseSteamMemberSince(html);

    if (memberSince === null) throw new Error('not_found');

    return { memberSince };
};

const fetchFaceit = (steamId) => fetchFaceitPlayer(steamId, (path) => fetchResource(`${FACEIT_API_URL}${path}`, 'json', {
    headers: { Authorization: `Bearer ${FACEIT_API_KEY}` }
}));

const fetchLeetify = async (steamId) => {
    const data = mapLeetifySummary(await fetchResource(`https://api.cs-prod.leetify.com/api/profile/${steamId}/browser-extension-summary`, 'json'));

    if (Object.values(data).every(metric => metric === null)) throw new Error('not_found');

    return data;
};

const FETCHERS = { csstats: fetchCSStats, faceit: fetchFaceit, leetify: fetchLeetify, steam: fetchSteam };

const getCached = (type, steamId) => {
    const key = `${type}:${steamId}`;
    const now = Date.now();
    const entry = cache.get(key);

    if (entry && entry.expires > now) return entry.promise;

    cache.forEach((cached, cachedKey) => {
        if (cached.expires <= now) cache.delete(cachedKey);
    });

    const promise = FETCHERS[type](steamId);
    cache.set(key, { promise, expires: now + CACHE_TTL_MS });
    promise.catch(() => cache.delete(key));

    return promise;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, steamId } = message ?? {};

    if (!Object.hasOwn(FETCHERS, type) || typeof steamId !== 'string' || !STEAM_ID_PATTERN.test(steamId)) {
        sendResponse({ ok: false, error: 'invalid' });
        return;
    }

    getCached(type, steamId).then(
        data => sendResponse({ ok: true, data }),
        error => sendResponse({ ok: false, error: ERROR_CODES.has(error.message) ? error.message : 'http' })
    );

    return true;
});
