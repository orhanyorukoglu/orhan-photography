import { useCallback, useEffect, useState } from 'react';
import ClickSpark from './components/reactbits/ClickSpark.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Featured from './components/Featured.jsx';
import Collections from './components/Collections.jsx';
import Gallery from './components/Gallery.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';
import { collectionById } from './data/index.js';

const readHash = () => {
  const m = window.location.hash.match(/^#gallery\/([\w-]+)/);
  return m && collectionById[m[1]] ? m[1] : 'all';
};

export default function App() {
  const [filter, setFilter] = useState(readHash);

  useEffect(() => {
    const onHash = () => setFilter(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openCollection = useCallback(id => {
    setFilter(id);
    history.replaceState(null, '', id === 'all' ? '#gallery' : `#gallery/${id}`);
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <ClickSpark sparkColor="#ff8a3d" sparkSize={10} sparkRadius={22} sparkCount={10} duration={450} glow={0.6}>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Featured />
        <Collections onOpen={openCollection} />
        <Gallery filter={filter} onFilter={openCollection} />
        <About />
      </main>
      <Footer />
    </ClickSpark>
  );
}
