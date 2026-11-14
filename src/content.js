// Content + media helpers for the site (data lives in data.js).
import M from './media.json';
export * from './data.js';

// ── Media helpers ────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL || '/';
export const url = (p) => (p ? (/^https?:/.test(p) ? p : BASE + p.replace(/^\//, '')) : null);
export const post = (code) => M.posts[code] || null;
export const account = (h) => (h && M.accounts[h]) || null;
export const logoOf = (x) => (x?.noLogo ? null : url(account(x?.ig)?.logo));
export const mallLogo = () => url(account('venturamalloficial')?.logo);
export const postImage = (code, i = 0) => url(post(code)?.images?.[i] || post(code)?.poster);
export const mallPhoto = (k) => url(M.mall[k]);
export const tiktoks = M.tiktok;
export const tiktokById = (id) => M.tiktok.find((t) => t.id === id) || null;
export const accountPosts = (h) => (account(h)?.posts || []).map((c) => ({ code: c, ...post(c) })).filter((p) => p.images?.length || p.video);

/** First meaningful line of a caption, without emojis/hashtags — used as a title. */
export function captionTitle(text = '', max = 64) {
  const line = text.split('\n').map((l) => l.replace(/[\p{Extended_Pictographic}‍️]/gu, '').replace(/#\S+/g, '').trim()).find((l) => l.length > 2) || '';
  return line.length > max ? line.slice(0, max).replace(/\s+\S*$/, '') + '…' : line;
}
export function captionBody(text = '', max = 220) {
  const t = text.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max).replace(/\s+\S*$/, '') + '…' : t;
}

/** Best cover image for a store/restaurant: mall post photo, then its own feed. */
export function coverOf(x) {
  if (x.cover) { const [code, i] = x.cover.split(':'); const im = postImage(code, +i || 0); if (im) return im; }
  for (const c of x.posts || []) { const im = postImage(c); if (im) return im; }
  for (const p of accountPosts(x.ig)) { const im = url(p.images?.[0] || p.poster); if (im) return im; }
  const tt = x.tiktok && tiktokById(x.tiktok);
  return tt ? url(tt.poster) : null;
}
/** Up to n images of a place (mall posts first, then own account). */
export function galleryOf(x, n = 12) {
  const out = [];
  const push = (p, code, src) => p && p.images?.forEach((im) => out.length < n && out.push({ src: url(im), code, caption: p.caption, source: src }));
  (x.posts || []).forEach((c) => push(post(c), c, 'venturamalloficial'));
  accountPosts(x.ig).forEach((p) => push(p, p.code, x.ig));
  return out;
}
/** Videos for a place: its mall reels, own reels and TikTok. */
export function videosOf(x) {
  const out = [];
  (x.posts || []).forEach((c) => { const p = post(c); if (p?.video) out.push({ src: url(p.video), poster: url(p.images?.[0] || p.poster), caption: p.caption, href: `https://www.instagram.com/p/${c}/` }); });
  accountPosts(x.ig).forEach((p) => { if (p.video) out.push({ src: url(p.video), poster: url(p.images?.[0] || p.poster), caption: p.caption, href: `https://www.instagram.com/p/${p.code}/` }); });
  const tt = x.tiktok && tiktokById(x.tiktok);
  if (tt) out.push({ src: url(tt.video), poster: url(tt.poster), embed: tt.id, caption: tt.desc, href: `https://www.tiktok.com/@venturamalloficial/video/${tt.id}`, tiktok: true });
  return out.filter((v) => v.src || v.poster);
}


// Reels for the home page (videos from @venturamalloficial)
export const mallReels = Object.entries(M.posts).filter(([, p]) => p.account === 'venturamalloficial' && p.video).map(([code, p]) => ({ code, ...p }));

