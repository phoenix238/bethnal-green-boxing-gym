import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, MessageCircle, Mail, Pause, Play } from 'lucide-react';
import * as content from '../content.js';
import { Eyebrow, Paragraphs, Photo, Title } from './ui.jsx';
import { BookButton, nextSessions } from './Classes.jsx';
import { formatSlot } from '../calclasses.js';

// The hero's ticket shows the next few class dates straight from Cal.com, so it never goes out of date.
export function Hero({ cal }) {
  const { hero, sessions } = content;
  const next = nextSessions(cal?.classes ?? []);
  return <section className="hero plaster" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-heading">
        <div className="hero-tags">
          {hero?.eyebrow ? <span className="tag tag-red">{hero.eyebrow}</span> : null}
        </div>
        <h1 id="hero-title" className="hero-title"><Title parts={hero?.title}/></h1>
      </div>
      <div className="hero-copy">
        <Paragraphs items={hero?.lede} className="hero-lede"/>
        <div className="hero-actions">
          <BookButton slug="boxingmixedlevels" label={<>{hero?.primaryCta ?? 'Book a class'} <ArrowRight size={18} aria-hidden="true"/></>} className="btn btn-yellow"/>
          {hero?.secondaryCta ? <BookButton slug="private-one-on-one" label={<>{hero.secondaryCta} <ArrowRight size={18} aria-hidden="true"/></>} className="btn btn-paper"/> : null}
        </div>
        {next.length ? <div className="hero-ticket">
          <p className="hero-ticket-label">Next up</p>
          <p className="bill-line">
            {next.map((slot, index) => <React.Fragment key={slot.iso + slot.slug}>
              {index > 0 ? <span className="bill-star" aria-hidden="true">★</span> : null}
              <span className="bill-slot">{formatSlot(slot.iso)}</span>
            </React.Fragment>)}
          </p>
          {sessions?.priceNote ? <p className="hero-ticket-note">{sessions.priceNote}</p> : null}
        </div> : null}
      </div>
      <div className="hero-photo hero-film">
        <ClubVideo video={content.media.heroVideo}/>
        <p className="hero-film-note">{content.media.heroVideo.note}</p>
      </div>
    </div>
  </section>;
}

