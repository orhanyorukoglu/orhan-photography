import data from './photos.json';

// Manifest paths are root-relative ("/photos/..."); prefix them with Vite's base so the
// site also works under a subpath (e.g. GitHub Pages: /orhan-photography/).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const url = p => (p.startsWith('/') ? BASE + p : p);

export const collections = data.collections;
export const photos = data.photos.map(p => ({
  ...p,
  src: url(p.src),
  thumb: url(p.thumb),
  mid: url(p.mid),
  srcSet: p.srcSet.map(s => ({ ...s, src: url(s.src) }))
}));

export const byId = Object.fromEntries(photos.map(p => [p.id, p]));
export const collectionById = Object.fromEntries(collections.map(c => [c.id, c]));

export const featured = photos.filter(p => p.featured).sort((a, b) => a.featuredIndex - b.featuredIndex);

export const titleFor = p => p.title || collectionById[p.collection]?.title || 'Untitled';

export const years = (() => {
  const ys = photos.map(p => p.exif.date?.slice(0, 4)).filter(Boolean).map(Number);
  return { from: Math.min(...ys), to: Math.max(...ys) };
})();
