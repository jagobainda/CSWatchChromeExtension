import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCSStatsBase } from '../src/scripts/parsers/csstats-parser.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

const EMPTY = { premierSeasons: [], csgo: null };

test('base page with Premier seasons and CS:GO ranks', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base.html')), {
        premierSeasons: [
            { season: 'Season 5', wins: 27, current: 26235, best: 26345 },
            { season: 'S4', wins: 11, current: 26979, best: 26979 },
            { season: 'S3', wins: 13, current: 26578, best: 27358 },
            { season: 'S2', wins: 3, current: null, best: null },
            { season: 'S1', wins: 108, current: 19687, best: 23483 }
        ],
        csgo: { wins: 797, currentRank: null, bestRank: 18 }
    });
});

test('Premier seasons of a second player', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base-jagobainda.html')), {
        premierSeasons: [
            { season: 'Season 5', wins: 15, current: 13888, best: 13888 },
            { season: 'S4', wins: 25, current: 16264, best: 17085 },
            { season: 'S3', wins: 26, current: 15926, best: 18040 },
            { season: 'S2', wins: 100, current: 19014, best: 20101 },
            { season: 'S1', wins: 45, current: 12012, best: 13213 }
        ],
        csgo: { wins: 344, currentRank: null, bestRank: 16 }
    });
});

test('base page without Premier nor CS:GO ranks', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base-no-ranks.html')), EMPTY);
});

test('base page of a player without data', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-base-empty.html')), EMPTY);
});

test('Cloudflare block page yields no data', () => {
    assert.deepEqual(parseCSStatsBase(fixture('csstats-cloudflare-blocked.html')), EMPTY);
});

test('rating values are never taken from markup', () => {
    const html = '<span class="sec-t">Premier</span><span class="sec-s">Season 5</span><div class="pm-now"><div class="pm-c"><span class="k">Current</span><span class="v"><div class="cs2rating"><span>&lt;img src=x onerror=alert(1)&gt;<small>,235</small></span></div></span></div></div>';

    assert.deepEqual(parseCSStatsBase(html).premierSeasons, []);
});

test('Premier seasons stop at the next section even with extra classes', () => {
    const html = fixture('csstats-base.html').replace(/<div class="sec">(\s*<div class="rk-row fc)/, '<div class="sec sec-ranks">$1');

    assert.notEqual(html, fixture('csstats-base.html'));
    assert.deepEqual(parseCSStatsBase(html).premierSeasons.map(({ season }) => season), ['Season 5', 'S4', 'S3', 'S2', 'S1']);
});

test('blank season names are dropped', () => {
    const html = fixture('csstats-base.html').replace('<span class="sec-s">Season 5', '<span class="sec-s">   ');

    assert.deepEqual(parseCSStatsBase(html).premierSeasons.map(({ season }) => season), ['S4', 'S3', 'S2', 'S1']);
});
