# Orhan Yorukoglu — Photography

A photo gallery site built with Vite + React, using [React Bits](https://reactbits.dev) components for the motion and WebGL effects.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # processes photos, then builds static site into dist/
npm run preview    # serve the built site
```

## Deploy

**Live:** https://orhanyorukoglu.com (also reachable via orhanyorukoglu.github.io/orhan-photography, which redirects)

Every push to `main` rebuilds and publishes the site through GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

Full-resolution originals in `photos/` are **not** committed (see `.gitignore`). Only the web-sized copies in `public/photos/` are. So after adding photos, run `npm run photos` locally and commit `public/photos/` and `src/data/photos.json`:

```bash
npm run photos
git add -A && git commit -m "Add new photos" && git push
```

## Folder layout

```
photos/                  ← ORIGINALS (source of truth). One folder = one collection.
  collections.json       ← titles, subtitles, covers, featured picks, photo titles
  rome/ venice/ paris/ istanbul/ new-york/ aegean/ tuscany/ moments/
  _excluded/             ← folders starting with "_" are ignored by the site
scripts/build-photos.mjs ← makes WebP sizes (640/1280/2400px), blur placeholders, EXIF → manifest
public/photos/           ← generated web images (don't edit by hand)
src/
  data/photos.json       ← generated manifest
  site.config.js         ← name, tagline, about text, email/instagram
  components/            ← page sections (Hero, Featured, Collections, Gallery, About…)
  components/reactbits/  ← React Bits components (Aurora, CircularGallery, SplitText,
                           TiltedCard, ClickSpark, ShinyText, CountUp, GradientText)
```

## Adding or changing photos

1. Drop JPGs into a folder under `photos/` (a new folder makes a new collection).
2. Optionally edit `photos/collections.json` to set the collection's title, cover, order, featured picks, or photo titles.
3. Run `npm run photos` (or just `npm run build`). Only new or changed images get re-encoded.

## Page sections

- **Hero**: Aurora WebGL background, SplitText name reveal, ShinyText eyebrow, CountUp stats, floating photo strip.
- **Selected works**: CircularGallery, a draggable WebGL reel of the `featured` photos.
- **Collections**: TiltedCard 3D cards. Clicking one filters the gallery (`#gallery/rome` links work).
- **Gallery**: balanced masonry with blur-up loading, animated filters, and a full-screen lightbox (zoom, thumbnails, EXIF captions).
- **About** / **Footer**, with ClickSpark sparks on every click site-wide.
