import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, MessageCircle, Mail, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import * as content from '../content.js';
import { Eyebrow, Paragraphs, Photo, Title } from './ui.jsx';
import { BookButton } from './Classes.jsx';
import { tribute } from '../tribute.js';

// The weekly promo is separate from the live booking calendar below.
export function Hero() {
  const { hero, sessions } = content;
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
          <BookButton slug="private-one-on-one" label="Book one-to-one" className="btn btn-paper hero-secondary"/>
          {hero?.secondaryCta ? <a href="#/visit" className="btn btn-paper hero-secondary">{hero.secondaryCta} <ArrowRight size={18} aria-hidden="true"/></a> : null}
        </div>
        <div className="hero-ticket">
          <p className="hero-ticket-label">Weekly group classes</p>
          <p className="bill-line">
            {sessions.weekly.map((slot, index) => <React.Fragment key={slot}>
              {index > 0 ? <span className="bill-star" aria-hidden="true">★</span> : null}
              <span className="bill-slot">{slot}</span>
            </React.Fragment>)}
          </p>
          {sessions?.priceNote ? <p className="hero-ticket-note">£10 a class · Walk in & pay at the gym</p> : null}
          <div className="hero-ticket-private">
            <p className="hero-ticket-label">{sessions.privatePromo.title}</p>
            <BookButton slug="private-one-on-one" className="hero-private-link" label={<>{sessions.privatePromo.link} <ArrowRight size={16} aria-hidden="true"/></>}/>
          </div>
        </div>
      </div>
      <div className="hero-photo hero-film">
        <ClubVideo video={content.media.heroVideo} autoplaySound/>
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
      <DaughterTribute/>
      <div className="story-close">
        <a className="btn btn-yellow" href="#/classes">Train at the club <ArrowRight size={18} aria-hidden="true"/></a>
      </div>
    </div>
  </section>;
}

