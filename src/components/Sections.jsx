import React from 'react';
import { ArrowDown, ArrowRight, Clock3, Users } from 'lucide-react';
import * as content from '../content.js';
import { Eyebrow, Paragraphs, Photo, Title, billTime } from './ui.jsx';

const money = value => `£${Number(value).toFixed(2).replace(/\.00$/, '')}`;

// "TUESDAY 7PM ★ THURSDAY 7PM", built from the live timetable state rather than typed copy.
function BillLine({ classes, className = '' }) {
  if (!classes.length) return null;
  return <p className={`bill-line ${className}`.trim()}>
    {classes.map((session, index) => <React.Fragment key={session.id}>
      {index > 0 ? <span className="bill-star" aria-hidden="true">★</span> : null}
      <span className="bill-slot">{session.day} {billTime(session.time)}</span>
    </React.Fragment>)}
  </p>;
}

export function Hero({ classes }) {
  const { hero, sessions } = content;
  return <section className="hero plaster" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-copy">
        <div className="hero-tags">
          {hero?.eyebrow ? <span className="tag tag-red">{hero.eyebrow}</span> : null}
        </div>
        <h1 id="hero-title" className="hero-title"><Title parts={hero?.title}/></h1>
        {hero?.lede ? <p className="hero-lede">{hero.lede}</p> : null}
        <div className="hero-actions">
          <a className="btn btn-yellow" href="#timetable">{hero?.primaryCta} <ArrowRight size={18} aria-hidden="true"/></a>
          {hero?.secondaryCta ? <a className="btn btn-paper" href="#story">{hero.secondaryCta} <ArrowDown size={18} aria-hidden="true"/></a> : null}
        </div>
        {classes.length ? <div className="hero-ticket">
          <BillLine classes={classes}/>
          {sessions?.priceNote ? <p className="hero-ticket-note">{sessions.priceNote}</p> : null}
        </div> : null}
      </div>
      <div className="hero-photo">
        <Photo name="ring" eager className="pin-tilt-right" sizes="(min-width: 900px) 40vw, 92vw"/>
      </div>
    </div>
  </section>;
}

export function Approach() {
  const { approach } = content;
  const values = Array.isArray(approach?.values) ? approach.values : [];
  return <section className="section approach plaster" id="approach" aria-labelledby="approach-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="01">{approach?.eyebrow}</Eyebrow>
          <h2 id="approach-title" className="h2"><Title parts={approach?.heading}/></h2>
        </div>
        <div className="split-copy">
          {approach?.lede ? <p className="lede">{approach.lede}</p> : null}
          <Paragraphs items={approach?.body}/>
        </div>
      </div>
      {values.length ? <ol className="posters">
        {values.map((value, index) => <li className={`poster poster-${(index % 3) + 1}`} key={index}>
          <span className="poster-no" aria-hidden="true">No. {String(index + 1).padStart(2, '0')}</span>
          <h3 className="poster-title">{value.title}</h3>
          <p>{value.text}</p>
        </li>)}
      </ol> : null}
    </div>
  </section>;
}

export function Timetable({ classes, onBook }) {
  const { sessions } = content;
  return <section className="section timetable floor" id="timetable" aria-labelledby="timetable-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="02">{sessions?.eyebrow}</Eyebrow>
          <h2 id="timetable-title" className="h2"><Title parts={sessions?.heading}/></h2>
        </div>
        <div className="split-copy">
          <Paragraphs items={sessions?.intro} className="lede"/>
        </div>
      </div>

      <div className="bill">
        <div className="bill-head">
          <span className="bill-count">{classes.length ? `${classes.length} ${classes.length === 1 ? 'session' : 'sessions'} a week` : 'Timetable in the making'}</span>
          <span className="stamp">Booking not yet open</span>
        </div>
        {classes.length ? <>
          <BillLine classes={classes} className="bill-line-big"/>
          <ul className="bouts">
            {classes.map(c => <li className="bout" key={c.id}>
              <div className="bout-main">
                <p className="bout-day">{c.day}</p>
                <div className="bout-info">
                  <h3 className="bout-title">{c.title}</h3>
                  <p className="bout-meta">
                    {c.level ? <span className="pill">{c.level}</span> : null}
                    <span><Clock3 size={15} aria-hidden="true"/>{c.time}{c.duration ? ` · ${c.duration} min` : ''}</span>
                    <span><Users size={15} aria-hidden="true"/>{c.capacity ? `${c.capacity} places` : 'Places to be confirmed'}</span>
                    {c.coach && c.coach !== 'Gym coach' ? <span>With {c.coach}</span> : null}
                  </p>
                </div>
              </div>
              <div className="bout-stub">
                <p className="bout-price">{c.price == null ? 'Price to be confirmed' : <>{money(c.price)} <small>/ {money(c.communityPrice ?? 5)} Proposition Studios</small></>}</p>
                <button type="button" className="btn btn-yellow btn-small" onClick={() => onBook(c)} aria-label={`Booking preview for ${c.title}, ${c.day} ${c.time}`}>Booking preview</button>
              </div>
            </li>)}
          </ul>
        </> : <p className="bill-empty">No sessions are on the timetable right now. Check back soon.</p>}
        {sessions?.priceNote ? <p className="bill-foot">{sessions.priceNote}</p> : null}
      </div>
    </div>
  </section>;
}

