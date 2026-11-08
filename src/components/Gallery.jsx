import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { collections, photos, titleFor, collectionById } from '../data/index.js';

// "All" view: deal photos round-robin across collections so places mix together.
const mixed = (() => {
  const groups = collections.map(c => photos.filter(p => p.collection === c.id));
  const out = [];
  for (let i = 0; out.length < photos.length; i++) groups.forEach(g => g[i] && out.push(g[i]));
  return out;
})();

const columnsFor =w => (w < 560 ? 1 : w < 900 ? 2 : w < 1400 ? 3 : 4);

function useColumns() {
  const [cols, setCols] = useState(() => columnsFor(window.innerWidth));
  useEffect(() => {
    const onResize = () => setCols(columnsFor(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return cols;
}

// Greedy "shortest column first" so columns end at roughly the same height.
function distribute(items, n) {
  const cols = Array.from({ length: n }, () => ({ h: 0, items: [] }));
  items.forEach((p, index) => {
    const col = cols.reduce((a, b) => (b.h < a.h ? b : a));
    col.items.push({ p, index });
    col.h += p.height / p.width + 0.05; // + the row gap, roughly, in width units
  });
  return cols.map(c => c.items);
}

const exifLine = e => [e.camera, e.focal, e.aperture, e.shutter, e.iso && `ISO ${e.iso}`].filter(Boolean).join(' · ');

function Tile({ p, index, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.button
      layout
      type="button"
      className="tile"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.94 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ aspectRatio: `${p.width} / ${p.height}`, backgroundImage: `url(${p.blur})`, backgroundColor: p.color }}
      aria-label={`Open ${titleFor(p)}`}
    >
      <img
        src={p.thumb}
        srcSet={p.srcSet
          .filter(s => s.width <= 1280)
          .map(s => `${s.src} ${s.width}w`)
          .join(', ')}
        sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1400px) 33vw, 25vw"
        alt={titleFor(p)}
        loading="lazy"
        decoding="async"
        className={loaded ? 'is-loaded' : ''}
        onLoad={() => setLoaded(true)}
      />
      <span className="tile__meta">
        <span className="tile__title">{titleFor(p)}</span>
        <span className="tile__place">{collectionById[p.collection].title}</span>
      </span>
    </motion.button>
  );
}

export default function Gallery({ filter, onFilter }) {
  const cols = useColumns();
  const [open, setOpen] = useState(-1);
  const list = useMemo(() => (filter === 'all' ? mixed : photos.filter(p => p.collection === filter)), [filter]);
  const columns = useMemo(() => distribute(list, cols), [list, cols]);

  const slides = useMemo(
    () =>
      list.map(p => ({
        src: p.src,
        width: p.width,
        height: p.height,
        srcSet: p.srcSet,
        alt: titleFor(p),
        title: titleFor(p),
        description: [collectionById[p.collection].title, p.exif.date, exifLine(p.exif)].filter(Boolean).join('  ·  ')
      })),
    [list]
  );

  const tabs = [{ id: 'all', title: 'All', count: photos.length }, ...collections];

  return (
    <section className="section gallery" id="gallery">
      <header className="section__head">
        <p className="eyebrow">03 — The archive</p>
        <h2 className="section__title">
          Every frame, <em>unfiltered.</em>
        </h2>
      </header>

      <div className="filters" role="tablist" aria-label="Filter by collection">
        {tabs.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            className={`filter${filter === t.id ? ' is-active' : ''}`}
            onClick={() => onFilter(t.id)}
          >
            {filter === t.id && <motion.span layoutId="filter-pill" className="filter__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="filter__label">{t.title}</span>
            <sup>{t.count}</sup>
          </button>
        ))}
      </div>

      <div className="masonry" style={{ '--cols': cols }}>
        {columns.map((col, ci) => (
          <div className="masonry__col" key={`${filter}-${cols}-${ci}`}>
            <AnimatePresence initial={false}>
              {col.map(({ p, index }) => (
                <Tile key={p.id} p={p} index={index} onOpen={setOpen} />
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <Lightbox
        open={open >= 0}
        index={open}
        close={() => setOpen(-1)}
        slides={slides}
        plugins={[Zoom, Captions, Counter, Thumbnails]}
        captions={{ descriptionTextAlign: 'center', descriptionMaxLines: 2 }}
        thumbnails={{ width: 96, height: 64, border: 0, borderRadius: 6, gap: 8, padding: 0, vignette: true }}
        zoom={{ maxZoomPixelRatio: 2 }}
        styles={{ container: { backgroundColor: 'rgba(8,7,6,.96)' } }}
        animation={{ fade: 300, swipe: 400 }}
      />
    </section>
  );
}