// Sound is opt-in per placement. Only the homepage requests audible autoplay;
// browser policy can still require the visitor to turn sound on themselves.
const VIDEO_MUTE_KEY = 'bgbc-hero-muted';
function ClubVideo({ video, autoplaySound = false }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [portrait, setPortrait] = useState(() => Boolean(video.mobileSrc && window.matchMedia?.('(max-width: 600px)').matches));
  const userPaused = useRef(false);
  const visible = useRef(false);
  const soundInitialized = useRef(false);
  const requestId = useRef(0);
  const src = portrait && video.mobileSrc ? video.mobileSrc : video.src;

  useEffect(() => {
    const narrow = window.matchMedia?.('(max-width: 600px)');
    const update = () => setPortrait(Boolean(video.mobileSrc && narrow?.matches));
    update();
    narrow?.addEventListener?.('change', update);
    return () => narrow?.removeEventListener?.('change', update);
  }, [video.mobileSrc]);

  const play = async () => {
    const node = ref.current;
    if (!node) return;
    const id = ++requestId.current;
    try {
      await node.play();
      if (id !== requestId.current || document.hidden || !visible.current || userPaused.current) node.pause();
    } catch (error) {
      if (id !== requestId.current || document.hidden || !visible.current || userPaused.current) return;
      if (error.name === 'NotAllowedError' && !node.muted) {
        node.muted = true;
        try {
          await node.play();
          if (id !== requestId.current || document.hidden || !visible.current || userPaused.current) node.pause();
        } catch { /* The visible Play button remains available. */ }
      }
    }
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!soundInitialized.current) {
      let savedMute = false;
      try { savedMute = sessionStorage.getItem(VIDEO_MUTE_KEY) === 'true'; } catch { /* Storage may be unavailable. */ }
      node.muted = !autoplaySound || savedMute;
      soundInitialized.current = true;
    }
    setPlaying(!node.paused);
    setMuted(node.muted);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (reduce?.matches) userPaused.current = true;
    const pause = () => { requestId.current += 1; node.pause(); };
    const resumeIfVisible = () => {
      if (visible.current && !document.hidden && !userPaused.current) play();
      else pause();
    };
    const onReduce = event => {
      if (event.matches) { userPaused.current = true; pause(); }
    };
    reduce?.addEventListener?.('change', onReduce);
    document.addEventListener('visibilitychange', resumeIfVisible);
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        visible.current = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        resumeIfVisible();
      }, { threshold: [0, 0.25], rootMargin: '-96px 0px 0px 0px' });
      observer.observe(node);
    }
    return () => {
      pause();
      observer?.disconnect();
      reduce?.removeEventListener?.('change', onReduce);
      document.removeEventListener('visibilitychange', resumeIfVisible);
    };
  }, [src, autoplaySound]);

  const toggle = () => {
    const node = ref.current;
    if (!node) return;
    if (node.paused) { userPaused.current = false; play(); }
    else { userPaused.current = true; requestId.current += 1; node.pause(); }
  };
  const toggleSound = () => {
    const node = ref.current;
    if (!node) return;
    node.muted = !node.muted;
    try { sessionStorage.setItem(VIDEO_MUTE_KEY, String(node.muted)); } catch { /* The current choice still applies. */ }
    if (!node.muted && node.paused) { userPaused.current = false; play(); }
  };
  return <figure className={`club-video${portrait ? ' club-video-portrait' : ''}`}>
    <div className="club-video-frame">
      <video ref={ref} src={src} poster={portrait ? (video.mobilePoster ?? video.poster) : video.poster} loop playsInline preload="none" aria-label={video.alt ?? 'Class video'}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEmptied={() => setPlaying(false)} onVolumeChange={event => setMuted(event.currentTarget.muted)}/>
      <div className="video-controls">
        <button type="button" className="video-toggle" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? <Pause size={18} aria-hidden="true"/> : <Play size={18} aria-hidden="true"/>}<span aria-hidden="true">{playing ? 'Pause' : 'Play'}</span>
        </button>
        {autoplaySound ? <button type="button" className="video-toggle video-sound" onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Mute video'}>
          {muted ? <VolumeX size={18} aria-hidden="true"/> : <Volume2 size={18} aria-hidden="true"/>}<span aria-hidden="true">{muted ? 'Turn sound on' : 'Mute'}</span>
        </button> : null}
      </div>
    </div>
    {video.alt || (autoplaySound && video.musicCredit) ? <figcaption>
      {video.alt ? <span>{video.caption ?? video.alt}</span> : null}
      {autoplaySound && video.musicCredit ? <details className="film-credits">
        <summary>Film &amp; music credits</summary>
        <p>Video &amp; editing by Phoenix Tanner.</p>
        <p>Music: <a href={video.musicCredit.source}>{video.musicCredit.title}</a> by {video.musicCredit.artist}. Licensed under <a href={video.musicCredit.licenseUrl}>{video.musicCredit.license}</a>.</p>
      </details> : null}
    </figcaption> : null}
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

function InstagramPost({ post }) {
  const dialog = useRef(null);
  const video = useRef(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const isVideo = post.mediaType === 'VIDEO';
  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    node.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const hidden = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener('visibilitychange', hidden);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener('visibilitychange', hidden); };
  }, [open]);
  if (failed) return null;
  return <article className="instagram-gallery-post">
    {isVideo ? <button className="instagram-preview" onClick={() => setOpen(true)} aria-label={`Play video: ${post.caption || 'Inside the club'}`}>
      <img src={post.image} alt="" loading="lazy" width="600" height="750" onError={() => setFailed(true)}/>
      <span className="instagram-format">Reel</span><span className="instagram-play"><Play size={26} fill="currentColor" aria-hidden="true"/></span>
      <span className="instagram-watch">Watch here</span>
    </button> : <a className="instagram-preview" href={post.permalink} target="_blank" rel="noopener noreferrer">
      <img src={post.image} alt={post.caption || 'Life at Bethnal Green Boxing Club'} loading="lazy" width="600" height="750" onError={() => setFailed(true)}/><span className="instagram-format">Photo <ArrowUpRight size={14}/></span>
    </a>}
    <p className="instagram-caption">{post.caption || 'Inside Bethnal Green Boxing Club'}</p>
    {open ? <dialog ref={dialog} className="instagram-player" aria-label="Instagram video player" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="instagram-player-top"><span>@bethnalgreenbc</span><button autoFocus onClick={() => setOpen(false)} aria-label="Close video"><X size={24}/></button></div>
      <video ref={video} controls autoPlay playsInline preload="metadata" poster={post.image} src={post.mediaUrl} onError={() => { setOpen(false); setFailed(true); }}/>
      <a href={post.permalink} target="_blank" rel="noopener noreferrer">View on Instagram <ArrowUpRight size={16}/></a>
    </dialog> : null}
  </article>;
}