export function Approach({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { approach } = content;
  const values = Array.isArray(approach?.values) ? approach.values : [];
  return <section className="section approach plaster" id="approach" aria-labelledby="approach-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{approach?.eyebrow}</Eyebrow>
          <H id="approach-title" className="h2"><Title parts={approach?.heading}/></H>
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

const SCRAPBOOK = [
  { name: 'founderMagazine', tilt: 'tilt-a' },
  { name: 'founderYorkHall', tilt: 'tilt-b' },
  { name: 'founderCelebrates', tilt: 'tilt-c' },
  { name: 'founderSparring', tilt: 'tilt-d' },
];

export function Story({ first = false }) {
  const H = first ? 'h1' : 'h2';
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
          <Eyebrow>{story?.eyebrow}</Eyebrow>
          <H id="story-title" className="h2"><Title parts={story?.heading}/></H>
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
      {pro?.heading || pro?.paragraphs ? <div className="bill-poster">
        <p className="chapter-mark" aria-hidden="true">Round two</p>
        {pro.heading ? <h2 className="bill-poster-title"><Title parts={pro.heading}/></h2> : null}
        <p className="bill-poster-meta" aria-hidden="true">Bethnal Green <span>★</span> A place to train <span>★</span> A place to belong</p>
        <div className="bill-poster-copy"><Paragraphs items={pro.paragraphs}/></div>
      </div> : null}
      <div className="story-close">
        <a className="btn btn-yellow" href="#/classes">Train at the club <ArrowRight size={18} aria-hidden="true"/></a>
      </div>
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
          <Eyebrow>{club?.eyebrow ?? 'The club'}</Eyebrow>
          <h2 id="club-title" className="h2"><Title parts={club?.heading ?? 'The club'}/></h2>
        </div>
        <div className="split-copy"><Paragraphs items={club?.text} className="lede"/></div>
      </div>
      <div className="club-grid">
        {video ? <ClubVideo video={video}/> : null}
        <Photo name="clubGroup" className="club-photo-wide pin-tilt-right" sizes="(min-width: 960px) 34vw, 92vw"/>
        <Photo name="trainingFocus" className="club-photo-tall pin-tilt-left-sm" sizes="(min-width: 960px) 24vw, 70vw"/>
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
        <Eyebrow>{join?.eyebrow ?? 'Join us'}</Eyebrow>
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

export function Space({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { gym } = content;
  return <section className="section space plaster-dark" id="space" aria-labelledby="space-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{gym?.eyebrow}</Eyebrow>
          <H id="space-title" className="h2"><Title parts={gym?.heading}/></H>
        </div>
        <div className="split-copy"><Paragraphs items={gym?.paragraphs}/></div>
      </div>
      <div className="collage">
        <Photo name="lounge" className="collage-wide pin-tilt-left" sizes="(min-width: 900px) 50vw, 92vw"/>
        <Photo name="floor" className="collage-tall pin-tilt-right" sizes="(min-width: 900px) 25vw, 46vw"/>
        <Photo name="trainingFootwork" className="collage-tall pin-tilt-left-sm" sizes="(min-width: 900px) 25vw, 46vw"/>
      </div>
    </div>
  </section>;
}

export function Community({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { community } = content;
  const goals = Array.isArray(community?.goals) ? community.goals : [];
  return <section className="section community halftone" id="community" aria-labelledby="community-title">
    <div className="wrap split split-community">
      <div>
        <Eyebrow>{community?.eyebrow}</Eyebrow>
        <H id="community-title" className="h2"><Title parts={community?.heading}/></H>
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
        <Eyebrow>{shop?.eyebrow}</Eyebrow>
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

export function Visit({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { visit } = content;
  const items = Array.isArray(visit?.items) ? visit.items : [];
  return <section className="section visit plaster" id="visit" aria-labelledby="visit-title">
    <div className="wrap">
      <Eyebrow>{visit?.eyebrow}</Eyebrow>
      <H id="visit-title" className="h2"><Title parts={visit?.heading}/></H>
      {items.length ? <dl className="tickets">
        {items.map((item, index) => <div className="ticket" key={index}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>)}
      </dl> : null}
      <p className="visit-directions"><a className="btn btn-yellow" href={visit.map.href} target="_blank" rel="noopener noreferrer">{visit.map.label} <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (opens Google Maps in a new tab)</span></a></p>
      {visit.directions ? <div className="visit-directions"><p>{visit.directions.note}</p><a className="btn btn-paper" href={visit.directions.href} target="_blank" rel="noopener noreferrer">{visit.directions.label} <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (opens Facebook in a new tab)</span></a></div> : null}
    </div>
  </section>;
}

export function CtaBand() {
  const { site } = content;
  const cta = content.cta ?? null; // optional export; falls back to the tagline and hero button text
  const heading = cta?.heading ?? site?.tagline;
  return <section className="cta halftone-red" aria-labelledby="cta-title">
    <div className="wrap cta-inner">
      <h2 id="cta-title" className="cta-title"><Title parts={heading}/></h2>
      {cta?.text ? <p className="cta-text">{cta.text}</p> : null}
      <a className="btn btn-yellow" href="#/classes">{cta?.button ?? 'See the classes'} <ArrowRight size={18} aria-hidden="true"/></a>
    </div>
  </section>;
}

// Gym: the coaches, as two fight-bill cards.
export function Coaches({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { coaches } = content;
  const people = Array.isArray(coaches?.people) ? coaches.people : [];
  if (!people.length) return null;
  return <section className="section coaches plaster" aria-labelledby="coaches-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{coaches.eyebrow}</Eyebrow>
          <H id="coaches-title" className="h2"><Title parts={coaches.heading}/></H>
        </div>
        {coaches.lede ? <div className="split-copy"><p className="lede">{coaches.lede}</p></div> : null}
      </div>
      <ul className="posters posters-2">
        {people.map((person, index) => <li className={`poster poster-${index === 0 ? 1 : 3}`} key={person.name}>
          <span className="poster-no">{person.role}</span>
          {person.photo ? <Photo name={person.photo} className="coach-photo" caption={false} sizes="(min-width: 760px) 40vw, 90vw"/> : null}
          <h3 className="poster-title">{person.name}</h3>
          <p>{person.bio}</p>
          {person.note ? <p className="coach-note">{person.note}</p> : null}
          {person.book ? <p><BookButton slug={person.slug} label={<>{person.book} <ArrowRight size={18} aria-hidden="true"/></>} className="btn btn-yellow"/></p> : null}
          {person.link ? <p><a className="btn btn-paper" href={person.link.href} target={person.link.external ? "_blank" : undefined} rel={person.link.external ? "noopener noreferrer" : undefined}>{person.link.label} {person.link.external ? <ArrowUpRight size={18} aria-hidden="true"/> : <ArrowRight size={18} aria-hidden="true"/>}{person.link.external ? <span className="sr-only"> (opens YouTube in a new tab)</span> : null}</a></p> : null}
        </li>)}
      </ul>
    </div>
  </section>;
}

// Medical advisor introduction and planned club involvement.
export function Doctor({ first = false }) {
  const { doctor } = content;
  if (!doctor) return null;
  const person = doctor.person;
  const H = first ? 'h1' : 'h2';
  return <section className="section doctor plaster" aria-labelledby="doctor-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{doctor.eyebrow}</Eyebrow>
          <H id="doctor-title" className="h2"><Title parts={doctor.heading}/></H>
        </div>
        <div className="split-copy"><p className="lede">{doctor.lede}</p></div>
      </div>
      <Paragraphs items={doctor.paragraphs}/>
      {doctor.interest ? <div className="doctor-interest">
        <h2 className="h3">{doctor.interest.heading}</h2><p>{doctor.interest.text}</p>
        <a className="btn btn-yellow" href={doctor.interest.href}><Mail size={18} aria-hidden="true"/>{doctor.interest.label}<ArrowUpRight size={18} aria-hidden="true"/></a>
      </div> : null}
      {doctor.profileHeading ? <h2 className="h3 doctor-profile-heading">{doctor.profileHeading}</h2> : null}
      {person ? <ul className="posters posters-2"><li className="poster poster-1">
        <span className="poster-no">{person.role}</span>
        {person.photo ? <Photo name={person.photo} className="coach-photo" caption={false}/> : null}
        <h3 className="poster-title">{person.name}</h3>
        <p>{person.bio}</p>
        <Paragraphs items={person.paragraphs}/>
      </li></ul> : null}
      {person?.link ? <p><a className="btn btn-paper" href={person.link.href} target="_blank" rel="noopener noreferrer">{person.link.label} <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (opens in a new tab)</span></a></p> : null}
      {doctor.note ? <p className="coach-note">{doctor.note}</p> : null}
    </div>
  </section>;
}

// Home: a short, personal hello from the coach, linking on to the full story.
export function Meet() {
  const { meet } = content;
  if (!meet) return null;
  return <section className="section section-tight meet floor" aria-labelledby="meet-title">
    <div className="wrap meet-grid">
      <div className="meet-photo">
        <Photo name="trainingFocusPortrait" className="pin-tilt-left" sizes="(min-width: 960px) 40vw, 92vw"/>
      </div>
      <div className="meet-copy">
        <Eyebrow>{meet.eyebrow}</Eyebrow>
        <h2 id="meet-title" className="h2"><Title parts={meet.heading}/></h2>
        <Paragraphs items={meet.paragraphs}/>
        {meet.link ? <a className="btn btn-paper" href={meet.link.href}>{meet.link.label} <ArrowRight size={18} aria-hidden="true"/></a> : null}
      </div>
    </div>
  </section>;
}

// Home: what a first class looks like, as numbered fight-bill cards.
export function FirstClass() {
  const { firstClass } = content;
  const steps = Array.isArray(firstClass?.steps) ? firstClass.steps : [];
  if (!steps.length) return null;
  return <section className="section first-class plaster" aria-labelledby="first-class-title">
    <div className="wrap">
      <div className="split">
        <div>
          <Eyebrow>{firstClass.eyebrow}</Eyebrow>
          <h2 id="first-class-title" className="h2"><Title parts={firstClass.heading}/></h2>
        </div>
        {firstClass.intro ? <div className="split-copy"><p className="lede">{firstClass.intro}</p></div> : null}
      </div>
      <ol className="posters posters-4">
        {steps.map((step, index) => <li className={`poster poster-${(index % 3) + 1}`} key={index}>
          <span className="poster-no" aria-hidden="true">Step {String(index + 1).padStart(2, '0')}</span>
          <h3 className="poster-title">{step.title}</h3>
          <p>{step.text}</p>
        </li>)}
      </ol>
      <p className="first-question"><a className="btn btn-paper" href={`mailto:${content.media.email}`}><Mail size={18} aria-hidden="true"/>{firstClass.question}<ArrowUpRight size={18} aria-hidden="true"/></a></p>
    </div>
  </section>;
}

// Two clear booking routes, reusing the site's existing fight-bill cards.
export function TrainingOptions() {
  const { trainingOptions } = content;
  return <section className="section plaster" aria-labelledby="training-title"><div className="wrap">
    <Eyebrow>{trainingOptions.eyebrow}</Eyebrow>
    <h2 id="training-title" className="h2"><Title parts={trainingOptions.heading}/></h2>
    <ul className="posters posters-2">{trainingOptions.options.map((option, index) => <li className={`poster poster-${index === 0 ? 1 : 3}`} key={option.slug}>
      <h3 className="poster-title">{option.title}</h3><p>{option.text}</p><p className="coach-note">{option.note}</p>
      <p><BookButton slug={option.slug} label={option.label} className="btn btn-yellow"/></p>
    </li>)}</ul>
  </div></section>;
}

// Current SSD photographs, visible on the homepage rather than buried in the club page.
export function TrainingGallery() {
  const gallery = content.trainingGallery;
  return <section className="section training-gallery floor" aria-labelledby="gallery-title"><div className="wrap">
    <div className="split"><div><Eyebrow>{gallery.eyebrow}</Eyebrow><h2 id="gallery-title" className="h2"><Title parts={gallery.heading}/></h2></div>
    <div className="split-copy"><p className="lede">{gallery.text}</p><a className="text-link" href={gallery.link.href}>{gallery.link.label} <ArrowRight size={18} aria-hidden="true"/></a></div></div>
    <div className="training-gallery-grid">{gallery.photos.map((name, index) => <Photo key={name} name={name} className={index === 0 ? 'gallery-group' : undefined} sizes={index === 0 ? '(min-width: 900px) 42vw, 92vw' : '(min-width: 900px) 28vw, 92vw'}/>)}</div>
  </div></section>;
}
