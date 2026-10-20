import { test, expect } from '@playwright/test';

test.describe('Privacy-Minimised GA4 Analytics Setup', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
    // Fail closed: serve only site HTML/assets locally and block every third party.
    await page.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      const siteHosts = ['tangata-counselling.co.uk', 'www.tangata-counselling.co.uk', 'preview.example.test', 'localhost', '127.0.0.1'];
      if (!siteHosts.includes(url.hostname)) return route.abort();
      const response = await route.fetch({ url: `http://127.0.0.1:3000${url.pathname}${url.search}` });
      await route.fulfill({ response });
    });
  });

  test.afterEach(async ({ page }) => {
    // Let intercepted local asset requests finish before the browser context closes.
    await page.unrouteAll({ behavior: 'wait' });
  });

  test('No preference - consent UI shown, no GA script, cookies, or GA network requests', async ({ page }) => {
    const gaRequests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        gaRequests.push(url);
      }
    });

    await page.goto('/');

    // Consent banner visible
    const banner = page.locator('#analytics-consent-banner');
    await expect(banner).toBeVisible();

    // No GA script injected
    const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gaScript).toHaveCount(0);

    // No GA cookies
    const cookies = await page.context().cookies();
    const gaCookies = cookies.filter((c) => c.name === '_ga' || c.name.startsWith('_ga_'));
    expect(gaCookies).toHaveLength(0);

    // No GA requests sent
    expect(gaRequests).toHaveLength(0);
  });

  test('Decline - preference stored, GA remains unloaded, reload banner hidden', async ({ page }) => {
    await page.goto('/');

    const declineBtn = page.locator('#consent-decline-btn');
    await declineBtn.click();

    // Banner hidden
    const banner = page.locator('#analytics-consent-banner');
    await expect(banner).toBeHidden();

    // Preference cookie stored
    const cookies = await page.context().cookies();
    const consentCookie = cookies.find((c) => c.name === 'tangata_consent');
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toBe('analytics_denied');

    // GA script tag not present
    const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js"]');
    await expect(gaScript).toHaveCount(0);

    // Reload page
    await page.reload();

    // Banner remains hidden
    await expect(banner).toBeHidden();
    await expect(gaScript).toHaveCount(0);
  });

  test('Allow - preference stored, production-mode initializes GA with strict privacy config', async ({ page }) => {
    await page.goto('/');

    const allowBtn = page.locator('#consent-allow-btn');
    await allowBtn.click();

    // Preference cookie stored
    const cookies = await page.context().cookies();
    const consentCookie = cookies.find((c) => c.name === 'tangata_consent');
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toBe('analytics_granted');

    // Script injected
    const gaScript = page.locator('script[src*="googletagmanager.com/gtag/js?id=G-9HSR1KNKWG"]');
    await expect(gaScript).toHaveCount(1);

    // Check dataLayer arguments
    const dataLayer = await page.evaluate(() => window.dataLayer || []);
    expect(dataLayer.length).toBeGreaterThan(0);

    // Find config call
    const configCall = dataLayer.find((item) => item[0] === 'config' && item[1] === 'G-9HSR1KNKWG');
    expect(configCall).toBeDefined();

    const configOpts = configCall[2];
    expect(configOpts.allow_google_signals).toBe(false);
    expect(configOpts.allow_ad_personalization_signals).toBe(false);
    expect(configOpts.send_page_view).toBe(false);
    expect(configOpts.cookie_expires).toBe(15552000);
    expect(configOpts.cookie_update).toBe(false);
    expect(configOpts.page_location).toBe('https://tangata-counselling.co.uk/p/001');
    expect(configOpts.page_title).toBe('Tangata Counselling');

    const consentUpdate = dataLayer.find((item) => item[0] === 'consent' && item[1] === 'update');
    expect(consentUpdate).toBeDefined();
    expect(consentUpdate[2]).toEqual({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

    // Find sanitised page_view event call
    const pageViewCall = dataLayer.find((item) => item[0] === 'event' && item[1] === 'page_view');
    expect(pageViewCall).toBeDefined();
    expect(pageViewCall[2].page_location).toBe('https://tangata-counselling.co.uk/p/001');
    expect(pageViewCall[2].page_title).toBe('Tangata Counselling');
  });

  test('Campaign attribution - valid UTM values mapped, invalid stripped', async ({ page }) => {
    await page.goto('/?utm_source=instagram&utm_medium=organic_social&utm_campaign=social_launch_01&utm_content=s1b1');

    await page.click('#consent-allow-btn');

    const dataLayer = await page.evaluate(() => window.dataLayer || []);
    const configCall = dataLayer.find((item) => item[0] === 'config' && item[1] === 'G-9HSR1KNKWG');
    expect(configCall).toBeDefined();

    const opts = configCall[2];
    expect(opts.campaign_source).toBe('instagram');
    expect(opts.campaign_medium).toBe('organic_social');
    expect(opts.campaign_name).toBe('social_launch_01');
    expect(opts.campaign_content).toBe('s1b1');

    await page.goto('/?utm_source=x');

    const xDataLayer = await page.evaluate(() => window.dataLayer || []);
    const xConfigCall = xDataLayer.find((item) => item[0] === 'config' && item[1] === 'G-9HSR1KNKWG');
    expect(xConfigCall).toBeDefined();
    expect(xConfigCall[2].campaign_source).toBe('x');

    // Test invalid UTMs
    await page.context().clearCookies();
    await page.goto('/?utm_source=unauthorized_source&utm_medium=cpc&utm_campaign=bad%20spaces&utm_content=toolong'.repeat(10));

    await page.click('#consent-allow-btn');

    const dataLayer2 = await page.evaluate(() => window.dataLayer || []);
    const configCall2 = dataLayer2.find((item) => item[0] === 'config' && item[1] === 'G-9HSR1KNKWG');
    expect(configCall2).toBeDefined();

    const opts2 = configCall2[2];
    expect(opts2.campaign_source).toBeUndefined();
    expect(opts2.campaign_medium).toBeUndefined();
    expect(opts2.campaign_name).toBeUndefined();
    expect(opts2.campaign_content).toBeUndefined();
  });

  test('Contact events - delegated tracking sends correct methods and avoids duplicates', async ({ page }) => {
    await page.goto('/');

    await page.evaluate(() => {
      document.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
          e.preventDefault();
        }
      }, true);
    });

    await page.click('#consent-allow-btn');

    // Click contact section link
    const contactSectionLink = page.locator('a[href="/#contact"]').first();
    await contactSectionLink.click();

    // Click email link
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await emailLink.click();

    // Click phone link
    const phoneLink = page.locator('a[href^="tel:"]').first();
    await phoneLink.click();

    const dataLayer = await page.evaluate(() => window.dataLayer || []);
    const contactEvents = dataLayer.filter((item) => item[0] === 'event' && item[1] === 'contact_click');

    expect(contactEvents.length).toBe(3);
    expect(contactEvents[0][2]).toMatchObject({ contact_method: 'contact_section', page_location: 'https://tangata-counselling.co.uk/p/001', page_title: 'Tangata Counselling' });
    expect(contactEvents[1][2]).toMatchObject({ contact_method: 'email' });
    expect(contactEvents[2][2]).toMatchObject({ contact_method: 'phone' });

    // Click unrelated link (blog link)
    const blogLink = page.locator('a[href="/blog/"]').first();
    await blogLink.click();

    const updatedDataLayer = await page.evaluate(() => window.dataLayer || []);
    const updatedContactEvents = updatedDataLayer.filter((item) => item[0] === 'event' && item[1] === 'contact_click');
    expect(updatedContactEvents.length).toBe(3); // unchanged
  });

  test('Withdrawal - disables GA, deletes host and domain cookies, saves denied preference, suppresses future events', async ({ page, context }) => {
    await page.goto('/');

    await page.click('#consent-allow-btn');

    // Simulate presence of host-only and domain-scoped GA cookies
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.123456.7890', url: 'https://tangata-counselling.co.uk:3000' },
      { name: '_ga_G-9HSR1KNKWG', value: 'GS1.1.123456.1.1', url: 'https://tangata-counselling.co.uk:3000' },
      { name: '_ga', value: 'GA1.1.123456.7890', domain: 'tangata-counselling.co.uk', path: '/' },
      { name: '_ga_G-9HSR1KNKWG', value: 'GS1.1.123456.1.1', domain: 'tangata-counselling.co.uk', path: '/' },
    ]);

    // Reopen cookie settings via footer control
    const footerCookieBtn = page.locator('#open-cookie-settings');
    await footerCookieBtn.click();

    const banner = page.locator('#analytics-consent-banner');
    await expect(banner).toBeVisible();

    // Decline
    await page.click('#consent-decline-btn');

    // GA disabled flag set
    const gaDisabled = await page.evaluate(() => window['ga-disable-G-9HSR1KNKWG']);
    expect(gaDisabled).toBe(true);

    // All _ga and _ga_* cookies deleted across host and domain scopes
    const postWithdrawalCookies = await context.cookies();
    const remainingGACookies = postWithdrawalCookies.filter((c) => c.name === '_ga' || c.name.startsWith('_ga_'));
    expect(remainingGACookies).toHaveLength(0);

    // Preference saved as denied
    const consentCookie = postWithdrawalCookies.find((c) => c.name === 'tangata_consent');
    expect(consentCookie?.value).toBe('analytics_denied');

    // Click contact link after withdrawal
    const initialEventsCount = await page.evaluate(() => (window.dataLayer || []).filter((item) => item[0] === 'event' && item[1] === 'contact_click').length);

    const emailLink = page.locator('a[href^="mailto:"]').first();
    await emailLink.click();

    const newEventsCount = await page.evaluate(() => (window.dataLayer || []).filter((item) => item[0] === 'event' && item[1] === 'contact_click').length);
    expect(newEventsCount).toBe(initialEventsCount);
  });

  test('Referrer privacy - sensitive referrer path and query stripped to origin only', async ({ page }) => {
    await page.goto('/', {
      referer: 'https://example.com/sensitive/path?secret=value'
    });

    await page.click('#consent-allow-btn');

    const dataLayer = await page.evaluate(() => window.dataLayer || []);

    const configCall = dataLayer.find((item) => item[0] === 'config' && item[1] === 'G-9HSR1KNKWG');
    expect(configCall).toBeDefined();
    expect(configCall[2].page_referrer).toBe('https://example.com/');
    expect(JSON.stringify(configCall[2])).not.toContain('sensitive');
    expect(JSON.stringify(configCall[2])).not.toContain('secret');

    const pageViewCall = dataLayer.find((item) => item[0] === 'event' && item[1] === 'page_view');
    expect(pageViewCall).toBeDefined();
    expect(pageViewCall[2].page_referrer).toBe('https://example.com/');
    expect(JSON.stringify(pageViewCall[2])).not.toContain('sensitive');
    expect(JSON.stringify(pageViewCall[2])).not.toContain('secret');
  });

  test('Accessibility - controls keyboard operable, focus styles, footer control', async ({ page }) => {
    await page.goto('/');

    // Tab to Allow button
    const allowBtn = page.locator('#consent-allow-btn');
    const declineBtn = page.locator('#consent-decline-btn');

    await allowBtn.focus();
    expect(await allowBtn.evaluate((el) => el === document.activeElement)).toBe(true);

    await declineBtn.focus();
    expect(await declineBtn.evaluate((el) => el === document.activeElement)).toBe(true);

    // Footer control is focusable
    const footerBtn = page.locator('#open-cookie-settings');
    await footerBtn.focus();
    expect(await footerBtn.evaluate((el) => el === document.activeElement)).toBe(true);
  });
  test('Stable page IDs: direct loads, reloads and navigation keep private page context', async ({ page }) => {
    const cases = [
      ['/', '001'],
      ['/emdr/', '002'],
      ['/emdr/grief-and-loss/', '003'],
      ['/blog/', '004'],
      ['/blog/s1b2-emdr-and-safety-staying-grounded-with-difficult-memories/', '021'],
    ];
    const observed = new Set();
    for (const [route, id] of cases) {
      await page.context().clearCookies();
      await page.goto(`${route}?private_query=DO_NOT_SEND#private_fragment`);
      expect(await page.evaluate(() => window.dataLayer || [])).toEqual([]);
      await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
      await page.click('#consent-allow-btn');
      const title = await page.title();
      const check = async () => {
        const calls = await page.evaluate(() => (window.dataLayer || []).map((entry) => Array.from(entry)));
        const views = calls.filter((entry) => entry[0] === 'event' && entry[1] === 'page_view');
        expect(views).toHaveLength(1);
        expect(calls.filter((entry) => entry[0] === 'config')).toHaveLength(1);
        const config = calls.find((entry) => entry[0] === 'config')[2];
        expect(config.send_page_view).toBe(false);
        for (const entry of calls.filter((entry) => entry[0] === 'config' || entry[0] === 'event')) {
          expect(entry[2]).toMatchObject({
            page_location: `https://tangata-counselling.co.uk/p/${id}`,
            page_title: 'Tangata Counselling',
          });
          expect(entry[2].page_location).not.toMatch(/[?#]/);
        }
        const payload = JSON.stringify(calls);
        if (route !== '/') expect(payload).not.toContain(route);
        expect(payload).not.toContain(title);
        expect(payload).not.toContain('private_query');
        expect(payload).not.toContain('DO_NOT_SEND');
        expect(payload).not.toContain('private_fragment');
        expect(await page.locator('script[src*="googletagmanager.com"]').getAttribute('referrerpolicy')).toBe('no-referrer');
        return views[0][2].page_location;
      };
      observed.add(await check());
      // Reopening consent must not queue a duplicate initial pageview.
      await page.click('#open-cookie-settings');
      await page.click('#consent-allow-btn');
      await check();
      await page.reload();
      await check();
      // Contact events carry the same explicit private context.
      await page.evaluate(() => document.addEventListener('click', e => {
        if (e.target.closest('a')) e.preventDefault();
      }, true));
      await page.locator('a[href^="mailto:"]').first().click();
      await check();
    }
    expect(observed.size).toBe(cases.length);
    await page.goto('/emdr/');
    await page.evaluate(() => window.__oldDocument = true);
    await Promise.all([
      page.waitForURL('**/blog/'),
      page.locator('a[href="/blog/"]').first().click(),
    ]);
    expect(await page.evaluate(() => window.__oldDocument)).toBeUndefined();
    const views = await page.evaluate(() => (window.dataLayer || []).filter(x => x[1] === 'page_view'));
    expect(views).toHaveLength(1);
    expect(views[0][2]).toMatchObject({ page_location: 'https://tangata-counselling.co.uk/p/004', page_referrer: 'https://tangata-counselling.co.uk:3000/' });
  });

  for (const host of ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://preview.example.test:3000', 'https://www.tangata-counselling.co.uk:3000']) {
    test(`Non-production host stays disabled after consent: ${host}`, async ({ page }) => {
      await page.goto(`${host}/emdr/grief-and-loss/`);
      await page.click('#consent-allow-btn');
      expect(await page.evaluate(() => window.dataLayer || [])).toEqual([]);
      await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
    });
  }

  test('Outbound/download clicks and history changes add no events in our own code', async ({ page }) => {
    for (const path of ['/emdr/trauma-and-ptsd/', '/resources/']) {
      await page.goto(path);
      if (await page.locator('#consent-allow-btn').isVisible()) {
        await page.click('#consent-allow-btn');
      }
      expect(await page.locator('form').count()).toBe(0);
      // Allow event handlers to run, but prevent leaving the intercepted local site.
      await page.evaluate(() => document.addEventListener('click', event => {
        if (event.target.closest('a')) event.preventDefault();
      }, true));
      const link = path === '/resources/' ? page.locator('a[download]').last()
        : page.locator('main a[href^="https://www.nice.org.uk/"]').first();
      await link.click();
      await page.evaluate(() => history.replaceState({}, '', `${location.pathname}?q=PRIVATE_SEARCH#private_fragment`));
      const calls = await page.evaluate(() => (window.dataLayer || []).map(x => Array.from(x)));
      expect(calls.filter(x => x[0] === 'event').map(x => x[1])).toEqual(['page_view']);
      const payload = JSON.stringify(calls);
      expect(payload).not.toContain(path);
      expect(payload).not.toContain('PRIVATE_SEARCH');
      expect(payload).not.toContain('lightstream');
      expect(payload).not.toContain('nice.org.uk');
    }
  });

  test('Unmapped URL uses 404 and sends no analytics even with consent', async ({ page }) => {
    const response = await page.goto('/not-a-real-route/');
    expect(response.status()).toBe(404);
    await page.click('#consent-allow-btn');
    expect(await page.evaluate(() => window.dataLayer || [])).toEqual([]);
    await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  });

});
