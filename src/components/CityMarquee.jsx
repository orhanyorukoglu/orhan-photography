import ScrollVelocity from './reactbits/ScrollVelocity.jsx';
import { collections } from '../data/index.js';

export default function CityMarquee() {
  const places = collections.map(c => c.title).join(' ✦ ') + ' ✦ ';
  return (
    <section className="marquee" aria-label="Places photographed">
      <ScrollVelocity
        texts={[places, 'Streets ✦ Cities ✦ Seas ✦ Light ✦ ']}
        velocity={60}
        className="marquee__text"
        fadeEdges
        skewWithVelocity={6}
        outlineAlternate
        numCopies={4}
      />
    </section>
  );
}
