import React from 'react';
import { ArrowUpRight, Camera, MessageCircle, Play, Mail } from 'lucide-react';
import * as content from '../content.js';
import { Logo, NAV_LINKS } from './Header.jsx';

export default function Footer({ onOwnerDemo, route }) {
  const { site, footer } = content;
  const instagram = typeof footer?.instagram === 'string' ? footer.instagram : footer?.instagram?.href ?? null;
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand">
        <a className="footer-home" href="#/" aria-label={`${site?.name ?? 'Home'}, home page`}><Logo className="logo-footer"/></a>
        {footer?.line ? <p className="footer-line">{footer.line}</p> : null}
        {site?.area ? <p className="footer-area">{site.area}</p> : null}
      </div>
      <nav className="footer-nav" aria-label="Footer">
        <ul>{NAV_LINKS.map(link => <li key={link.href}><a href={link.href} aria-current={route === link.route ? 'page' : undefined}>{link.label}</a></li>)}</ul>
      </nav>
      <div className="footer-social-list">
        <a className="footer-social footer-whatsapp" href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/> WhatsApp the club <ArrowUpRight size={14}/></a>
        <a className="footer-social" href={`mailto:${content.media.email}`}><Mail size={18} aria-hidden="true"/> Email the club <ArrowUpRight size={14} aria-hidden="true"/></a>
        {content.media?.whatsapp ? <a className="footer-social footer-whatsapp" href={content.media.whatsapp} rel="noopener noreferrer" target="_blank"><MessageCircle size={18} aria-hidden="true"/> WhatsApp group <ArrowUpRight size={14} aria-hidden="true"/></a> : null}
        <a className="footer-social" href={footer.podcast.href} rel="noopener noreferrer" target="_blank"><Play size={18} aria-hidden="true"/> {footer.podcast.label} <ArrowUpRight size={14} aria-hidden="true"/><span className="sr-only"> (opens YouTube in a new tab)</span></a>
        {instagram ? <a className="footer-social" href={instagram} rel="noopener noreferrer" target="_blank"><Camera size={18} aria-hidden="true"/> Instagram <ArrowUpRight size={14} aria-hidden="true"/></a> : null}
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} {site?.name}</span>
      <span>Website created by Phoenix Tanner Media</span>
      <span className="footer-proto">Class bookings are handled by Cal.com</span>
      {onOwnerDemo ? <button type="button" className="footer-owner" onClick={onOwnerDemo}>Owner demo</button> : null}
    </div>
  </footer>;
}
