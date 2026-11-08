import { useMemo } from 'react';
import CircularGallery from './reactbits/CircularGallery.jsx';
import { featured, titleFor, collectionById } from '../data/index.js';

export default function Featured() {
  const items = useMemo(
    () =>
      featured.map(p => ({
        image: p.mid,
        text: titleFor(p),
        description: `${collectionById[p.collection].title}${p.exif.date ? ` · ${p.exif.date.slice(0, 4)}` : ''}`
      })),
    []
  );

  return (
    <section className="section featured" id="featured">
      <header className="section__head">
        <p className="eyebrow">01 — Selected works</p>
        <h2 className="section__title">
          Drag, scroll, <em>wander.</em>
        </h2>
        <p className="section__lede">A spinning reel of favourites. Click any frame to bring it forward.</p>
      </header>
      <div className="featured__stage">
        <CircularGallery
          items={items}
          bend={2.4}
          textColor="#f3efe7"
          borderRadius={0.04}
          font='500 26px "Inter Tight"'
          scrollEase={0.04}
          itemAspect={0.8}
          gap={0.22}
          wave={0.6}
          shadow={0.35}
          autoScroll={0.35}
        />
      </div>
    </section>
  );
}
