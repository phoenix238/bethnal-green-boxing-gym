// Timetable data: a Google Sheet the owner edits, published to the web as CSV.
// This file has no React or browser-only imports so `npm test` can run it in Node.
// See docs/TIMETABLE.md for the owner's set-up steps.

export const CACHE_KEY = 'bgbg-timetable-cache-v1';
export const FETCH_TIMEOUT_MS = 5000;

// The two confirmed sessions (HANDOFF.md). Used when no sheet is set up and nothing is cached.
export const DEFAULT_CLASSES = [
  { id: 'tuesday-open', title: 'Open level boxing', level: 'All levels', coach: null, day: 'Tuesday', time: '7:00 PM', duration: null, price: 10, communityPrice: null, capacity: null, notes: null, attendees: [] },
  { id: 'thursday-open', title: 'Open level boxing', level: 'All levels', coach: null, day: 'Thursday', time: '7:00 PM', duration: null, price: 10, communityPrice: null, capacity: null, notes: null, attendees: [] },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Small CSV parser: quoted fields, "" escapes, commas and newlines inside quotes, CRLF/LF/CR, BOM.
export function parseCSV(text) {
  const src = String(text ?? '').replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 1; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i += 1;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  // Drop completely empty lines (Sheets exports trailing blank rows).
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

// "tue", "TUES", "tuesday " -> "Tuesday". Unknown text is kept as typed.
export function normaliseDay(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  const key = text.toLowerCase().replace(/\.$/, '');
  const match = key.length >= 3 ? DAYS.find(day => day.toLowerCase().startsWith(key)) : null;
  return match ?? text;
}

// "7pm", "7:00 PM", "19:00", "7.30pm" -> { label: "7:00 PM", minutes: 1140 }. Unreadable -> raw text, sorted last.
export function normaliseTime(value) {
  const text = String(value ?? '').trim();
  const m = text.match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?$/i);
  if (!m) return { label: text, minutes: Number.POSITIVE_INFINITY };
  let hours = Number(m[1]);
  const mins = Number(m[2] ?? 0);
  const suffix = m[3]?.toLowerCase().replace(/\./g, '');
  if (mins > 59 || hours > 23 || (suffix && (hours < 1 || hours > 12))) return { label: text, minutes: Number.POSITIVE_INFINITY };
  if (suffix === 'pm' && hours < 12) hours += 12;
  if (suffix === 'am' && hours === 12) hours = 0;
  const label = `${hours % 12 || 12}:${String(mins).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
  return { label, minutes: hours * 60 + mins };
}

// "£10", "10.00", " 5 " -> number; blank or text -> null.
const toNumber = value => {
  const cleaned = String(value ?? '').replace(/[£,\s]/g, '');
  if (cleaned === '') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
const toText = value => { const t = String(value ?? '').trim(); return t === '' ? null : t; };
const HIDE = new Set(['no', 'n', 'false', '0', 'hide', 'hidden']);
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Turns parsed CSV rows (first row = headers) into timetable classes, ordered by weekday then time.
// Rows without day, time and title, or with show = no, are dropped.
export function rowsToClasses(rows) {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const col = name => headers.indexOf(name);
  const index = {
    day: col('day'), time: col('time'), title: col('title'), level: col('level'), duration: col('duration'),
    capacity: col('capacity'), price: col('price'), reduced_price: col('reduced_price'), coach: col('coach'), notes: col('notes'), show: col('show'),
  };
  const get = (row, key) => (index[key] >= 0 ? row[index[key]] ?? '' : '');
  const seen = new Map();
  const classes = [];
  rows.slice(1).forEach(row => {
    if (HIDE.has(String(get(row, 'show')).trim().toLowerCase())) return;
    const day = normaliseDay(get(row, 'day'));
    const time = normaliseTime(get(row, 'time'));
    const title = toText(get(row, 'title'));
    if (!day || !time.label || !title) return;
    const base = slug(`${day}-${time.label}-${title}`) || 'session';
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    classes.push({
      id: count > 1 ? `${base}-${count}` : base,
      title, level: toText(get(row, 'level')), coach: toText(get(row, 'coach')), day, time: time.label,
      duration: toNumber(get(row, 'duration')), capacity: toNumber(get(row, 'capacity')),
      price: toNumber(get(row, 'price')), communityPrice: toNumber(get(row, 'reduced_price')),
      notes: toText(get(row, 'notes')), attendees: [], _minutes: time.minutes,
    });
  });
  const dayRank = day => { const i = DAYS.indexOf(day); return i === -1 ? DAYS.length : i; };
  return classes
    .map((c, order) => ({ c, order }))
    .sort((a, b) => dayRank(a.c.day) - dayRank(b.c.day) || a.c._minutes - b.c._minutes || a.order - b.order)
    .map(({ c }) => { const { _minutes, ...rest } = c; return rest; });
}

export const csvToClasses = text => rowsToClasses(parseCSV(text));

// Fetches the published CSV and returns valid classes. Throws on network error, timeout, bad status or zero valid rows.
export async function fetchTimetable(url, { timeoutMs = FETCH_TIMEOUT_MS, fetchImpl = globalThis.fetch } = {}) {
  if (!url) throw new Error('No timetable URL configured');
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = setTimeout(() => controller?.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { signal: controller?.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`Timetable request failed (${response.status})`);
    const classes = csvToClasses(await response.text());
    if (!classes.length) throw new Error('Timetable sheet has no valid rows');
    return classes;
  } finally {
    clearTimeout(timer);
  }
}

// Guarded cache of the last good sheet copy, so a Google outage never blanks the timetable.
const isClass = x => x !== null && typeof x === 'object' && typeof x.id === 'string' && typeof x.day === 'string' && typeof x.time === 'string' && typeof x.title === 'string';
// Reading globalThis.localStorage itself throws when storage is blocked (sandboxed frames, some privacy modes),
// so it is looked up inside the try, never as a default parameter.
export function readCache(storage) {
  try {
    storage ??= globalThis.localStorage;
    const saved = JSON.parse(storage.getItem(CACHE_KEY));
    const classes = Array.isArray(saved?.classes) ? saved.classes.filter(isClass).map(c => ({ ...c, attendees: [] })) : [];
    return classes.length ? { classes, updatedAt: typeof saved.updatedAt === 'string' ? saved.updatedAt : null } : null;
  } catch { return null; }
}
export function writeCache(classes, storage) {
  try { (storage ?? globalThis.localStorage).setItem(CACHE_KEY, JSON.stringify({ classes, updatedAt: new Date().toISOString() })); } catch { /* storage blocked: just no cache */ }
}

// What to show before (or instead of) a live fetch. source: 'cache' | 'default'.
export function initialTimetable(storage) {
  const cached = readCache(storage);
  return cached ? { classes: cached.classes, source: 'cache', updatedAt: cached.updatedAt } : { classes: DEFAULT_CLASSES, source: 'default', updatedAt: null };
}

// Live sheet if possible, else last good copy, else built-in default. Never rejects.
export async function loadTimetable(url, options = {}) {
  const { storage, ...fetchOptions } = options;
  if (url) {
    try {
      const classes = await fetchTimetable(url, fetchOptions);
      writeCache(classes, storage);
      return { classes, source: 'sheet', updatedAt: new Date().toISOString() };
    } catch (error) {
      return { ...initialTimetable(storage), error: String(error?.message ?? error) };
    }
  }
  return initialTimetable(storage);
}
