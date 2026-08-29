# Tangata Counselling website

Built with [Astro](https://astro.build). The site is static HTML — fast, and
nothing to maintain server-side. Blog posts are plain Markdown files.

## Adding or editing a blog post

Blog posts live in [`src/content/blog/`](src/content/blog/). Each `.md` file is
one post, and the file name becomes the URL (`grounding-techniques.md` →
`/blog/grounding-techniques`).

**There is a full walkthrough on the site itself:** the post
["How to write a new blog post"](src/content/blog/writing-a-new-blog-post.md) is
both documentation and a copy-paste template. Start there.

The essentials:

```markdown
---
title: Your headline
description: One or two sentences, shown on cards and in search results.
date: 2026-09-15
category: Wellbeing
draft: false
---

Your article, in Markdown.
```

- **Images** — drop the file in [`public/images/`](public/images/) and reference
  it as `![alt text](/images/your-file.jpg)`.
- **Videos** — YouTube links only. Put `youtube: <link>` in the frontmatter for a
  video at the top of the post, or paste a YouTube link on its own line in the
  body for one partway through.
- **Drafts** — set `draft: true` to keep a post off the live site until it's
  ready.

### Publishing

Commit and push to `main`. Cloudflare rebuilds and deploys automatically.

## Local development

```bash
npm install     # once
npm run dev      # start a local preview at http://localhost:4321
npm run build    # build the production site into dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  content/blog/      the blog posts (Markdown) — this is what the client edits
  content.config.ts  defines the frontmatter fields a post can have
  pages/             index.astro (home), blog/index.astro (list), blog/[...slug].astro (post)
  layouts/           BaseLayout.astro — the shared page shell
  components/         Nav, Footer, YouTube
  styles/global.css  all site styling
  lib/               small helpers (date formatting, YouTube parsing, Markdown plugins)
public/              static files served as-is (images, favicon)
```

## Deployment (Cloudflare)

The site is served by the existing `tangata-web` Cloudflare Worker (static
assets, config in [`wrangler.jsonc`](wrangler.jsonc)).

In the Cloudflare dashboard, under the Worker's **Build** / **Builds** settings,
connect this GitHub repo and set:

| Setting                 | Value           |
| ----------------------- | --------------- |
| Build command           | `npm run build` |
| Deploy command          | `npx wrangler deploy` |
| Build output / root dir | (repo root)     |

Astro builds to `dist/`, which `wrangler.jsonc` already points at. Pushes to
`main` then build and deploy automatically.

(Alternatively, deploy as a Cloudflare Pages project: framework preset **Astro**,
build command `npm run build`, output directory `dist`.)

Check build log for error
