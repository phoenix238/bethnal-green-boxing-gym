import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MessageCircle, Pause, Play, Users } from 'lucide-react';
import * as content from '../content.js';
import { Eyebrow, Paragraphs, Photo, Title, billTime } from './ui.jsx';
import { Logo } from './Header.jsx';

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
        {content.media?.logo?.src ? <div className="hero-badge"><Logo eager/></div> : null}
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

// When the owner sets VITE_CAL_LINK (their Cal.com username or a full cal.com URL), Cal.com becomes the live timetable and booking system.
// The Cal.com profile page lists every event type (classes, private sessions). Not a secret, so it lives in the code and works on any host.
const CAL_LINK = (import.meta.env.VITE_CAL_LINK ?? '').trim() || 'jb-jb-2ejhn3';
const CAL_URL = CAL_LINK ? (CAL_LINK.startsWith('http') ? CAL_LINK : `https://cal.com/${CAL_LINK.replace(/^\/+/, '')}`) : null;

export function Timetable({ classes, onBook }) {
  const { sessions } = content;
  if (CAL_URL) return <section className="section timetable floor" id="timetable" aria-labelledby="timetable-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="02">{sessions?.eyebrow}</Eyebrow>
          <h2 id="timetable-title" className="h2"><Title parts={sessions?.heading}/></h2>
        </div>
        <div className="split-copy">
          <Paragraphs items={sessions?.intro} className="lede"/>
          <a className="btn btn-yellow" href={CAL_URL} target="_blank" rel="noopener">Book a class <ArrowRight size={18} aria-hidden="true"/></a>
        </div>
      </div>
      <div className="bill cal-embed">
        <iframe title="Book a class with Bethnal Green Boxing Club (Cal.com)" src={`${CAL_URL}${CAL_URL.includes('?') ? '&' : '?'}embed=true&theme=light`} loading="lazy"/>
        {sessions?.priceNote ? <p className="bill-foot">{sessions.priceNote}</p> : null}
      </div>
    </div>
  </section>;
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
                  {c.notes ? <p className="bout-notes">{c.notes}</p> : null}
                </div>
              </div>
              <div className="bout-stub">
                <p className="bout-price">{c.price == null ? 'Price to be confirmed' : <>{money(c.price)}{c.communityPrice != null ? <small> / {money(c.communityPrice)} with a studio-holder code</small> : null}</>}</p>
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

const SCRAPBOOK = [
  { name: 'founderMagazine', tilt: 'tilt-a' },
  { name: 'founderYorkHall', tilt: 'tilt-b' },
  { name: 'founderCelebrates', tilt: 'tilt-c' },
  { name: 'founderSparring', tilt: 'tilt-d' },
];

export function Story() {
  const { story } = content;
  const quote = story?.quote ?? null;
  const pro = story?.pro ?? null;
  const prints = SCRAPBOOK.filter(item => content.photos?.[item.name]?.src);
  const hasHero = Boolean(content.photos?.founderPostbox?.src);
  return <section className="section story plaster" id="story" aria-labelledby="story-title">
    <div className="wrap">
      <div className={hasHero ? 'story-grid' : 'story-grid story-grid-single'}>
        {hasHero ? <div className="story-photo">
          <Photo name="founderPostbox" className="pin-tilt-left" sizes="(min-width: 960px) 40vw, 92vw"/>
        </div> : null}
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
      {prints.length ? <div className="scrapbook" role="group" aria-label="Scrapbook: the founder's boxing years">
        {prints.map(item => <Photo key={item.name} name={item.name} className={`scrap ${item.tilt}`} sizes="(min-width: 960px) 24vw, 46vw"/>)}
      </div> : null}
      {pro?.heading || pro?.paragraphs ? <div className="story-chapter">
        <div>
          <p className="chapter-mark" aria-hidden="true">Round two</p>
          {pro.heading ? <h3 className="h3"><Title parts={pro.heading}/></h3> : null}
        </div>
        <div className="chapter-copy"><Paragraphs items={pro.paragraphs}/></div>
      </div> : null}
    </div>
  </section>;
}

// Muted looping class video. Loads only when scrolled into view, never autoplays with reduced motion,
// and always has a visible play/pause button.
function ClubVideo({ video }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) userPaused.current = true;
    const onReduce = event => { if (event.matches) { userPaused.current = true; node.pause(); } };
    reduce?.addEventListener?.('change', onReduce);
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !userPaused.current) node.play().catch(() => {});
        else if (!entry.isIntersecting) node.pause();
      }, { threshold: 0.25 });
      observer.observe(node);
    }
    return () => { observer?.disconnect(); reduce?.removeEventListener?.('change', onReduce); };
  }, []);
  const toggle = () => {
    const node = ref.current;
    if (!node) return;
    if (node.paused) { userPaused.current = false; node.play().catch(() => {}); }
    else { userPaused.current = true; node.pause(); }
  };
  return <figure className="club-video">
    <div className="club-video-frame">
      <video ref={ref} src={video.src} poster={video.poster} muted loop playsInline preload="none" aria-label={video.alt ?? 'Class video'}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
      <button type="button" className="video-toggle" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
        {playing ? <Pause size={18} aria-hidden="true"/> : <Play size={18} aria-hidden="true"/>}<span aria-hidden="true">{playing ? 'Pause' : 'Play'}</span>
      </button>
    </div>
    {video.alt ? <figcaption>{video.alt}</figcaption> : null}
  </figure>;
}

