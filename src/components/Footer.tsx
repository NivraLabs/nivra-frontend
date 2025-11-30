import { JSX } from "react";
import logo from "../assets/images/nivra-logo.png";

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        <div className="footer-left">
          <img src={logo} alt="Nivra logo" className="footer-logo-img" />
          <div className="footer-brand-text">
            <div className="footer-name">Nivra</div>
            <div className="footer-tag">Court & Governance</div>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <a href="#home">Home</a>
          <a href="#docs">Docs</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="footer-actions">
          <div className="footer-social" aria-hidden>
            <a
              className="footer-icon"
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 5.8c-.6.3-1.2.6-1.9.7.7-.4 1.2-1 1.5-1.8-.7.4-1.6.7-2.6.9C18.4 5 17.3 4.5 16 4.5c-2.3 0-4.2 2-4.2 4.4 0 .3 0 .6.1.9C8.7 9.6 6 8 4.2 5.7c-.4.7-.6 1.4-.6 2.2 0 1.5.8 2.8 2.1 3.6-.5 0-1-.2-1.4-.4 0 2.1 1.5 3.8 3.5 4.2-.4.1-.9.2-1.3.2-.3 0-.6 0-.9-.1.6 2 2.4 3.4 4.5 3.5-1.6 1.2-3.6 1.9-5.7 1.9H9c2.2 1.3 4.7 2 7.4 2 8.8 0 13.6-7.3 13.6-13.6v-.6c.9-.7 1.6-1.5 2.2-2.4-.8.3-1.7.6-2.6.7z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
          <div className="footer-copy">© {year} Nivra</div>
        </div>
      </div>
    </footer>
  );
}
