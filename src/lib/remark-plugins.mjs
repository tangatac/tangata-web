// Small, dependency-free remark plugins used when building blog posts.

const YT_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;

/**
 * Adds an automatic reading-time estimate to each post's frontmatter as
 * `minutesRead` (e.g. "5 min read"), based on ~200 words per minute.
 */
export function remarkReadingTime() {
  return function (tree, file) {
    let words = 0;
    const walk = (node) => {
      if (typeof node.value === 'string') {
        words += node.value.split(/\s+/).filter(Boolean).length;
      }
      if (Array.isArray(node.children)) node.children.forEach(walk);
    };
    walk(tree);
    const minutes = Math.max(1, Math.round(words / 200));
    file.data.astro.frontmatter.minutesRead = `${minutes} min read`;
  };
}

/**
 * Turns a paragraph that contains nothing but a YouTube link into a responsive
 * embedded player. Writers just paste the video URL on its own line.
 */
export function remarkYouTube() {
  return function (tree) {
    const visit = (parent) => {
      if (!Array.isArray(parent.children)) return;
      parent.children.forEach((child, i) => {
        if (child.type === 'paragraph' && child.children?.length === 1) {
          const only = child.children[0];
          const url =
            only.type === 'link'
              ? only.url
              : only.type === 'text'
                ? only.value.trim()
                : null;
          const match = url && url.match(YT_RE);
          if (match) {
            parent.children[i] = { type: 'html', value: youTubeEmbed(match[1]) };
            return;
          }
        }
        visit(child);
      });
    };
    visit(tree);
  };
}

export function youTubeEmbed(id) {
  return (
    `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" ` +
    `title="YouTube video player" loading="lazy" frameborder="0" ` +
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ` +
    `allowfullscreen></iframe></div>`
  );
}
