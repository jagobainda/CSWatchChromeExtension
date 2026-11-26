import { parseCSStatsBase } from './parsers/csstats-parser.js';
import { parseSteamMemberSince } from './parsers/steam-parser.js';

const STEAM_ID_PATTERN = /^7656\d{13}$/;
const TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const ERROR_CODES = new Set(['not_found', 'blocked', 'http', 'timeout', 'invalid']);
const STATUS_ERRORS = { 403: 'blocked', 404: 'not_found', 429: 'blocked' };

const cache = new Map();

const fetchResource = async (url, read, init = {}) => {
    try {
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!response.ok) throw new Error(STATUS_ERRORS[response.status] ?? 'http');
        return await response[read]();
    } catch (error) {
        throw error.name === 'TimeoutError' ? new Error('timeout') : error;
    }
};

const fetchCSStats = async (steamId) => {
    const data = parseCSStatsBase(await fetchResource(`https://csstats.gg/player/${steamId}`, 'text'));

    if (!data.premier && !data.csgo) throw new Error('not_found');

    return data;
};

const fetchFaceit = (steamId) => fetchResource('https://shapi.jagoba.dev/External/GetFaceitCompleteData', 'json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(steamId)
});

const fetchSteam = async (steamId) => {
    const html = await fetchResource(`https://steamcommunity.com/profiles/${steamId}/badges/1?l=english`, 'text');
    const memberSince = parseSteamMemberSince(html);

    if (memberSince === null) throw new Error('not_found');

    return { memberSince };
};

const FETCHERS = { csstats: fetchCSStats, faceit: fetchFaceit, steam: fetchSteam };

const getCached = (type, steamId) => {
    const key = `${type}:${steamId}`;
    const entry = cache.get(key);

    if (entry && entry.expires > Date.now()) return entry.promise;

    const promise = FETCHERS[type](steamId);
    cache.set(key, { promise, expires: Date.now() + CACHE_TTL_MS });
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
