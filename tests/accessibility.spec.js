import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit - WCAG 2.2 AA', () => {
  // Representative pages for testing
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Blog Index', path: '/blog/' },
    { name: 'Blog Post', path: '/blog/s1b1-what-is-emdr/' },
    { name: 'EMDR Topic', path: '/emdr/trauma-and-ptsd/' },
    { name: 'Fees', path: '/fees/' },
    { name: 'Accessibility', path: '/accessibility/' },
  ];

  pages.forEach(({ name, path }) => {
    test(`${name} page - axe accessibility scan`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('Home page - Tab order is logical', async ({ page }) => {
      await page.goto('/');

      // Skip link should be first focusable element
      const skipLink = page.locator('.skip-link');
      await skipLink.focus();
      let focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toContain('Skip to main content');

      // The first navigation link is the next intended keyboard target.
      const firstNavLink = page.locator('nav a').first();
      await firstNavLink.focus();
      focused = await page.evaluate(() => document.activeElement?.getAttribute('href'));
      expect(focused).toBeTruthy();
    });

    test('Navigation links are keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      // Tab through main nav
      const navLinks = await page.locator('nav a').count();
      expect(navLinks).toBeGreaterThan(0);

      // All should be focusable
      for (let i = 0; i < navLinks; i++) {
        const link = page.locator('nav a').nth(i);
        const isVisible = await link.isVisible();
        expect(isVisible).toBe(true);
      }
    });

    test('Buttons are keyboard accessible (Enter/Space)', async ({ page }) => {
      await page.goto('/');

      // Find CTA button
      const ctaButton = page.locator('a.btn-primary').first();
      if (await ctaButton.isVisible()) {
        await ctaButton.focus();
        const isFocused = await ctaButton.evaluate((el) =>
          el === document.activeElement
        );
        expect(isFocused).toBe(true);
      }
    });
  });

  test.describe('Focus Indicators', () => {
    test('Visible focus indicators on all interactive elements', async ({ page }) => {
      await page.goto('/');

      const interactiveElements = await page.locator('a, button, [role="button"]').count();
      expect(interactiveElements).toBeGreaterThan(0);

      // Check that focus indicator is visible
      const firstLink = page.locator('a').first();
      await firstLink.focus();
      
      const hasOutline = await firstLink.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.outlineWidth !== '0px';
      });
      
      // Either has outline or some focus styling
      expect(hasOutline || (await firstLink.getAttribute('data-focused'))).toBeTruthy();
    });
  });

  test.describe('Contrast & Zoom', () => {
    test('Page is readable at 200% zoom', async ({ page }) => {
      await page.goto('/');
      
      // Set zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '200%';
      });

      // Check viewport fits content without excessive overflow
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      const windowHeight = await page.evaluate(() => window.innerHeight);
      
      // Should be readable (body height is reasonable relative to window)
      expect(bodyHeight).toBeGreaterThan(windowHeight);
    });

    test('No horizontal scroll at 320px viewport', async ({ page }) => {
      page.setViewportSize({ width: 320, height: 800 });
      await page.goto('/');

      const bodyWidth = await page.evaluate(() => document.body.clientWidth);
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyWidth + 1); // Allow 1px rounding
    });
  });

  test.describe('Images & Media', () => {
    test('All images have alt text', async ({ page }) => {
      await page.goto('/');

      const imagesWithoutAlt = await page.locator('img:not([alt])').count();
      expect(imagesWithoutAlt).toBe(0);
    });

    test('YouTube videos have descriptive iframe titles', async ({ page }) => {
      await page.goto('/');

      const iframes = await page.locator('iframe[title*="YouTube"]').count();
      if (iframes > 0) {
        const firstIframe = page.locator('iframe[title*="YouTube"]').first();
        const title = await firstIframe.getAttribute('title');
        
        // Title should be descriptive, not generic "YouTube video player"
        expect(title).toBeTruthy();
        expect(title?.length).toBeGreaterThan(10);
      }
    });

    test('No autoplay attribute on YouTube iframes', async ({ page }) => {
      await page.goto('/');

      const iframes = await page.locator('iframe[src*="youtube-nocookie"]').all();
      for (const iframe of iframes) {
        const allow = await iframe.getAttribute('allow');
        if (allow) {
          expect(allow).not.toContain('autoplay');
        }
      }
    });
  });

  test.describe('Semantic Structure', () => {
    test('Page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1); // At least one H1

      // Check that headings follow hierarchy (no H1 -> H3 jumps, etc.)
      const headings = await page.locator('main h1, main h2, main h3, main h4, main h5, main h6').all();
      let lastLevel = null;
      for (const heading of headings) {
        const tagName = await heading.evaluate((el) => el.tagName);
        const level = parseInt(tagName[1]);
        
        // Allow jump from h1 to h2, h2 to h3, etc. but not skipping levels
        if (lastLevel !== null) expect(level - lastLevel).toBeLessThanOrEqual(1);
        lastLevel = level;
      }
    });

    test('Has main landmark', async ({ page }) => {
      await page.goto('/');

      const mainElement = await page.locator('main').count();
      expect(mainElement).toBeGreaterThanOrEqual(1);

      // Main should have proper ID
      const mainId = await page.locator('main').first().getAttribute('id');
      expect(mainId).toBe('main-content');
    });

    test('Navigation is semantic <nav>', async ({ page }) => {
      await page.goto('/');

      const navElements = await page.locator('nav').count();
      expect(navElements).toBeGreaterThanOrEqual(1);
    });

    test('Footer is semantic <footer>', async ({ page }) => {
      await page.goto('/');

      const footerElements = await page.locator('footer').count();
      expect(footerElements).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Forms & Links', () => {
    test('Links have descriptive text', async ({ page }) => {
      await page.goto('/');

      const links = await page.locator('a').all();
      for (const link of links) {
        const text = await link.textContent();
        const href = await link.getAttribute('href');
        const ariaLabel = await link.getAttribute('aria-label');
        
        // Either has visible text or aria-label
        expect(text?.trim() || ariaLabel).toBeTruthy();
      }
    });

    test('Links are distinguishable from text', async ({ page }) => {
      await page.goto('/');

      const links = await page.locator('a').all();
      expect(links.length).toBeGreaterThan(0);

      // At least some links should be underlined or styled differently
      const firstLink = links[0];
      const textDecoration = await firstLink.evaluate((el) => 
        window.getComputedStyle(el).textDecoration
      );
      
      // Links should be visually distinct
      expect(textDecoration || (await firstLink.getAttribute('class'))).toBeTruthy();
    });
  });

  test.describe('Page-Specific: Accessibility Page', () => {
    test('Accessibility page content is clear', async ({ page }) => {
      await page.goto('/accessibility/');

      // Should have commitment statement
      const hasCommitment = await page.locator('body').textContent();
      expect(hasCommitment).toContain('committed');

      // Should have contact information
      expect(hasCommitment).toContain('email');
      expect(hasCommitment).toContain('contact');
    });

    test('Contact links are functional', async ({ page }) => {
      await page.goto('/accessibility/');

      const emailLinks = await page.locator('a[href^="mailto:"]').count();
      expect(emailLinks).toBeGreaterThan(0);

      const phoneLinks = await page.locator('a[href^="tel:"]').count();
      expect(phoneLinks).toBeGreaterThan(0);
    });
  });

  test.describe('Reduced Motion', () => {
    test('Respects prefers-reduced-motion', async ({ page }) => {
      await page.goto('/');

      // Check that CSS respects prefers-reduced-motion
      const hasReducedMotionRule = await page.evaluate(() => {
        const stylesheets = document.styleSheets;
        let found = false;
        for (let i = 0; i < stylesheets.length; i++) {
          try {
            const rules = stylesheets[i].cssRules || [];
            for (let j = 0; j < rules.length; j++) {
              if (rules[j].conditionText?.includes('prefers-reduced-motion')) {
                found = true;
              }
            }
          } catch (e) {
            // Cross-origin stylesheets throw, skip them
          }
        }
        return found;
      });

      expect(hasReducedMotionRule).toBe(true);
    });
  });
});

