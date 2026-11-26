import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCSStatsBase, parseCSStatsStats } from '../src/scripts/parsers/csstats-parser.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

test('base page with Premier and CS:GO ranks', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base.html')), {
        premier: { wins: 27, current: 26235, best: 26345 },
        csgo: { wins: 797, currentRank: null, bestRank: 18 }
    });
});

test('base page without Premier nor CS:GO ranks', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base-no-ranks.html')), { premier: null, csgo: null });
});

test('base page of a player without data', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base-empty.html')), { premier: null, csgo: null });
});

test('Cloudflare block page yields no data', () => {
    const html = fixture('csstats-stats-blocked.html');

    assert.deepEqual(parseCSStatsBase(html), { premier: null, csgo: null });
    assert.equal(parseCSStatsStats(html), null);
});

test('rating values are never taken from markup', () => {
    const html = '<div class="pm-now"><div class="pm-c"><span class="k">Current</span><span class="v"><div class="cs2rating"><span>&lt;img src=x onerror=alert(1)&gt;<small>,235</small></span></div></span></div></div>';

    assert.equal(parseCSStatsBase(html).premier, null);
});
