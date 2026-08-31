---
title: How to write a new blog post
description: A short walkthrough for adding your own posts — this page is also a working example you can copy.
date: 2026-08-29
category: Guide
author: Nick Tuftnell
draft: false
---

This post is a demo. It explains, step by step, how to add a new article to the
site — and the file that produces it (`src/content/blog/writing-a-new-blog-post.md`)
is itself the example to copy. Once you've read it, you can delete this post by
deleting that file.

## The short version

1. In GitHub (or your editor with Copilot), create a new file in the folder
   `src/content/blog/`.
2. Name it with lowercase words and hyphens, ending in `.md` — for example
   `grounding-techniques.md`. **The file name becomes the web address**:
   `/blog/grounding-techniques`.
3. Paste the template below, change the details, write your article underneath.
4. Commit and push to the `main` branch. Cloudflare rebuilds the site
   automatically, usually within a minute or two.

## The template

Every post starts with a small block of settings between two `---` lines. This is
called the "frontmatter". Copy this exactly and edit the values:

```markdown
---
title: Grounding techniques you can use anywhere
description: Simple, discreet ways to bring yourself back to the present moment.
date: 2026-09-15
category: Wellbeing
author: Nick Tuftnell
draft: false
---

Your first paragraph goes here. It shows slightly larger, as an introduction.

## A heading

Normal paragraphs, **bold text**, _italic text_, and [links](https://example.com)
all work the way you'd expect.

- bullet points
- like this

### A smaller sub-heading

More text.
```

## What each setting means

| Setting       | Required? | What it does                                                                 |
| ------------- | --------- | --------------------------------------------------------------------------- |
| `title`       | Yes       | The headline, shown on the post and on cards linking to it.                 |
| `description` | Yes       | One or two sentences. Shown on the blog listing and in Google results.     |
| `date`        | Yes       | Format `YYYY-MM-DD`. Controls the order posts appear in (newest first).    |
| `updated`     | No        | Format `YYYY-MM-DD`. Set this when you meaningfully revise a published post — search engines use it as the "last updated" date. |
| `category`    | No        | A short label like `EMDR`, `Anxiety`, `Wellbeing`. Defaults to `Wellbeing`. |
| `author`      | No        | Defaults to `Nick Tuftnell`.                                               |
| `image`       | No        | e.g. `/images/calm-room.jpg`. The picture shown when the post is shared on social media. |
| `youtube`     | No        | A YouTube link. Adds a video player at the very top of the post.           |
| `draft`       | No        | `true` hides the post from the live site while you're still working on it. |

The "x min read" estimate and the author box at the bottom are added
automatically — you don't need to write them.

## Adding images

1. Put the image file in the folder `public/images/` (drag-and-drop in GitHub
   works). Use a plain lowercase name, e.g. `calm-room.jpg`.
2. In your post, add this line where you want the image to appear:

```markdown
![A short description of the picture](/images/calm-room.jpg)
```

Keep images reasonably sized before uploading — around 1600 pixels wide and
under about 500 KB is plenty.

## Adding a video

Videos are YouTube links — you don't upload video files.

**Option 1 — a video at the top of the post:** add a `youtube` line to the
frontmatter:

```markdown
youtube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Option 2 — a video partway through the post:** paste the YouTube link on its
own line, with a blank line above and below it:

```markdown
Here is a short explainer:

https://youtu.be/dQw4w9WgXcQ

As you can see, it's simple.
```

Either the full `youtube.com/watch?v=...` address or the short `youtu.be/...`
one works.

## Previewing before you publish

If you'd rather check a post before it goes live, set `draft: true` in the
frontmatter and push. The post stays hidden from the site. When you're happy,
change it to `draft: false` and push again.

To preview on your own computer (optional), run `npm install` once, then
`npm run dev`, and open the address it prints.

## A note on tone

Short paragraphs, plain English, no clinical jargon. Anything that could be read
as advice for a specific person should carry a gentle reminder that it isn't a
substitute for talking to someone directly.
