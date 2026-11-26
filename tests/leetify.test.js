import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mapLeetifySummary } from '../src/scripts/leetify.js';
import { fetchResource } from '../src/scripts/http.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

test('summary with positive z-scores', () => {
    assert.deepEqual(mapLeetifySummary(JSON.parse(fixture('leetify-summary.json'))), {
        leetifyRating: { value: '+3.73', zScore: 2, average: '+0.00' },
        aimRating: { value: '97', zScore: 1, average: '76' },
        utilityRating: { value: '64', zScore: 0, average: '60' },
        crosshairPlacement: { value: '7.62°', zScore: 0, average: '7.24°' },
        timeToDamage: { value: '461ms', zScore: 0, average: '498ms' },
        headshotKills: { value: '47%', zScore: 2, average: '46%' },
        spottedAccuracy: { value: '39%', zScore: 0, average: '38%' },
        sprayAccuracy: { value: '39%', zScore: 0, average: '32%' },
        kd: { value: '1.35', zScore: 2, average: null },
        winRate: { value: '60%', zScore: 2, average: null }
    });
});

test('summary with negative z-scores', () => {
    const summary = mapLeetifySummary(JSON.parse(fixture('leetify-nocsgo-summary.json')));

    assert.deepEqual(summary.leetifyRating, { value: '-1.55', zScore: -2, average: '+0.00' });
    assert.deepEqual(summary.kd, { value: '0.92', zScore: -2, average: null });
    assert.deepEqual(summary.winRate, { value: '43%', zScore: -2, average: null });
    assert.deepEqual(summary.timeToDamage, { value: '520ms', zScore: 0, average: '535ms' });
    assert.deepEqual(summary.spottedAccuracy, { value: '40%', zScore: 1, average: '35%' });
});

test('ratings are found by title and unexpected values are dropped', () => {
    const summary = mapLeetifySummary({
        ratings: [
            { title: 'Utility Rating', value: '<img src=x onerror=alert(1)>', zScore: 7 },
            { title: 'Aim Rating', value: '50', zScore: 7.6 }
        ],
        kdRatio: { value: '1.00', zScore: 'high' }
    });

    assert.equal(summary.utilityRating, null);
    assert.deepEqual(summary.aimRating, { value: '50', zScore: 2, average: null });
    assert.deepEqual(summary.kd, { value: '1.00', zScore: null, average: null });
    assert.equal(summary.leetifyRating, null);
    assert.equal(summary.winRate, null);
});

test('plain text 404 is reported as not_found', async (context) => {
    context.mock.method(globalThis, 'fetch', async () => new Response(fixture('leetify-notfound.txt'), { status: 404, headers: { 'Content-Type': 'text/plain' } }));

    await assert.rejects(fetchResource('https://api.cs-prod.leetify.com/api/profile/76561197960287930/browser-extension-summary', 'json'), { message: 'not_found' });
});

test('missing summary maps to no metrics', () => {
    const summary = mapLeetifySummary(null);

    assert.deepEqual(summary, mapLeetifySummary({}));
    assert.equal(Object.keys(summary).length, 10);
    assert.ok(Object.values(summary).every((metric) => metric === null));
});
