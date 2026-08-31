import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every Markdown file in src/content/blog/ becomes a blog post.
// The fields below are what you can (or must) put at the top of each file.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    // Required
    title: z.string(),
    description: z.string(), // 1–2 sentence summary shown on cards and in search results
    date: z.coerce.date(), // e.g. 2026-08-29

    // Optional
    updated: z.coerce.date().optional(), // set when you meaningfully revise a published post
    category: z.string().default('Wellbeing'), // e.g. EMDR, Anxiety, Trauma, Counselling
    author: z.string().default('Nick Tuftnell'),
    image: z.string().optional(), // e.g. /images/calm-room.jpg — used as the social share image
    youtube: z.string().optional(), // a YouTube link — shows a video at the top of the post
    draft: z.boolean().default(false), // true = hidden from the live site (work in progress)
  }),
});

export const collections = { blog };