// The endpoint is a public, server-side feed cache; account tokens never belong in Vite settings.
export function InstagramGallery() {
  const [posts, setPosts] = useState([]);
  const endpoint = (import.meta.env.VITE_INSTAGRAM_FEED_URL ?? content.instagramFeedUrl ?? '').trim();
  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(endpoint, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Feed unavailable');
      return response.json();
    }).then(data => {
      const valid = (Array.isArray(data.posts) ? data.posts : []).map(post => ({
        ...post,
        image: post.image || post.sizes?.medium?.mediaUrl || post.thumbnailUrl || (post.mediaType !== 'VIDEO' ? post.mediaUrl : undefined),
        caption: post.altText || post.prunedCaption || post.caption,
      })).filter(post => {
        try {
          const link = new URL(post.permalink);
          return link.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(link.hostname)
            && new URL(post.image).protocol === 'https:';
        } catch { return false; }
      });
      setPosts(valid.slice(0, 6));
    }).catch(() => {}).finally(() => clearTimeout(timeout));
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [endpoint]);
  return <section className="section instagram-gallery plaster" aria-labelledby="instagram-title"><div className="wrap">
    <div className="split"><div><Eyebrow>@bethnalgreenbc</Eyebrow><h2 id="instagram-title" className="h2">Life at<br/><em>the club.</em></h2></div>
      <div className="split-copy"><p className="lede">Training, familiar faces and moments between rounds. Take a look inside Bethnal Green Boxing Club.</p>
        <a className="btn btn-yellow" href={content.footer.instagram} target="_blank" rel="noopener noreferrer">Follow @bethnalgreenbc <ArrowUpRight size={18} aria-hidden="true"/><span className="sr-only"> (opens Instagram in a new tab)</span></a>
      </div></div>
    <p className="instagram-gallery-label">{posts.length ? 'Recent posts from Instagram' : 'From the gym · See our latest posts on Instagram'}</p>
    <div className="instagram-gallery-grid">{posts.length ? posts.map(post => <InstagramPost key={post.permalink} post={post}/>) : ['currentGroup', 'trainingTogether', 'trainingPartners', 'trainingWithJb', 'trainingFocus', 'trainingFootwork'].map(name => <Photo key={name} name={name} sizes="(min-width:900px) 30vw, 45vw"/>)}</div>
  </div></section>;
}

export function Join() {
  const join = content.join ?? null;
  const whatsapp = content.media?.whatsappDirect ?? null;
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
        <Photo name="trainingPartners" className="collage-wide pin-tilt-left" sizes="(min-width: 900px) 50vw, 92vw"/>
        <Photo name="trainingWithJb" className="collage-tall pin-tilt-right" sizes="(min-width: 900px) 25vw, 46vw"/>
        <Photo name="trainingFootwork" className="collage-tall pin-tilt-left-sm" sizes="(min-width: 900px) 25vw, 46vw"/>
      </div>
    </div>
  </section>;
}

export function Community({ first = false }) {
  const H = first ? 'h1' : 'h2';
  const { community } = content;
  return <section className="section community halftone" id="community" aria-labelledby="community-title">
    <div className="wrap split split-community">
      <div>
        <Eyebrow>{community?.eyebrow}</Eyebrow>
        <H id="community-title" className="h2"><Title parts={community?.heading}/></H>
      </div>
      <div className="split-copy"><Paragraphs items={community?.paragraphs}/></div>
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
      <p className="visit-contact"><a className="btn btn-whatsapp" href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/>WhatsApp {content.media.phone}</a></p>
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
          <p className="coach-summary">{person.cardBio ?? person.bio}</p>
          <p className="coach-profile-link"><a className="btn btn-paper" href={index === 0 ? '#/story' : '#/ben-doughty'}>{index === 0 ? 'Read Bernie’s story' : 'Read Ben’s full profile'} <ArrowRight size={18} aria-hidden="true"/></a></p>
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
      {doctor.note ? <p className="coach-note">{doctor.note} <a href={`mailto:${content.media.email}`}>email the club</a>.</p> : null}
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
        <Photo name="bernieArchive" className="pin-tilt-left meet-training-photo" sizes="(min-width: 960px) 40vw, 92vw"/>
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
      <p className="first-question"><a className="btn btn-yellow" href="#/faq">Read the FAQ <ArrowRight size={18}/></a><a className="btn btn-paper" href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>WhatsApp the club<ArrowUpRight size={18} aria-hidden="true"/></a></p>
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
    <p className="gallery-instagram"><a className="text-link" href={content.footer.instagram} target="_blank" rel="noopener noreferrer">More club life on Instagram <ArrowUpRight size={18}/></a></p>
    <div className="training-gallery-grid">{gallery.photos.map((name, index) => <Photo key={name} name={name} className={index === 0 ? 'gallery-group' : undefined} sizes={index === 0 ? '(min-width: 900px) 42vw, 92vw' : '(min-width: 900px) 28vw, 92vw'}/>)}</div>
  </div></section>;
}


