// Exercise the component's browser/media side effects with deterministic media-policy
// responses. Real browser rendering and event-driven button labels are checked separately.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/components/Sections.jsx', import.meta.url), 'utf8');
const component = source.slice(source.indexOf('const VIDEO_MUTE_KEY'), source.indexOf('  return <figure className={`club-video'))
  + '\nreturn { src, portrait, toggle, toggleSound }; }';
const tick = () => new Promise(resolve => setImmediate(resolve));

function mount({ sound = true, reduced = false, narrow = false, savedMute, rejectAudible = false, deferred = false } = {}) {
  const listeners = new Map();
  const storage = new Map(savedMute === undefined ? [] : [['bgbc-hero-muted', String(savedMute)]]);
  const document = { hidden: false, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const media = new Map();
  const matchMedia = query => {
    if (!media.has(query)) media.set(query, { matches: query.includes('reduced') ? reduced : narrow, addEventListener: (_, fn) => { media.get(query).listener = fn; }, removeEventListener: () => {} });
    return media.get(query);
  };
  let rejectPending, resolvePending;
  const node = {
    muted: false, paused: true, attempts: [],
    play() {
      this.attempts.push({ muted: this.muted });
      if (deferred && this.attempts.length === 1) return new Promise((resolve, reject) => {
        rejectPending = reject;
        resolvePending = () => { this.paused = false; resolve(); };
      });
      if (rejectAudible && !this.muted) return Promise.reject(Object.assign(new Error('User gesture required'), { name: 'NotAllowedError' }));
      this.paused = false;
      return Promise.resolve();
    },
    pause() { this.paused = true; },
  };
  const hooks = [];
  let cursor = 0, scheduled = [], dirty = false, observer, result;
  const same = (a, b) => a && a.length === b.length && a.every((x, i) => Object.is(x, b[i]));
  const context = vm.createContext({
    window: { matchMedia, IntersectionObserver: true }, document,
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    IntersectionObserver: class { constructor(fn) { this.fn = fn; observer = this; } observe() {} disconnect() {} },
    useRef(value) { const i = cursor++; hooks[i] ??= { current: i === 0 ? node : value }; return hooks[i]; },
    useState(value) { const i = cursor++; if (!(i in hooks)) hooks[i] = typeof value === 'function' ? value() : value; return [hooks[i], next => { if (!Object.is(hooks[i], next)) { hooks[i] = next; dirty = true; } }]; },
    useEffect(fn, deps) { const i = cursor++; if (!same(hooks[i]?.deps, deps)) scheduled.push(() => { hooks[i]?.cleanup?.(); hooks[i] = { deps, cleanup: fn() }; }); },
  });
  vm.runInContext(component, context);
  const render = () => {
    do {
      dirty = false; cursor = 0; scheduled = [];
      result = context.ClubVideo({ video: { src: 'landscape.mp4', mobileSrc: 'portrait.mp4' }, autoplaySound: sound });
      for (const effect of scheduled) effect();
    } while (dirty);
    return result;
  };
  render();
  return {
    node, storage, render, get result() { return result; },
    show(value = true) { observer.fn([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]); },
    intersect(ratio) { observer.fn([{ isIntersecting: ratio > 0, intersectionRatio: ratio }]); },
    hidden(value) { document.hidden = value; listeners.get('visibilitychange')?.(); },
    reduce(value) { const m = matchMedia('(prefers-reduced-motion: reduce)'); m.matches = value; m.listener?.({ matches: value }); },
    resize(value) { const m = matchMedia('(max-width: 600px)'); m.matches = value; m.listener?.({ matches: value }); render(); },
    rejectPending() { rejectPending(Object.assign(new Error('Denied'), { name: 'NotAllowedError' })); },
    resolvePending() { resolvePending(); },
  };
}

const cases = [
  ['hero requests audible playback when visible', async () => {
    const h = mount(); assert.equal(h.node.attempts.length, 0); h.show(); await tick();
    assert.equal(h.node.attempts[0].muted, false); assert.equal(h.node.paused, false);
  }],
  ['autoplay rejection retries muted without losing the sound control', async () => {
    const h = mount({ rejectAudible: true }); h.show(); await tick();
    assert.deepEqual(h.node.attempts.map(x => x.muted), [false, true]); assert.equal(h.node.paused, false);
    h.result.toggleSound(); assert.equal(h.node.muted, false);
  }],
  ['explicit mute is remembered and applied to a new hero', async () => {
    const h = mount(); h.show(); await tick(); h.result.toggleSound();
    assert.equal(h.storage.get('bgbc-hero-muted'), 'true');
    const next = mount({ savedMute: true }); next.show(); await tick(); assert.equal(next.node.attempts[0].muted, true);
  }],
  ['non-hero video remains muted even when session preference is sound on', async () => {
    const h = mount({ sound: false, savedMute: false }); h.show(); await tick(); assert.equal(h.node.muted, true);
  }],
  ['reduced motion prevents autoplay but allows explicit Play', async () => {
    const h = mount({ reduced: true }); h.show(); await tick(); assert.equal(h.node.attempts.length, 0);
    h.result.toggle(); await tick(); assert.equal(h.node.paused, false);
    h.reduce(true); assert.equal(h.node.paused, true);
  }],
  ['offscreen and hidden-tab pausing resume only when visible', async () => {
    const h = mount(); h.show(); await tick(); h.hidden(true); assert.equal(h.node.paused, true);
    h.show(); await tick(); assert.equal(h.node.paused, true);
    h.hidden(false); await tick(); assert.equal(h.node.paused, false);
    h.show(false); assert.equal(h.node.paused, true); h.hidden(true); h.hidden(false); await tick(); assert.equal(h.node.paused, true);
  }],
  ['explicit Pause survives visibility changes', async () => {
    const h = mount(); h.show(); await tick(); h.result.toggle(); h.show(false); h.show(); h.hidden(true); h.hidden(false); await tick(); assert.equal(h.node.paused, true);
  }],
  ['mobile selects portrait and resizing preserves the mute choice', async () => {
    const h = mount({ narrow: true }); assert.equal(h.result.src, 'portrait.mp4');
    h.show(); await tick(); h.result.toggleSound(); h.resize(false); assert.equal(h.result.src, 'landscape.mp4');
    h.show(); await tick(); assert.equal(h.node.muted, true);
  }],
  ['an obsolete denied play request cannot restart a hidden video', async () => {
    const h = mount({ deferred: true }); h.show(); h.hidden(true); h.rejectPending(); await tick();
    assert.equal(h.node.attempts.length, 1); assert.equal(h.node.paused, true);
  }],
  ['scrolling past most of the video pauses its music before the last edge leaves view', async () => {
    const h = mount(); h.intersect(0.7); await tick(); assert.equal(h.node.paused, false);
    h.intersect(0.2); assert.equal(h.node.paused, true);
    h.intersect(0); assert.equal(h.node.paused, true);
  }],
  ['a late successful play request cannot restart music after scrolling away', async () => {
    const h = mount({ deferred: true }); h.show(); h.show(false); h.resolvePending(); await tick();
    assert.equal(h.node.paused, true);
  }],
];
for (const [name, test] of cases) { await test(); console.log(`ok  ${name}`); }
console.log(`\n${cases.length}/${cases.length} video behavior checks passed`);
