/**
 * Accepts a full YouTube URL (watch, youtu.be, shorts, live, embed) or a bare
 * 11-character video id, and returns just the id — or null if it can't be found.
 */
export function youTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  const match = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(s)) return s;
  return null;
}
