import React from 'react';
import { ArrowUpRight, Camera, MessageCircle } from 'lucide-react';
import * as content from '../content.js';
import { Logo, NAV_LINKS } from './Header.jsx';

export default function Footer({ onOwnerDemo }) {
  const { site, footer } = content;
  const instagram = typeof footer?.instagram === 'string' ? footer.instagram : footer?.instagram?.href ?? null;
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand">
        <a className="footer-home" href="#top" aria-label={`${site?.name ?? 'Home'}, back to top`}><Logo className="logo-footer"/></a>
        {footer?.line ? <p className="footer-line">{footer.line}</p> : null}
        {site?.area ? <p className="footer-area">{site.area}</p> : null}
      </div>
      <nav className="footer-nav" aria-label="Footer">
        <ul>{NAV_LINKS.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul>
      </nav>
      <div className="footer-social-list">
        {content.media?.whatsapp ? <a className="footer-social footer-whatsapp" href={content.media.whatsapp} rel="noopener noreferrer" target="_blank"><MessageCircle size={18} aria-hidden="true"/> WhatsApp group <ArrowUpRight size={14} aria-hidden="true"/></a> : null}
        {instagram ? <a className="footer-social" href={instagram} rel="noopener noreferrer" target="_blank"><Camera size={18} aria-hidden="true"/> Instagram <ArrowUpRight size={14} aria-hidden="true"/></a> : null}
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} {site?.name}</span>
      <span className="footer-proto">Demo site · online booking and payments are not live</span>
      <button type="button" className="footer-owner" onClick={onOwnerDemo}>Owner demo</button>
    </div>
  </footer>;
}
