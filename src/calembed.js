// Opens Cal.com's booking calendar in a pop-up on this website, using Cal.com's official embed script.
// If the script can't load (offline, blocked), the booking link opens in a new tab instead.
const SRC = 'https://app.cal.com/embed/embed.js';
let failed = false;
let scriptLoaded = false;

// Cal.com's standard loader snippet: queues calls until embed.js has loaded.
function loader() {
  (function (C, A, L) {
    const p = (a, ar) => { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal; const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        const s = d.head.appendChild(d.createElement('script'));
        s.src = A; s.async = true;
        s.addEventListener('load', () => { scriptLoaded = true; });
        s.addEventListener('error', () => { failed = true; });
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
        else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, SRC, 'init');
}

let ready = false;
export function initCal() {
  if (ready || typeof window === 'undefined') return;
  ready = true;
  loader();
  window.Cal('init', { origin: 'https://cal.com' });
  window.Cal('ui', { theme: 'light', layout: 'month_view', hideEventTypeDetails: false });
}

// calLink is "username" (all classes) or "username/event-slug" (one class).
export function openCal(event, calLink) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return; // "open in new tab" still works
  initCal();
  if (failed || !scriptLoaded || typeof window.Cal !== 'function') return; // let the link open Cal.com normally
  event.preventDefault();
  window.Cal('modal', { calLink, config: { layout: 'month_view' } });
}
