import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseSteamMemberSince } from '../src/scripts/parsers/steam-parser.js';

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');

test('member since date from the years of service badge', () => {
    assert.equal(parseSteamMemberSince(fixture('steam-badge.html')), Date.UTC(2010, 10, 27));
});

test('missing badge yields null', () => {
    assert.equal(parseSteamMemberSince(fixture('steam-badge-missing.html')), null);
});