export function SpaceHire({ compact = false, first = false }) {
  const H = first ? 'h1' : 'h2';
  const hire = content.spaceHire;
  const emailHref = `mailto:${content.media.email}?subject=${encodeURIComponent(hire.subject)}`;
  return <section className="section space-hire plaster" aria-labelledby="space-hire-title">
    <div className="wrap">
      <div className="split">
        <div><Eyebrow>{hire.eyebrow}</Eyebrow><H id="space-hire-title" className="h2"><Title parts={hire.heading}/></H></div>
        <div className="split-copy"><p className="lede">{hire.intro}</p></div>
      </div>
      {!compact ? <ul className="posters posters-4">
        {hire.uses.map((use, index) => <li className={`poster poster-${index % 3 + 1}`} key={use.title}>
          <h3 className="poster-title">{use.title}</h3><p>{use.text}</p>
        </li>)}
      </ul> : null}
      <div className="hire-location"><h2 className="h3">A boxing space in East London</h2><p>{hire.location}</p><p><a className="text-link" href="#/gym">Explore the gym</a> · <a className="text-link" href="#/visit">Entrance and access information</a></p></div>
      <p className="space-hire-enquiry">{hire.enquiry}</p>
      <a className="btn btn-yellow" href={emailHref}><Mail size={18} aria-hidden="true"/>{hire.label}<ArrowUpRight size={18} aria-hidden="true"/></a>
      <p><a className="btn btn-paper" href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer">WhatsApp about space hire <ArrowUpRight size={18}/></a></p>
      <p className="space-hire-email"><a href={emailHref}>{content.media.email}</a></p>
      {compact ? <a className="text-link" href="#/gym">Explore the club and space hire <ArrowRight size={18} aria-hidden="true"/></a> : null}
    </div>
  </section>;
}

const FAQs = [
  ['Do I need boxing experience?', 'No. Our open-level group classes welcome beginners, returning boxers and experienced participants. Tell Bernie or Ben it’s your first session.'],
  ['When are the group classes and how much are they?', 'Tuesdays at 6pm and Thursdays at 7pm. Group classes are £10 each. Check the booking calendar for current availability and any changes.'],
  ['Do I have to book?', 'You can book online or simply turn up for a group class and pay at the gym. Book one-to-one coaching with Ben through the calendar.'],
  ['What should I wear? Can I borrow gloves?', 'Wear comfortable training clothes and training shoes. We have gloves you can borrow if you need them.'],
  ['Can I train one-to-one?', 'Yes. Private coaching with head trainer Ben Doughty is £40. Choose an available time in the booking calendar.'],
  ['How do I pay?', content.paymentPolicy],
  ['Where is the entrance? Is there step-free access?', 'We’re in the basement of Proposition Studios, 279 Cambridge Heath Road, E2 0EL, down the road from York Hall. Watch the directions video on the Visit page. The gym is in the basement and there is no step-free access. Contact us on WhatsApp with any access questions before travelling.'],
  ['What about memberships, trials or cancellations?', 'Group classes are £10 per session. Contact the club on WhatsApp about membership options, trial arrangements or cancellation terms before booking.']
];

