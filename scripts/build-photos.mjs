// Turns /photos/<collection>/*.jpg originals into web-ready WebP sizes in
// /public/photos and writes the manifest the site reads (src/data/photos.json).
// Re-running is cheap: images whose outputs are newer than the original are skipped.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import exifr from 'exifr';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'photos');
const OUT = path.join(ROOT, 'public', 'photos');
const MANIFEST = path.join(ROOT, 'src', 'data', 'photos.json');
const SIZES = [640, 1280, 2400];
const IMG = /\.(jpe?g|png|webp|tiff?)$/i;

const config = JSON.parse(fs.readFileSync(path.join(SRC, 'collections.json'), 'utf8'));
const slugify = s => s.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const folders = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
  .map(d => d.name);
const order = [...config.order.filter(f => folders.includes(f)), ...folders.filter(f => !config.order.includes(f)).sort()];

const isFresh = (src, outs) => {
  const t = fs.statSync(src).mtimeMs;
  return outs.every(o => fs.existsSync(o) && fs.statSync(o).mtimeMs >= t);
};

const collections = [];
const photos = [];
let processed = 0;

for (const folder of order) {
  const meta = config.collections[folder] || {};
  const files = fs.readdirSync(path.join(SRC, folder)).filter(f => IMG.test(f)).sort();
  fs.mkdirSync(path.join(OUT, folder), { recursive: true });

  for (const file of files) {
    const key = `${folder}/${file}`;
    const src = path.join(SRC, folder, file);
    const slug = slugify(file);
    const image = sharp(src, { failOn: 'none' }).rotate();
    const { width: w0, height: h0, orientation } = await image.metadata();
    const [width, height] = orientation >= 5 ? [h0, w0] : [w0, h0];

    const sizes = SIZES.filter(s => s < width).concat(width).filter((s, i, a) => a.indexOf(s) === i).slice(0, SIZES.length);
    const outs = sizes.map(s => path.join(OUT, folder, `${slug}-${s}.webp`));
    if (!isFresh(src, outs)) {
      await Promise.all(
        sizes.map((s, i) =>
          image.clone().resize({ width: s, withoutEnlargement: true }).webp({ quality: s > 1500 ? 82 : 78 }).toFile(outs[i])
        )
      );
      processed++;
    }

    const blurBuf = await image.clone().resize(24).webp({ quality: 40 }).toBuffer();
    const { dominant } = await image.clone().resize(64).stats();

    let exif = {};
    try {
      exif = (await exifr.parse(src, ['DateTimeOriginal', 'Model', 'LensModel', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength'])) || {};
    } catch {}

    photos.push({
      id: `${folder}-${slug}`,
      collection: folder,
      title: config.titles?.[key] || null,
      width,
      height,
      src: `/photos/${folder}/${slug}-${sizes.at(-1)}.webp`,
      thumb: `/photos/${folder}/${slug}-${sizes[0]}.webp`,
      mid: `/photos/${folder}/${slug}-${sizes[Math.min(1, sizes.length - 1)]}.webp`,
      srcSet: sizes.map(s => ({ src: `/photos/${folder}/${slug}-${s}.webp`, width: s, height: Math.round((height * s) / width) })),
      blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
      color: `rgb(${dominant.r},${dominant.g},${dominant.b})`,
      exif: {
        date: exif.DateTimeOriginal ? new Date(exif.DateTimeOriginal).toISOString().slice(0, 10) : null,
        camera: exif.Model || null,
        lens: exif.LensModel || null,
        aperture: exif.FNumber ? `f/${exif.FNumber}` : null,
        shutter: exif.ExposureTime ? (exif.ExposureTime < 1 ? `1/${Math.round(1 / exif.ExposureTime)}s` : `${exif.ExposureTime}s`) : null,
        iso: exif.ISO || null,
        focal: exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : null
      },
      featured: config.featured?.includes(key) || false,
      featuredIndex: config.featured?.indexOf(key) ?? -1
    });
  }

  const coverFile = meta.cover && files.includes(meta.cover) ? meta.cover : files[0];
  collections.push({
    id: folder,
    title: meta.title || folder.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    subtitle: meta.subtitle || '',
    year: meta.year || '',
    count: files.length,
    cover: `${folder}-${slugify(coverFile)}`
  });
  console.log(`  ${folder.padEnd(12)} ${files.length} photos`);
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify({ collections, photos }, null, 1));
console.log(`✓ ${photos.length} photos in ${collections.length} collections (${processed} re-encoded) → src/data/photos.json`);
