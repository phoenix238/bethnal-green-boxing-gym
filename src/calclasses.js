// Reads the club's public Cal.com profile so the website lists whatever classes exist in Cal.com.
// Nothing here is secret: these are the same public endpoints Cal.com's own booking page uses.
const API = 'https://api.cal.com/v2';
const CACHE_KEY = 'bgbg-cal-cache-v1';

// Event types whose title looks like a private/1-to-1 session are grouped separately from group classes.
const PRIVATE = /\b(private|1[\s-]?(to|2)[\s-]?1|one[\s-]to[\s-]one|personal training|pt)\b/i;
// Cal.com's built-in starter events. Owners are meant to hide or delete these, but never show them to the public.
const STARTER = /^(15|30) min meeting$/i;

const GBP = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

export function formatPrice(minorUnits, currency) {
  const amount = Number(minorUnits) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return null;
  let text;
  try { text = new Intl.NumberFormat('en-GB', { style: 'currency', currency: String(currency || 'gbp').toUpperCase() }).format(amount); }
  catch { text = GBP.format(amount); }
  return text.replace(/\.00$/, '');
}

// Turns Cal.com event-type objects into the small shape the site needs. Drops hidden and starter events.
export function normaliseEventTypes(data, username) {
  if (!Array.isArray(data)) return [];
  return data
    .filter(e => e && typeof e === 'object' && typeof e.title === 'string' && typeof e.slug === 'string')
    .filter(e => !e.hidden && !STARTER.test(e.title.trim()))
    .map(e => ({
      id: e.id,
      slug: e.slug,
      title: e.title.trim(),
      description: typeof e.description === 'string' ? e.description.trim() : '',
      minutes: Number.isFinite(e.lengthInMinutes) ? e.lengthInMinutes : null,
      price: formatPrice(e.price, e.currency),
      places: Number.isFinite(e.seats?.seatsPerTimeSlot) ? e.seats.seatsPerTimeSlot : null,
      kind: PRIVATE.test(e.title) ? 'private' : 'group',
      url: e.bookingUrl || `https://cal.com/${username}/${e.slug}`,
    }));
}

// Hide elapsed or malformed dates from both fresh and saved schedules.
export function upcomingSlots(slots, now = Date.now()) {
  return Array.isArray(slots) ? slots.filter(iso => typeof iso === 'string' && Date.parse(iso) > now).sort((a, b) => Date.parse(a) - Date.parse(b)) : [];
}

// Next few dates for one event type, as ISO strings.
export function normaliseSlots(data, limit = 3) {
  if (!data || typeof data !== 'object') return [];
  return Object.values(data).flat().map(s => s?.start).filter(s => typeof s === 'string').sort().slice(0, limit);
}

async function getJson(url, version, signal) {
  const response = await fetch(url, { headers: { 'cal-api-version': version }, signal });
  if (!response.ok) throw new Error(`Cal.com ${response.status}`);
  return response.json();
}

export async function fetchClasses(username, { timeoutMs = 6000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const json = await getJson(`${API}/event-types?username=${encodeURIComponent(username)}`, '2024-06-14', controller.signal);
    const classes = normaliseEventTypes(json.data, username);
    const start = new Date(); const end = new Date(Date.now() + 21 * 864e5);
    const day = d => d.toISOString().slice(0, 10);
    await Promise.all(classes.map(async c => {
      try {
        const slots = await getJson(`${API}/slots?username=${encodeURIComponent(username)}&eventTypeSlug=${encodeURIComponent(c.slug)}&start=${day(start)}&end=${day(end)}&timeZone=Europe%2FLondon`, '2024-09-04', controller.signal);
        c.next = normaliseSlots(slots.data);
      } catch { c.next = []; }
    }));
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ username, classes, at: Date.now() })); } catch { /* storage unavailable */ }
    return classes;
  } finally { clearTimeout(timer); }
}

// Last good copy, so the page still lists classes if Cal.com is briefly unreachable.
export function cachedClasses(username) {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!saved || saved.username !== username || !Array.isArray(saved.classes) || !Number.isFinite(saved.at) || Date.now() - saved.at > 864e5 || saved.at > Date.now()) return null;
    return saved.classes.filter(c => c && typeof c === 'object' && typeof c.slug === 'string' && typeof c.title === 'string').map(c => ({ ...c, next: upcomingSlots(c.next) }));
  } catch { return null; }
}

export const formatSlot = iso => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London' });
  const time = d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/London' }).replace(':00', '').replace(' ', '');
  return `${date}, ${time}`;
};
