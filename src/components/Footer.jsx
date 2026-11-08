import { site } from '../site.config.js';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__name" aria-hidden="true">
        {site.name}
      </p>
      <div className="footer__row">
        <span>
          © {new Date().getFullYear()} {site.name}. All photographs, all rights reserved.
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
