import React, { useEffect, useRef } from 'react';
import * as content from '../content.js';

// Renders a content.js heading/title: either a plain string or [plain part, emphasised part].
export function Title({ parts }) {
  if (parts == null) return null;
  if (!Array.isArray(parts)) return parts;
  const [plain, strong] = parts;
  return <>
    {plain ? <span className="t-plain">{plain}</span> : null}
    {plain && strong ? ' ' : null}
    {strong ? <em className="t-em">{strong}</em> : null}
  </>;
}

// Small section label. The number is decoration only (like a fight-bill bout number).
export function Eyebrow({ no, children }) {
  if (!children) return null;
  return <p className="eyebrow">{no ? <span className="eyebrow-no" aria-hidden="true">{no}</span> : null}<span>{children}</span></p>;
}

// Accepts a string or an array of strings (copy may arrive in either shape).
export function Paragraphs({ items, className }) {
  const list = Array.isArray(items) ? items : items ? [items] : [];
  return list.map((text, index) => <p className={className} key={index}>{text}</p>);
}

// Intrinsic sizes of the real gym photos, so the browser can reserve space before they load.
const PHOTO_SIZES = {
  ring: [1200, 1600],
  lounge: [1600, 1200],
  floor: [1200, 1600],
  magazinesClose: [1200, 1600],
  magazinesTable: [1200, 1600],
};

// Short fallback captions describing what is in each photo. content.js can override with photos.<name>.caption.
const PHOTO_LABELS = {
  ring: 'The ring',
  lounge: 'The poster wall',
  floor: 'The training floor',
  magazinesClose: 'Old boxing magazines',
  magazinesTable: 'The magazine table',
};

export function Photo({ name, className = '', eager = false, caption = true, sizes }) {
  const photo = content.photos?.[name];
  if (!photo?.src) return null;
  const [width, height] = [photo.width ?? PHOTO_SIZES[name]?.[0] ?? 1200, photo.height ?? PHOTO_SIZES[name]?.[1] ?? 1600];
  // Only offer the -600 version when the original is actually bigger (some founder prints are smaller than 600px).
  const srcSet = width > 600 && /\.jpg$/.test(photo.src) ? `${photo.src.replace(/\.jpg$/, '-600.jpg')} 600w, ${photo.src} ${width}w` : undefined;
  const label = caption ? (photo.caption ?? PHOTO_LABELS[name] ?? null) : null;
  return <figure className={`pin ${className}`.trim()}>
    <div className="pin-frame">
      <img src={photo.src} srcSet={srcSet} sizes={srcSet ? sizes ?? '(max-width: 700px) 90vw, 600px' : undefined}
        alt={photo.alt ?? ''} width={width} height={height}
        loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} fetchPriority={eager ? 'high' : undefined}/>
    </div>
    {label ? <figcaption>{label}</figcaption> : null}
  </figure>;
}

// Shared keyboard behaviour for the booking dialog and owner panel:
// focus moves inside on open, Tab stays inside, Escape closes, focus returns to the opener on close.
export function useDialog(ref, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const opener = document.activeElement;
    const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () => [...node.querySelectorAll(selector)].filter(el => el.getClientRects().length > 0);
    (node.querySelector('[data-autofocus]') || focusables()[0] || node).focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    };
  }, [ref]);
}

// "7:00 PM" -> "7PM" for the fight-bill style timetable line.
export const billTime = time => String(time ?? '').replace(':00', '').replace(/\s+/g, '').toUpperCase();