export function Faq() {
  return <section className="section plaster faq-page"><div className="wrap faq-layout">
    <div><Eyebrow>Before you come down</Eyebrow><h1 className="h2">Good questions.<br/><em>Clear answers.</em></h1><p className="lede">Your first boxing class in Bethnal Green, made a little easier.</p><a className="btn btn-yellow" href="#/visit">Plan your visit <ArrowRight size={18}/></a></div>
    <div className="faq-list">{FAQs.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}{q.includes('pay') || q.includes('entrance') || q.includes('memberships') ? <> <a href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer">WhatsApp the club</a>.</> : null}{q.includes('entrance') ? <> <a href="#/visit">Directions and contact</a>.</> : null}</p></details>)}<p>Something else on your mind? <a href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer">WhatsApp the club</a> or <a href={`mailto:${content.media.email}`}>Email the club</a>.</p></div>
  </div></section>;
}

export function ContactDock() {
  return <aside className="contact-dock" aria-label="Contact the club"><a className="dock-link dock-whatsapp" href={content.media.whatsappDirect} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/><span>WhatsApp the club</span></a><a className="dock-link dock-email" href={`mailto:${content.media.email}`}><Mail size={18} aria-hidden="true"/><span>Email the club</span></a></aside>;
}

export function OtherWays() {
  return <section className="section other-ways floor"><div className="wrap"><Eyebrow>Beyond the weekly classes</Eyebrow><div className="other-grid">
    <div><h2 className="h3">A goal in the ring?</h2><p>Talk to Bernie and Ben about white collar boxing, with medical advice through Dr Alix Daniel.</p><a className="text-link" href="#/doctor">White collar & wellbeing <ArrowRight size={18}/></a></div>
    <div><h2 className="h3">Make use of the space.</h2><p>Ask about hiring the club for your project or session.</p><a className="text-link" href="#/space-hire">Explore space hire <ArrowRight size={18}/></a></div>

  </div></div></section>;
}

function DaughterTribute() {
  const headings = new Set(['THE STORY OF A CHAMPION', 'THE MAKING OF A CHAMPION', 'THE PUNCHING POSTMAN', 'FROM MAURITIUS TO CHAMPIONSHIP GLORY']);
  return <article className="daughter-tribute" aria-labelledby="tribute-title"><p className="eyebrow">A daughter’s tribute · In her own words</p><h2 id="tribute-title" className="h2">The Punching Postman.</h2>
    <div className="tribute-text">{tribute.map((text,i) => headings.has(text) ? <h3 className="h3" key={i}>{text}</h3> : <p key={i}>{text}</p>)}</div>
  </article>;
}

export function HeadTrainer({ full = false }) {
  const ben = content.coaches.people[1];
  const H = full ? 'h1' : 'h2';
  return <section className={`section head-trainer plaster${full ? ' trainer-full' : ''}`}><div className="wrap trainer-grid">
    <Photo name="benCurrent" className="trainer-portrait" sizes="(min-width:960px) 40vw, 90vw"/>
    <div><Eyebrow>Head trainer</Eyebrow><H className="h2">Ben Doughty.<br/><em>In your corner.</em></H>
      <p className="lede">{full ? ben.bio : 'More than 40 years in boxing. Licensed manager and trainer, journalist and author. Ben brings his experience to every session, from your first class to one-to-one coaching.'}</p>
      {full ? <>
        {ben.biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p><strong>One-to-one coaching · £40</strong></p><BookButton slug={ben.slug} label="Book with Ben"/>
        <p className="trainer-podcast"><a href={ben.link.href} target="_blank" rel="noopener noreferrer">{ben.link.label} <ArrowUpRight size={16}/></a></p>
        <a className="text-link" href="#/">Back to the club <ArrowRight size={18} aria-hidden="true"/></a>
      </> : <a className="btn btn-yellow" href="#/ben-doughty">Read Ben’s full profile <ArrowRight size={18} aria-hidden="true"/></a>}
    </div>
  </div></section>;
}

export function CompactVisit() {
  return <section className="section compact-visit plaster"><div className="wrap compact-visit-inner"><div><Eyebrow>Down the road from York Hall</Eyebrow><h2 className="h3">Find your way to the club.</h2><p>279 Cambridge Heath Road, London, E2 0EL.<br/>In the basement of Proposition Studios.</p></div><div className="btn-row"><a className="btn btn-yellow" href="#/visit">Plan your visit <ArrowRight size={18}/></a><a className="text-link" href={content.visit.map.href} target="_blank" rel="noopener noreferrer">Open map <ArrowUpRight size={18}/></a></div></div></section>;
}
