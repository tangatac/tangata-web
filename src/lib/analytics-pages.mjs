import pages from '../data/analytics-pages.json' with { type: 'json' };

// Build-time only: never import this module from a browser script.
const ids = new Set();
const routes = new Map();
for (const { id, route } of pages) {
  if (!/^\d{3,}$/.test(id) || ids.has(id) || routes.has(route) || !/^\/(?:[^?#]*\/)?$/.test(route)) {
    throw new Error(`Invalid or duplicate analytics page mapping: ${id} ${route}`);
  }
  ids.add(id);
  routes.set(route, id);
}

export function getAnalyticsPageId(pathname) {
  const route = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return routes.get(route) ?? null;
}
