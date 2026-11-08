import { useEffect, useState } from 'react';
import { site } from '../site.config.js';

const links = [
  ['Selected', '#featured'],
  ['Collections', '#collections'],
  ['Gallery', '#gallery'],
  ['About', '#about']
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <a href="#top" className="nav__brand" aria-label={`${site.name} — home`}>
        <span className="nav__mark" aria-hidden="true" />
        <span>{site.name}</span>
      </a>
      <nav aria-label="Primary">
        <ul className="nav__links">
          {links.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
