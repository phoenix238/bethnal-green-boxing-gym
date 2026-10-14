import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import * as content from '../content.js';

// Navigation labels are interface text; section copy itself lives in content.js.
export const NAV_LINKS = [
  { href: '#approach', label: 'Approach' },
  { href: '#/classes', label: 'Classes' },
  { href: '#story', label: 'Story' },
  { href: '#club', label: 'The club' },
  { href: '#space', label: 'The space' },
  { href: '#community', label: 'Community' },
  { href: '#kit', label: 'Kit' },
  { href: '#visit', label: 'Visit' },
];

// The club's own logo artwork (white, green and gold on solid black), so it only ever sits on black.
// Falls back to the typographic wordmark if content.js has no logo.
export function Logo({ className = '', eager = false }) {
  const logo = content.media?.logo;
  if (!logo?.src) return <Wordmark className={className}/>;
  return <span className={`logo ${className}`.trim()}>
    <img src={logo.src} alt={logo.alt ?? content.site?.name ?? ''} width={logo.width ?? 1063} height={logo.height ?? 848}
      loading={eager ? 'eager' : 'lazy'} decoding="async"/>
  </span>;
}

// Typographic stand-in, only used if the logo is missing. Splits the name over two lines.
export function Wordmark({ className = '' }) {
  const words = String(content.site?.name ?? '').split(/\s+/).filter(Boolean);
  const cut = Math.ceil(words.length / 2);
  return <span className={`wordmark ${className}`.trim()}>
    <span className="wordmark-top">{words.slice(0, cut).join(' ')}</span>
    <span className="wordmark-bottom">{words.slice(cut).join(' ')}</span>
  </span>;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => { if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const close = () => setOpen(false);
  return <>
    <div className="topline" aria-hidden="true"><span>{content.site?.area}</span><span className="topline-star" aria-hidden="true">★</span><span className="topline-tag">{content.site?.tagline}</span></div>
    <header className="header">
      <a className="header-home" href="#top" aria-label={`${content.site?.name ?? 'Home'}, back to top`}><Logo className="logo-header" eager/></a>
      <nav className={open ? 'nav nav-open' : 'nav'} id="site-nav" aria-label="Main">
        <ul>
          {NAV_LINKS.map(link => <li key={link.href}><a href={link.href} onClick={close}>{link.label}</a></li>)}
        </ul>
        <a className="btn btn-yellow nav-mobile-cta" href="#timetable" onClick={close}>{content.hero?.primaryCta ?? 'Timetable'} <ArrowRight size={18} aria-hidden="true"/></a>
      </nav>
      <a className="btn btn-yellow btn-small header-cta" href="#timetable">{content.hero?.primaryCta ?? 'Timetable'}</a>
      <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(value => !value)}>
        {open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}<span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>
    </header>
  </>;
}
