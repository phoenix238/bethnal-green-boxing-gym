import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Users } from 'lucide-react';
import './style.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingDialog from './components/BookingDialog.jsx';
import OwnerPanel from './components/OwnerPanel.jsx';
import { Approach, Club, Community, CtaBand, FirstClass, Hero, Meet, Join, Kit, Space, Story, Visit } from './components/Sections.jsx';
import { ClassesPage, ClassesPreview, useClasses } from './components/Classes.jsx';
import { initCal } from './calembed.js';
import { DEFAULT_CLASSES, initialTimetable, loadTimetable } from './timetable.js';

// Prototype only: all data below lives in this browser's localStorage. There is no real booking, payment, login or shared database.
const STORAGE = 'bgbg-classes-v1';
const DISCOUNT_KEY = 'bgbg-discount-v1';
// Public, non-secret settings (see docs/TIMETABLE.md and .env.example). Blank = no Google Sheet yet.
const TIMETABLE_CSV_URL = (import.meta.env.VITE_TIMETABLE_CSV_URL ?? '').trim();
const TIMETABLE_SHEET_EDIT_URL = (import.meta.env.VITE_TIMETABLE_SHEET_EDIT_URL ?? '').trim() || null;
// Drops anything that isn't a well-formed item, so old or hand-edited demo data can't blank the page.
const isObj = x => x !== null && typeof x === 'object';
const validators = {
  [STORAGE]: x => isObj(x) && typeof x.id === 'string' && typeof x.day === 'string' && typeof x.title === 'string',
  'bgbg-bookings-v1': x => isObj(x) && typeof x.id === 'string' && typeof x.name === 'string',
  'bgbg-members-v1': x => isObj(x) && typeof x.name === 'string' && typeof x.email === 'string',
  'bgbg-ledger-v1': x => isObj(x) && typeof x.date === 'string' && Number.isFinite(x.amount),
};
const load = (key, fallback) => {
  try { const saved = localStorage.getItem(key); const value = saved === null ? fallback : JSON.parse(saved); return Array.isArray(value) ? value.filter(validators[key] ?? isObj) : fallback; } catch { return fallback; }
};
// "19:30" -> "7:30 PM", matching the seeded sessions.
const formatTime = value => { const [h, m] = String(value).split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable: demo data just won't persist */ } };
// Demo discount code: a plain string in this browser. A real code must be checked on the server once payments exist.
const loadDiscount = () => { try { const v = JSON.parse(localStorage.getItem(DISCOUNT_KEY)); return typeof v === 'string' ? v : ''; } catch { return ''; } };
const normaliseCode = value => String(value ?? '').trim().toUpperCase();
// With a sheet configured the sheet (or its cached copy) is the timetable; without one, the local demo list is.
// Pages of the site. Home: hero, meet Bernie, your first class, then the classes.
const PAGE_TITLES = { home: null, classes: 'Classes', story: 'Our story', gym: 'The gym', community: 'Community', visit: 'Visit' };
const routeFor = hash => { if (hash === '' || hash === '#' || hash === '#/') return 'home'; const m = /^#\/([\w-]+)/.exec(hash); return m ? (m[1] in PAGE_TITLES ? m[1] : 'home') : null; };
const savedClasses = () => TIMETABLE_CSV_URL ? initialTimetable().classes : load(STORAGE, initialTimetable().classes ?? DEFAULT_CLASSES);
function App() {
  const [classes, setClasses] = useState(savedClasses);
  const [timetableStatus, setTimetableStatus] = useState(() => TIMETABLE_CSV_URL ? initialTimetable() : { source: 'local', updatedAt: null });
  const [discountCode, setDiscountCode] = useState(loadDiscount);
  const [dialog, setDialog] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [bookings, setBookings] = useState(() => load('bgbg-bookings-v1', []));
  const [members, setMembers] = useState(() => load('bgbg-members-v1', []));
  const [ledger, setLedger] = useState(() => load('bgbg-ledger-v1', []));
  const [accountPeriod] = useState(new Date().toISOString().slice(0, 7));
  const monthEntries = ledger.filter(entry => entry.date.startsWith(accountPeriod));
  const monthIncome = monthEntries.filter(entry => entry.type === 'income').reduce((total, entry) => total + entry.amount, 0);
  const monthExpenses = monthEntries.filter(entry => entry.type === 'expense').reduce((total, entry) => total + entry.amount, 0);
  const [flash, setFlash] = useState('');
  useEffect(() => {
    if (!TIMETABLE_CSV_URL) return undefined;
    let live = true;
    loadTimetable(TIMETABLE_CSV_URL).then(result => {
      if (!live) return;
      setClasses(result.classes);
      setTimetableStatus({ source: result.source, updatedAt: result.updatedAt, error: result.error ?? null });
    });
    return () => { live = false; };
  }, []);
  useEffect(() => { if (!TIMETABLE_CSV_URL) save(STORAGE, classes); }, [classes]);
  useEffect(() => { try { localStorage.setItem(DISCOUNT_KEY, JSON.stringify(discountCode)); } catch { /* storage unavailable */ } }, [discountCode]);
  const checkDiscount = code => Boolean(normaliseCode(discountCode)) && normaliseCode(code) === normaliseCode(discountCode);
  useEffect(() => save('bgbg-bookings-v1', bookings), [bookings]);
  useEffect(() => save('bgbg-members-v1', members), [members]);
  useEffect(() => save('bgbg-ledger-v1', ledger), [ledger]);
  // Hash routing (#/story, #/classes...) so the site works on any static host with no server rules.
  // A plain anchor (#main, #join) keeps the current page and just scrolls to it.
  const [route, setRoute] = useState(() => routeFor(window.location.hash) ?? 'home');
  useEffect(() => {
    const on = () => {
      const next = routeFor(window.location.hash);
      if (next) { setRoute(next); window.scrollTo(0, 0); document.getElementById('main')?.focus({ preventScroll: true }); return; }
      const el = document.getElementById(window.location.hash.slice(1)); if (el) el.scrollIntoView();
    };
    window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => { document.title = PAGE_TITLES[route] ? `${PAGE_TITLES[route]} · Bethnal Green Boxing Club` : 'Bethnal Green Boxing Club'; }, [route]);
  // One Cal.com fetch shared by every page; the booking pop-up script loads once the page is idle.
  const cal = useClasses();
  useEffect(() => { const id = (window.requestIdleCallback ?? (fn => setTimeout(fn, 1500)))(initCal); return () => (window.cancelIdleCallback ?? clearTimeout)(id); }, []);
  const notify = message => { setFlash(message); window.setTimeout(() => setFlash(''), 3200); };
  const addLedgerEntry = event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    setLedger(prev => [{ id: crypto.randomUUID(), type: data.get('type'), category: data.get('category'), amount: Number(data.get('amount')), date: data.get('date'), note: data.get('note') || '' }, ...prev]);
    event.currentTarget.reset(); notify('Entry saved in this browser.');
  };
  const addMember = event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const member = { name: data.get('name'), email: data.get('email') };
    if (members.some(existing => existing.email.toLowerCase() === member.email.toLowerCase())) { notify('That email is already on the member list.'); return; }
    setMembers(prev => [...prev, member]); event.currentTarget.reset(); notify('Member saved in this browser.');
  };
  const saveClass = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item = { id: crypto.randomUUID(), title: data.get('title'), level: data.get('level'), coach: data.get('coach') || null, day: data.get('day'), time: formatTime(data.get('time')), duration: Number(data.get('duration')), price: Number(data.get('price')), communityPrice: Number(data.get('communityPrice')), capacity: Number(data.get('capacity')), attendees: [] };
    setClasses(prev => [...prev, item]); event.currentTarget.reset(); notify('Session added to the timetable.');
  };
  const book = (event, session) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const rate = session.communityPrice != null && checkDiscount(data.get('discount')) ? 'community' : 'public';
    const record = { id: crypto.randomUUID(), classId: session.id, className: session.title, day: session.day, time: session.time, name: data.get('name'), email: data.get('email'), rate, price: rate === 'community' ? Number(session.communityPrice) : session.price == null ? null : Number(session.price), status: 'Demo only — unpaid' };
    setBookings(prev => [...prev, record]);
    setDialog(null); notify('Demo request saved in this browser. No payment or real reservation was made.');
  };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header route={route}/>
    <main id="main" tabIndex={-1}>
      {route === 'home' ? <><Hero cal={cal}/><Meet/><FirstClass/><ClassesPreview cal={cal}/></> : null}
      {route === 'classes' ? <ClassesPage cal={cal}/> : null}
      {route === 'story' ? <Story first/> : null}
      {route === 'gym' ? <><Space first/><Club/><Approach/><CtaBand/></> : null}
      {route === 'community' ? <><Community first/><Kit/><Join/></> : null}
      {route === 'visit' ? <><Visit first/><Join/><CtaBand/></> : null}
    </main>
    <Footer onOwnerDemo={() => setAdmin(true)} route={route}/>
    <div className="toast-region" role="status" aria-live="polite">{flash && <div className="toast"><Check size={17} aria-hidden="true"/>{flash}</div>}</div>
    {dialog && <BookingDialog session={dialog} onClose={() => setDialog(null)} onSubmit={book} checkDiscount={checkDiscount}/>}
    {admin && <OwnerPanel onClose={() => setAdmin(false)} classes={classes} setClasses={setClasses} bookings={bookings} setBookings={setBookings} members={members} setMembers={setMembers} ledger={ledger} setLedger={setLedger} accountPeriod={accountPeriod} monthEntries={monthEntries} monthIncome={monthIncome} monthExpenses={monthExpenses} addLedgerEntry={addLedgerEntry} addMember={addMember} saveClass={saveClass} timetableStatus={timetableStatus} sheetConfigured={Boolean(TIMETABLE_CSV_URL)} sheetEditUrl={TIMETABLE_SHEET_EDIT_URL} discountCode={discountCode} setDiscountCode={setDiscountCode}/>}
    <button type="button" className="admin-shortcut" aria-label="Open owner demo" title="Owner demo (browser-only data)" onClick={() => setAdmin(true)}><Users size={18} aria-hidden="true"/></button>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
