// Resolves media keys (see scripts/media-sources.json) to real downloaded files.
// Files that couldn't be downloaded at build time resolve to null, so nothing
// fake is ever shown in their place.
import generated from './media.generated.json';

export const media = (key) => (key && generated[key]) || null;
export const firstMedia = (...keys) => keys.map(media).find(Boolean) || null;
export const has = (key) => !!media(key);
