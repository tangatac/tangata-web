import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Cloudflare build includes both permanent EMDR redirects unchanged', () => {
  const source = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
  const built = readFileSync(new URL('../dist/_redirects', import.meta.url), 'utf8');
  assert.equal(built, source, 'Astro must copy redirect rules into the deployed assets directory');
  const rules = built.split(/\r?\n/).map(line => line.trim())
    .filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
  for (const path of ['/emdr-therapy/', '/emdr-therapy']) {
    const matching = rules.filter(([from]) => from === path);
    assert.deepEqual(matching, [[path, '/emdr/', '301']]);
  }
  const destination = readFileSync(new URL('../dist/emdr/index.html', import.meta.url), 'utf8');
  assert.match(destination, /EMDR Therapy in Bristol/);
  assert.match(destination, /const analyticsPageId = "002"/);
});

// Optional HTTP integration against `wrangler dev --local --port 3001`.
// Astro preview does not implement Cloudflare's _redirects processing.
test('Cloudflare runtime returns one-hop HTTP 301s to the EMDR overview', {
  skip: !process.env.CLOUDFLARE_TEST_ORIGIN,
}, async () => {
  const origin = process.env.CLOUDFLARE_TEST_ORIGIN;
  for (const path of ['/emdr-therapy/', '/emdr-therapy']) {
    const response = await fetch(new URL(path, origin), { redirect: 'manual' });
    assert.equal(response.status, 301);
    const destination = new URL(response.headers.get('location'), origin);
    assert.equal(destination.origin, new URL(origin).origin);
    assert.equal(destination.pathname, '/emdr/');
    const final = await fetch(destination, { redirect: 'manual' });
    assert.equal(final.status, 200, 'Destination must not introduce another redirect');
    assert.match(await final.text(), /const analyticsPageId = "002"/);
  }
  assert.equal((await fetch(new URL('/not-a-real-route/', origin), { redirect: 'manual' })).status, 404);
  assert.equal((await fetch(new URL('/blog/', origin), { redirect: 'manual' })).status, 200);
});