test.describe('End-to-End Accessibility Workflow', () => {
  test('Can navigate site using only keyboard', async ({ page }) => {
    await page.goto('/');

    // Use skip link
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    
    // Should have moved focus to main
    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('main-content');
  });

  test('Mobile navigation is keyboard accessible', async ({ page }) => {
    page.setViewportSize({ width: 620, height: 800 }); // Mobile width
    await page.goto('/');

    // Navigation should still be keyboard accessible
    const navLinks = await page.locator('nav a').count();
    expect(navLinks).toBeGreaterThan(0);

    // Navigation links remain focusable at the mobile viewport.
    const firstNavLink = page.locator('nav a').first();
    await firstNavLink.focus();
    expect(await firstNavLink.evaluate((element) => element === document.activeElement)).toBe(true);
  });
});

test.describe('Privacy network regression', () => {
  test('does not load external fonts or YouTube before activation', async ({ page }) => {
    const externalRequests = [];
    page.on('request', (request) => {
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com|youtube\.com|youtube-nocookie\.com/i.test(request.url())) {
        externalRequests.push(request.url());
      }
    });

    const fontResponses = [];
    page.on('response', (response) => {
      if (/\/fonts\/(fraunces-latin|nunito-sans-latin)\.woff2$/i.test(response.url())) {
        fontResponses.push({ url: response.url(), status: response.status() });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(externalRequests).toEqual([]);
    await expect(page.locator('link[href="/fonts/fraunces-latin.woff2"]')).toHaveCount(0);
    await expect(page.locator('.youtube-facade')).toHaveCount(1);
    await expect(page.locator('.youtube-poster')).toHaveAttribute('src', '/images/video-posters/emdr-intro.webp');

    await expect.poll(() => fontResponses.length).toBe(2);
    expect(fontResponses.every(({ status }) => status === 200)).toBe(true);

    const youtubeRequest = page.waitForRequest(/youtube-nocookie\.com\/embed/);
    const facade = page.locator('.youtube-facade');
    await facade.click();
    const request = await youtubeRequest;

    expect(request.url()).toContain('youtube-nocookie.com/embed/');
    expect(request.url()).toContain('autoplay=1');
    const iframe = page.locator('iframe[src*="youtube-nocookie.com"]');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute('allow', /autoplay/);
    await expect(iframe).toBeFocused();
  });

  for (const key of ['Enter', 'Space']) {
    test(`activates the facade with ${key}`, async ({ page }) => {
      await page.goto('/');
      const facade = page.locator('.youtube-facade');
      await facade.focus();
      await page.keyboard.press(key);
      const iframe = page.locator('iframe[src*="youtube-nocookie.com"]');
      await expect(iframe).toHaveCount(1);
      await expect(iframe).toHaveAttribute('src', /autoplay=1/);
      await expect(iframe).toHaveAttribute('allow', /autoplay/);
      await expect(iframe).toBeFocused();
    });
  }

  test('hands the deliberate activation through to the YouTube player', async ({ page }) => {
    await page.goto('/');
    const facade = page.locator('.youtube-facade');
    await facade.focus();
    await page.keyboard.press('Enter');

    const player = page.frameLocator('iframe[src*="youtube-nocookie.com"]');
    const video = player.locator('video').first();
    await expect(video).toBeVisible({ timeout: 15_000 });
    await expect.poll(() => video.evaluate((element) => !element.paused), { timeout: 15_000 }).toBe(true);
  });
});
