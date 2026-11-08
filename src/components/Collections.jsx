import TiltedCard from './reactbits/TiltedCard.jsx';
import { collections, byId } from '../data/index.js';

export default function Collections({ onOpen }) {
  return (
    <section className="section" id="collections">
      <header className="section__head">
        <p className="eyebrow">02 — Collections</p>
        <h2 className="section__title">
          Eight places, <em>one obsession.</em>
        </h2>
      </header>
      <div className="collections">
        {collections.map((c, i) => {
          const cover = byId[c.cover];
          return (
            <TiltedCard
              key={c.id}
              className="collection-card"
              imageSrc={cover.mid}
              altText={`${c.title} collection cover`}
              captionText={`Open ${c.title}`}
              containerHeight="clamp(320px, 42vw, 440px)"
              containerWidth="100%"
              imageHeight="clamp(320px, 42vw, 440px)"
              imageWidth="100%"
              rotateAmplitude={9}
              scaleOnHover={1.04}
              radius={18}
              glare={0.35}
              gyroscope={false}
              introDelay={i * 0.06}
              displayOverlayContent
              overlayDepth={40}
              onClick={() => onOpen(c.id)}
              overlayContent={
                <div className="collection-card__overlay">
                  <span className="collection-card__count">
                    {String(c.count).padStart(2, '0')} frames · {c.year}
                  </span>
                  <h3 className="collection-card__title">{c.title}</h3>
                  <p className="collection-card__sub">{c.subtitle}</p>
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