export function Story() {
  const { story } = content;
  const quote = story?.quote ?? null;
  return <section className="section story plaster" id="story" aria-labelledby="story-title">
    <div className="wrap story-grid">
      <div className="story-photo">
        <Photo name="magazinesClose" className="pin-tilt-left" sizes="(min-width: 900px) 34vw, 80vw"/>
      </div>
      <div className="story-copy">
        <Eyebrow no="03">{story?.eyebrow}</Eyebrow>
        <h2 id="story-title" className="h2"><Title parts={story?.heading}/></h2>
        <Paragraphs items={story?.paragraphs}/>
        {quote?.text ? <figure className="quote">
          <blockquote><p>{quote.text}</p></blockquote>
          {quote.attribution || quote.needsSignOff ? <figcaption>
            {quote.attribution ? <span className="quote-by">{quote.attribution}</span> : null}
            {quote.needsSignOff ? <span className="draft-mark" title="This wording is waiting for the founder's approval">Draft wording</span> : null}
          </figcaption> : null}
        </figure> : null}
      </div>
    </div>
  </section>;
}

export function Space() {
  const { gym } = content;
  return <section className="section space plaster-dark" id="space" aria-labelledby="space-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="04">{gym?.eyebrow}</Eyebrow>
          <h2 id="space-title" className="h2"><Title parts={gym?.heading}/></h2>
        </div>
        <div className="split-copy"><Paragraphs items={gym?.paragraphs}/></div>
      </div>
      <div className="collage">
        <Photo name="lounge" className="collage-wide pin-tilt-left" sizes="(min-width: 900px) 50vw, 92vw"/>
        <Photo name="floor" className="collage-tall pin-tilt-right" sizes="(min-width: 900px) 25vw, 46vw"/>
        <Photo name="magazinesTable" className="collage-tall pin-tilt-left-sm" sizes="(min-width: 900px) 25vw, 46vw"/>
      </div>
    </div>
  </section>;
}

export function Community() {
  const { community } = content;
  const goals = Array.isArray(community?.goals) ? community.goals : [];
  return <section className="section community halftone" id="community" aria-labelledby="community-title">
    <div className="wrap split split-community">
      <div>
        <Eyebrow no="05">{community?.eyebrow}</Eyebrow>
        <h2 id="community-title" className="h2"><Title parts={community?.heading}/></h2>
        <Paragraphs items={community?.paragraphs}/>
      </div>
      {goals.length ? <div className="aims" role="group" aria-labelledby="aims-title">
        <div className="aims-head">
          <h3 id="aims-title" className="aims-title">Aims</h3>
          {community?.note ? <p className="aims-note">{community.note}</p> : null}
        </div>
        <ol className="aims-list">
          {goals.map((goal, index) => <li key={index}><span className="aims-no" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{goal}</span></li>)}
        </ol>
      </div> : null}
    </div>
  </section>;
}

export function Kit() {
  const { shop, site } = content;
  return <section className="section kit floor" id="kit" aria-labelledby="kit-title">
    <div className="wrap split split-kit">
      <div>
        <Eyebrow no="06">{shop?.eyebrow}</Eyebrow>
        <h2 id="kit-title" className="h2"><Title parts={shop?.heading}/></h2>
        <Paragraphs items={shop?.text} className="lede"/>
      </div>
      <div className="tag-art" aria-hidden="true">
        <div className="hangtag">
          <span className="hangtag-hole"/>
          <span className="hangtag-name">{site?.name}</span>
          <span className="hangtag-rule"/>
          <span className="hangtag-status">{shop?.status}</span>
        </div>
      </div>
      {shop?.status ? <p className="sr-only">{shop.status}</p> : null}
    </div>
  </section>;
}

export function Visit() {
  const { visit } = content;
  const items = Array.isArray(visit?.items) ? visit.items : [];
  return <section className="section visit plaster" id="visit" aria-labelledby="visit-title">
    <div className="wrap">
      <Eyebrow no="07">{visit?.eyebrow}</Eyebrow>
      <h2 id="visit-title" className="h2"><Title parts={visit?.heading}/></h2>
      {items.length ? <dl className="tickets">
        {items.map((item, index) => <div className="ticket" key={index}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>)}
      </dl> : null}
    </div>
  </section>;
}

export function CtaBand() {
  const { site, hero } = content;
  const cta = content.cta ?? null; // optional export; falls back to the tagline and hero button text
  const heading = cta?.heading ?? site?.tagline;
  return <section className="cta halftone-red" aria-labelledby="cta-title">
    <div className="wrap cta-inner">
      <h2 id="cta-title" className="cta-title"><Title parts={heading}/></h2>
      {cta?.text ? <p className="cta-text">{cta.text}</p> : null}
      <a className="btn btn-yellow" href="#timetable">{cta?.button ?? hero?.primaryCta} <ArrowRight size={18} aria-hidden="true"/></a>
    </div>
  </section>;
}
