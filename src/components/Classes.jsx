import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock3, Users } from 'lucide-react';
import * as content from '../content.js';
import { fetchClasses, cachedClasses, formatSlot } from '../calclasses.js';
import { openCal } from '../calembed.js';
import { Eyebrow, Paragraphs, Title } from './ui.jsx';

// The Cal.com profile that powers the class list and bookings. Not a secret, so it lives in the code and works on any host.
export const CAL_USER = (import.meta.env.VITE_CAL_LINK ?? '').trim().replace(/^https?:\/\/cal\.com\//, '').replace(/\/.*$/, '') || 'jb-jb-2ejhn3';
export const CAL_PROFILE_URL = `https://cal.com/${CAL_USER}`;

// Loads the live class list from Cal.com. Falls back to the last good copy, then to an empty list with status 'error'.
export function useClasses() {
  const [state, setState] = useState(() => { const cached = cachedClasses(CAL_USER); return { status: cached ? 'cached' : 'loading', classes: cached ?? [] }; });
  useEffect(() => {
    let live = true;
    fetchClasses(CAL_USER)
      .then(classes => { if (live) setState({ status: 'live', classes }); })
      .catch(() => { if (live) setState(prev => ({ status: prev.classes.length ? 'cached' : 'error', classes: prev.classes })); });
    return () => { live = false; };
  }, []);
  return state;
}

// Yellow Book button: opens the Cal.com calendar in a pop-up on this site (falls back to Cal.com in a new tab).
export function BookButton({ slug, label = 'Book', title, className = 'btn btn-yellow btn-small', onOpen }) {
  const calLink = slug ? `${CAL_USER}/${slug}` : CAL_USER;
  return <a className={className} href={`https://cal.com/${calLink}`} target="_blank" rel="noopener" onClick={event => { onOpen?.(); openCal(event, calLink); }}
    aria-label={title ? `Book ${title}` : undefined}>{label}</a>;
}

// Next few group-class dates across every class, soonest first: the hero's "next up" line.
export function nextSessions(classes, limit = 3) {
  const group = classes.filter(c => c.kind === 'group');
  return (group.length ? group : classes)
    .flatMap(c => (c.next ?? []).map(iso => ({ iso, title: c.title, slug: c.slug })))
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .slice(0, limit);
}

function ClassCard({ c, full }) {
  return <li className="class-card">
    <div className="class-card-main">
      <h3 className="class-card-title">{c.title}</h3>
      <p className="class-card-meta">
        {c.minutes ? <span><Clock3 size={15} aria-hidden="true"/>{c.minutes} min</span> : null}
        {c.places ? <span><Users size={15} aria-hidden="true"/>{c.places} places</span> : null}
        {c.price ? <span className="class-card-price">{c.price}</span> : null}
      </p>
      {c.description ? <p className={full ? 'class-card-desc' : 'class-card-desc class-card-desc-short'}>{c.description}</p> : null}
      {c.next?.length ? <p className="class-card-next"><b>Next:</b> {c.next.map(formatSlot).filter(Boolean).join(' · ')}</p> : null}
    </div>
    <BookButton slug={c.slug} title={c.title}/>
  </li>;
}

function Status({ status, count }) {
  const t = content.classesPage ?? {};
  if (status === 'loading') return <p className="class-status" role="status">Loading classes…</p>;
  if (status === 'error') return <p className="class-status" role="status">{t.error ?? 'We couldn’t load the class list just now.'} <a href={CAL_PROFILE_URL} target="_blank" rel="noopener">See classes on Cal.com</a></p>;
  if (!count) return <p className="class-status" role="status">{t.empty ?? 'No classes are listed right now. Check back soon.'}</p>;
  return null;
}

// Home page section (the second and last one on the home page): a short "range of classes" teaser that always reflects Cal.com.
export function ClassesPreview({ cal }) {
  const { sessions } = content;
  const { status, classes } = cal;
  const group = classes.filter(c => c.kind === 'group');
  const shown = (group.length ? group : classes).slice(0, 3);
  return <section className="section timetable floor" id="timetable" aria-labelledby="timetable-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{sessions?.eyebrow}</Eyebrow>
          <h2 id="timetable-title" className="h2"><Title parts={sessions?.heading}/></h2>
        </div>
        <div className="split-copy">
          <Paragraphs items={sessions?.intro} className="lede"/>
          <div className="btn-row">
            <a className="btn btn-yellow" href="#/classes">See all classes <ArrowRight size={18} aria-hidden="true"/></a>
            <BookButton label="Book a class" className="btn btn-ghost-light"/>
          </div>
        </div>
      </div>
      <div className="bill">
        <Status status={status} count={shown.length}/>
        {shown.length ? <ul className="class-list">{shown.map(c => <ClassCard key={c.slug} c={c}/>)}</ul> : null}
        {classes.length > shown.length ? <p className="bill-foot"><a href="#/classes">+ {classes.length - shown.length} more: see the full list</a></p> : null}
        {sessions?.priceNote ? <p className="bill-foot">{sessions.priceNote}</p> : null}
      </div>
    </div>
  </section>;
}

// Full page at #/classes: every class and private session with its description, straight from Cal.com.
export function ClassesPage({ cal }) {
  const t = content.classesPage ?? {};
  const { status, classes } = cal;
  const group = classes.filter(c => c.kind === 'group');
  const priv = classes.filter(c => c.kind === 'private');
  return <section className="section classes-page" aria-labelledby="classes-title">
    <div className="wrap">
      <Eyebrow>{t.eyebrow}</Eyebrow>
      <h1 id="classes-title" className="h2"><Title parts={t.heading}/></h1>
      <Paragraphs items={t.intro} className="lede"/>
      <Status status={status} count={classes.length}/>
      {group.length ? <>
        <h2 className="h3 class-group-title">{t.groupHeading ?? 'Group classes'}</h2>
        <ul className="class-list">{group.map(c => <ClassCard key={c.slug} c={c} full/>)}</ul>
      </> : null}
      {priv.length ? <>
        <h2 className="h3 class-group-title">{t.privateHeading ?? 'Private sessions'}</h2>
        <ul className="class-list">{priv.map(c => <ClassCard key={c.slug} c={c} full/>)}</ul>
      </> : null}
      <p className="class-foot">{content.sessions?.priceNote}</p>
      <p className="class-foot"><BookButton label="See the full booking calendar" className="text-link"/></p>
    </div>
  </section>;
}
