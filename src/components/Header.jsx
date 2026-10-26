import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import * as content from '../content.js';
import { BookButton } from './Classes.jsx';

// The site's pages (hash routes, so it works on any static host). Labels are interface text; copy lives in content.js.
export const NAV_LINKS = [
  { route: 'classes', href: '#/classes', label: 'Classes & coaching' },
  { route: 'gym', href: '#/gym', label: 'The club' },
  { route: 'doctor', href: '#/doctor', label: 'White collar & wellbeing' },
  { route: 'space-hire', href: '#/space-hire', label: 'Space hire' },
  { route: 'faq', href: '#/faq', label: 'FAQ' },
  { route: 'visit', href: '#/visit', label: 'Visit' },
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

export default function Header({ route }) {
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
      <div className="header-inner">
        <a className="header-home" href="#/" onClick={close} aria-current={route === 'home' ? 'page' : undefined} aria-label={`${content.site?.name ?? 'Home'}, home page`}>
          <Logo className="logo-header" eager/>
          <span className="header-home-label" aria-hidden="true">Home</span>
        </a>
        <nav className={open ? 'nav nav-open' : 'nav'} id="site-nav" aria-label="Main">
          <ul>
            {NAV_LINKS.map(link => <li key={link.href}><a href={link.href} onClick={close} aria-current={route === link.route ? 'page' : undefined}>{link.label}</a></li>)}
          </ul>
          <BookButton label="Book a class" className="btn btn-yellow nav-mobile-cta" onOpen={close}/>
        </nav>
        <BookButton label="Book a class" className="btn btn-yellow btn-small header-cta"/>
        <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(value => !value)}>
          {open ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}<span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  </>;
}
