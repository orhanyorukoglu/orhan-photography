import { motion } from 'motion/react';
import GradientText from './reactbits/GradientText.jsx';
import { site } from '../site.config.js';
import { byId } from '../data/index.js';

const portrait = byId['venice-dsc03394-edit'] || Object.values(byId)[0];

export default function About() {
  return (
    <section className="section about" id="about">
      {/* The observer sits on the unclipped wrapper: a fully clip-pathed element reports 0% visible. */}
      <motion.div className="about__image" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.3 }}>
        <motion.img
          src={portrait.mid}
          alt=""
          variants={{
            hidden: { clipPath: 'inset(0 0 100% 0)', scale: 1.15 },
            shown: { clipPath: 'inset(0 0 0% 0)', scale: 1 }
          }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.div>
      <div className="about__text">
        <p className="eyebrow">04 — About</p>
        <h2 className="section__title">
          <GradientText colors={['#ff8a3d', '#ffd29a', '#1fb6c9', '#ff8a3d']} animationSpeed={6}>
            Hello, I’m {site.name.split(' ')[0]}.
          </GradientText>
        </h2>
        <p className="about__body">{site.about}</p>
        <p className="about__loc">{site.location}</p>
        {(site.email || site.instagram) && (
          <div className="hero__cta">
            {site.email && (
              <a className="btn btn--primary" href={`mailto:${site.email}`}>
                Get in touch
              </a>
            )}
            {site.instagram && (
              <a className="btn btn--ghost" href={site.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
