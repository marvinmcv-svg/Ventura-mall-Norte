// Downloads Ventura Mall's real media into public/media/ig/ and the
// official logo into public/brand/.
//   node scripts/fetch-media.mjs
// Source: scripts/instagram-media.json (scraped from @venturamalloficial).
// Instagram CDN links are signed and expire after a few days; if you get
// 403s, re-scrape the feed to refresh the manifest.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const igDir = path.join(root, 'public/media/ig');
const brandDir = path.join(root, 'public/brand');
await mkdir(igDir, { recursive: true });
await mkdir(brandDir, { recursive: true });

const posts = JSON.parse(await readFile(path.join(root, 'scripts/instagram-media.json'), 'utf8'));

const jobs = [
  ['https://web.archive.org/web/20260314052602id_/http://venturamall.bo/Images/logo.png', path.join(brandDir, 'logo.png')],
  ['https://web.archive.org/web/20260314052602id_/http://venturamall.bo/Images/icono.png', path.join(brandDir, 'icono.png')],
];
for (const p of posts) {
  if (p.image) jobs.push([p.image, path.join(igDir, `${p.code}.jpg`)]);
  if (p.video) jobs.push([p.video, path.join(igDir, `${p.code}.mp4`)]);
  p.carousel.forEach((url, i) => url && jobs.push([url, path.join(igDir, `${p.code}-${i + 1}.jpg`)]));
}

let ok = 0, failed = 0;
for (const [url, out] of jobs) {
  if (existsSync(out)) { ok++; continue; }
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(out, Buffer.from(await res.arrayBuffer()));
    ok++;
    console.log('✓', path.relative(root, out));
  } catch (e) {
    failed++;
    console.warn('✗', path.relative(root, out), e.message);
  }
}
console.log(`\n${ok} saved, ${failed} failed (of ${jobs.length})`);
