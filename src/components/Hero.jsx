import Aurora from './reactbits/Aurora.jsx';
import SplitText from './reactbits/SplitText.jsx';
import ShinyText from './reactbits/ShinyText.jsx';
import CountUp from './reactbits/CountUp.jsx';
import { site } from '../site.config.js';
import { collections, photos, featured, years } from '../data/index.js';

const strip = featured.slice(0, 7);

// The tagline is the headline: the part before the dash is set upright,
// the rest in the italic amber gradient.
const [lead, accent] = site.tagline.split(/\s*—\s*/);

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__aurora" aria-hidden="true">
        <Aurora colorStops={['#ff6a2b', '#1fb6c9', '#ffb35c']} amplitude={1.1} blend={0.55} speed={0.6} glow={0.7} />
      </div>

      <div className="hero__strip" aria-hidden="true">
        {strip.map((p, i) => (
          <div className="hero__chip" key={p.id} style={{ '--i': i, backgroundColor: p.color }}>
            <img src={p.thumb} alt="" loading="eager" />
          </div>
        ))}
      </div>

      <div className="hero__content">
        <p className="hero__name">
          <span className="hero__name-mark" aria-hidden="true" />
          <ShinyText text={site.name} color="#e9e3d8" shineColor="#ffffff" speed={3.5} />
          <span className="hero__name-meta">
            {site.role} · {years.from}–{years.to}
          </span>
        </p>

        <h1 className="hero__title" aria-label={site.tagline}>
          <SplitText
            text={`${lead} —`}
            tag="span"
            splitType="words"
            className="hero__line"
            delay={70}
            duration={1.1}
            effect="rise"
            trigger="load"
            mask
          />
          {accent && (
            <SplitText
              text={accent}
              tag="span"
              splitType="words"
              className="hero__line hero__line--italic"
              delay={70}
              duration={1.1}
              effect="blur"
              trigger="load"
            />
          )}
        </h1>

        <dl className="hero__stats">
          <div>
            <dt>Photographs</dt>
            <dd>
              <CountUp to={photos.length} duration={2.2} trigger="load" />
            </dd>
          </div>
          <div>
            <dt>Collections</dt>
            <dd>
              <CountUp to={collections.length} duration={1.6} trigger="load" />
            </dd>
          </div>
          <div>
            <dt>Years behind the lens</dt>
            <dd>
              <CountUp to={years.to - years.from} duration={2} trigger="load" suffix="+" />
            </dd>
          </div>
        </dl>

        <div className="hero__cta">
          <a className="btn btn--primary" href="#gallery">
            Enter the gallery
          </a>
          <a className="btn btn--ghost" href="#collections">
            Browse collections
          </a>
        </div>
      </div>

      <a href="#featured" className="hero__scroll" aria-label="Scroll to selected works">
        <span />
      </a>
    </section>
  );
}
