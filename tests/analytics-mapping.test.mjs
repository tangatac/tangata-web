import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAnalyticsPageId } from '../src/lib/analytics-pages.mjs';

const pages = JSON.parse(readFileSync(new URL('../src/data/analytics-pages.json', import.meta.url)));
const root = new URL('../dist/', import.meta.url);
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

test('Every generated page except 404 has exactly one explicit, stable mapping', () => {
  // fileURLToPath handles Windows drive letters and spaces.
  const routes = htmlFiles(fileURLToPath(root)).filter(file => !file.endsWith(`${sep}404.html`)).map(file => {
    const path = relative(fileURLToPath(root), file).split(sep).join('/');
    assert.ok(path.endsWith('index.html'), `Unexpected generated HTML: ${path}`);
    return `/${path.slice(0, -'index.html'.length)}`;
  });
  assert.deepEqual(routes.sort(), pages.map(page => page.route).sort());
  for (const { id, route } of pages) {
    assert.equal(getAnalyticsPageId(route), id);
    assert.equal(getAnalyticsPageId(route === '/' ? '/' : route.slice(0, -1)), id);
    const html = readFileSync(new URL(`.${route}index.html`, root), 'utf8');
    assert.ok(html.includes(`const analyticsPageId = "${id}"`));
    assert.ok(!html.includes('"route":'), 'Full mapping must not be embedded in HTML');
  }
  assert.equal(getAnalyticsPageId('/unknown/'), null);
  assert.equal(getAnalyticsPageId('/404/'), null);
  assert.equal(getAnalyticsPageId('/emdr-therapy/'), null);
});

test('Established identifiers cannot shift when the registry grows', () => {
  assert.equal(getAnalyticsPageId('/'), '001');
  assert.equal(getAnalyticsPageId('/emdr/'), '002');
  assert.equal(getAnalyticsPageId('/emdr/grief-and-loss/'), '003');
  assert.equal(getAnalyticsPageId('/blog/'), '004');
  assert.equal(getAnalyticsPageId('/blog/s1b2-emdr-and-safety-staying-grounded-with-difficult-memories/'), '021');
});

