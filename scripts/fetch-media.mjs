// Downloads Ventura Mall's real media (official logo, @venturamalloficial
// Instagram posts/reels, TikTok covers, Wikimedia Commons photos, brand logos)
// into public/media/real/ and writes src/media.generated.json with the files
// that actually arrived. Runs before every build; never fails the build.
//   node scripts/fetch-media.mjs
// Instagram/TikTok CDN links are signed and expire after a few days: if most
// downloads 403, re-scrape the feeds to refresh scripts/media-sources.json.
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/media/real');
const genFile = path.join(root, 'src/media.generated.json');
await mkdir(outDir, { recursive: true });

const sources = JSON.parse(await readFile(path.join(root, 'scripts/media-sources.json'), 'utf8'));
const MIN_BYTES = { logos: 1500, default: 1000 };
const result = {};
let ok = 0;
let failed = 0;

async function exists(file) {
  try { return (await stat(file)).size > 0; } catch { return false; }
}

async function get(src) {
  const file = path.join(outDir, `${src.key}.${src.ext}`);
  const rel = `media/real/${src.key}.${src.ext}`;
  if (await exists(file)) { result[src.key] = rel; ok++; return; }
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(src.url, {
        headers: { 'user-agent': 'Mozilla/5.0 (VenturaMallSiteBuild)' },
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') || '';
      if (!/^(image|video)\//.test(type)) throw new Error(`unexpected ${type}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < (MIN_BYTES[src.group] ?? MIN_BYTES.default)) throw new Error('placeholder/too small');
      await writeFile(file, buf);
      result[src.key] = rel;
      ok++;
      return;
    } catch (e) {
      if (attempt === 1) { failed++; console.warn(`  ✗ ${src.key}: ${e.message}`); }
    }
  }
}

const queue = [...sources];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) await get(queue.shift());
}));

await writeFile(genFile, JSON.stringify(result, null, 1) + '\n');
console.log(`fetch-media: ${ok} files ready, ${failed} unavailable (of ${sources.length})`);
