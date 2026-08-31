// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime, remarkYouTube } from './src/lib/remark-plugins.mjs';

// https://astro.build/config
export default defineConfig({
  // Used to build absolute URLs (sitemap, social tags). Update if the live domain changes.
  site: 'https://tangata-counselling.co.uk',
  // Canonical URLs, internal links and the sitemap all use a trailing slash.
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    // These run on every blog post:
    //  - remarkReadingTime: adds an automatic "x min read" estimate
    //  - remarkYouTube: turns a YouTube link on its own line into an embedded player
    remarkPlugins: [remarkReadingTime, remarkYouTube],
  },
});
