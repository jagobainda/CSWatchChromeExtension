import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchResource } from '../src/scripts/http.js';

const RESOURCE_URL = 'https://example.invalid/resource';

for (const [status, code] of [
    [403, 'blocked'],
    [429, 'blocked'],
    [404, 'not_found'],
    [500, 'http']
]) {
    test(`HTTP ${status} is reported as ${code}`, async (context) => {
        context.mock.method(globalThis, 'fetch', async () => new Response('', { status }));

        await assert.rejects(fetchResource(RESOURCE_URL, 'text'), { message: code });
    });
}

test('timeout is reported as timeout', async (context) => {
    context.mock.method(globalThis, 'fetch', async () => {
        throw new DOMException('The operation timed out.', 'TimeoutError');
    });

    await assert.rejects(fetchResource(RESOURCE_URL, 'json'), { message: 'timeout' });
});

test('successful response is read with the requested method', async (context) => {
    context.mock.method(globalThis, 'fetch', async () => Response.json({ ok: true }));

    assert.deepEqual(await fetchResource(RESOURCE_URL, 'json'), { ok: true });
});