export function Club() {
  const club = content.club ?? null;
  const video = content.media?.video?.src ? content.media.video : null;
  const hasPhotos = content.photos?.clubGroup?.src || content.photos?.clubGroup2?.src;
  if (!club && !video && !hasPhotos) return null;
  return <section className="section club floor" id="club" aria-labelledby="club-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="04">{club?.eyebrow ?? 'The club'}</Eyebrow>
          <h2 id="club-title" className="h2"><Title parts={club?.heading ?? 'The club'}/></h2>
        </div>
        <div className="split-copy"><Paragraphs items={club?.text} className="lede"/></div>
      </div>
      <div className="club-grid">
        {video ? <ClubVideo video={video}/> : null}
        <Photo name="clubGroup" className="club-photo-wide pin-tilt-right" sizes="(min-width: 960px) 34vw, 92vw"/>
        <Photo name="clubGroup2" className="club-photo-tall pin-tilt-left-sm" sizes="(min-width: 960px) 24vw, 70vw"/>
      </div>
    </div>
  </section>;
}

export function Join() {
  const join = content.join ?? null;
  const whatsapp = content.media?.whatsapp ?? null;
  if (!whatsapp) return null;
  return <section className="section join" id="join" aria-labelledby="join-title">
    <div className="wrap join-inner">
      <div>
        <Eyebrow no="07">{join?.eyebrow ?? 'Join us'}</Eyebrow>
        <h2 id="join-title" className="h2"><Title parts={join?.heading ?? ['Join the', 'WhatsApp group.']}/></h2>
        <Paragraphs items={join?.text} className="lede"/>
        {join?.note ? <p className="join-note">{join.note}</p> : null}
      </div>
      <a className="btn btn-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={20} aria-hidden="true"/> {join?.button ?? 'Join the WhatsApp group'} <ArrowUpRight size={16} aria-hidden="true"/>
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    </div>
  </section>;
}

export function Space() {
  const { gym } = content;
  return <section className="section space plaster-dark" id="space" aria-labelledby="space-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow no="05">{gym?.eyebrow}</Eyebrow>
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
        <Eyebrow no="06">{community?.eyebrow}</Eyebrow>
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
        <Eyebrow no="08">{shop?.eyebrow}</Eyebrow>
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
      <Eyebrow no="09">{visit?.eyebrow}</Eyebrow>
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
