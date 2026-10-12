import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, Users } from 'lucide-react';
import './style.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BookingDialog from './components/BookingDialog.jsx';
import OwnerPanel from './components/OwnerPanel.jsx';
import { Approach, Community, CtaBand, Hero, Kit, Space, Story, Timetable, Visit } from './components/Sections.jsx';

// Prototype only: all data below lives in this browser's localStorage. There is no real booking, payment, login or shared database.
const STORAGE = 'bgbg-classes-v1';
const initialClasses = [
  { id: 'tuesday-open', title: 'Open level boxing', level: 'All levels', coach: null, day: 'Tuesday', time: '7:00 PM', duration: null, price: 10, communityPrice: 5, capacity: null, attendees: [] },
  { id: 'thursday-open', title: 'Open level boxing', level: 'All levels', coach: null, day: 'Thursday', time: '7:00 PM', duration: null, price: 10, communityPrice: 5, capacity: null, attendees: [] },
];
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
const savedClasses = () => load(STORAGE, initialClasses);
function App() {
  const [classes, setClasses] = useState(savedClasses);
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
  useEffect(() => save(STORAGE, classes), [classes]);
  useEffect(() => save('bgbg-bookings-v1', bookings), [bookings]);
  useEffect(() => save('bgbg-members-v1', members), [members]);
  useEffect(() => save('bgbg-ledger-v1', ledger), [ledger]);
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
    const rate = data.get('rate');
    const record = { id: crypto.randomUUID(), classId: session.id, className: session.title, day: session.day, time: session.time, name: data.get('name'), email: data.get('email'), rate, price: rate === 'community' ? Number(session.communityPrice ?? 5) : Number(session.price ?? 10), status: 'Demo only — unpaid' };
    setBookings(prev => [...prev, record]);
    setDialog(null); notify('Demo request saved in this browser. No payment or real reservation was made.');
  };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header/>
    <main id="main">
      <Hero classes={classes}/>
      <Approach/>
      <Timetable classes={classes} onBook={setDialog}/>
      <Story/>
      <Space/>
      <Community/>
      <Kit/>
      <Visit/>
      <CtaBand/>
    </main>
    <Footer onOwnerDemo={() => setAdmin(true)}/>
    <div className="toast-region" role="status" aria-live="polite">{flash && <div className="toast"><Check size={17} aria-hidden="true"/>{flash}</div>}</div>
    {dialog && <BookingDialog session={dialog} onClose={() => setDialog(null)} onSubmit={book}/>}
    {admin && <OwnerPanel onClose={() => setAdmin(false)} classes={classes} setClasses={setClasses} bookings={bookings} setBookings={setBookings} members={members} setMembers={setMembers} ledger={ledger} setLedger={setLedger} accountPeriod={accountPeriod} monthEntries={monthEntries} monthIncome={monthIncome} monthExpenses={monthExpenses} addLedgerEntry={addLedgerEntry} addMember={addMember} saveClass={saveClass}/>}
    <button type="button" className="admin-shortcut" aria-label="Open owner demo" title="Owner demo (browser-only data)" onClick={() => setAdmin(true)}><Users size={18} aria-hidden="true"/></button>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
