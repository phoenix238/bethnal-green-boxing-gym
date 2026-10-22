import React, { useRef } from 'react';
import { ArrowUpRight, Minus, Plus, ShieldCheck, X } from 'lucide-react';
import { useDialog } from './ui.jsx';

const clock = iso => { const d = iso ? new Date(iso) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : null; };
const sourceLabel = status => {
  const at = clock(status?.updatedAt);
  if (status?.source === 'sheet') return `Timetable source: Google Sheet, updated ${at ?? 'just now'}`;
  if (status?.source === 'cache') return `Timetable source: saved copy of the Google Sheet${at ? ` from ${at}` : ''} (the sheet could not be reached just now)`;
  if (status?.source === 'local') return 'Timetable source: local preview (no Google Sheet set up)';
  return 'Timetable source: Built-in default';
};

// Owner demo: everything here is stored in this browser's localStorage only. No sign-in, no shared database, no real accounts.
export default function OwnerPanel({ onClose, classes, setClasses, bookings, setBookings, members, setMembers, ledger, setLedger, accountPeriod, monthEntries, monthIncome, monthExpenses, addLedgerEntry, addMember, saveClass, timetableStatus, sheetConfigured, sheetEditUrl }) {
  const ref = useRef(null);
  useDialog(ref, onClose);
  return <div className="admin-backdrop" role="presentation" onClick={event => event.target === event.currentTarget && onClose()}>
    <section ref={ref} className="admin-panel" role="dialog" aria-modal="true" aria-labelledby="admin-title" tabIndex={-1}>
      <div className="admin-head">
        <div><p className="eyebrow eyebrow-plain">Staff tools · local demo</p><h2 id="admin-title">Gym desk</h2></div>
        <button type="button" className="icon-btn" aria-label="Close dashboard" onClick={onClose}><X aria-hidden="true"/></button>
      </div>
      <div className="admin-warning"><ShieldCheck size={18} aria-hidden="true"/><p>Demo dashboard saved in this browser only. Add secure staff sign-in and a shared database before opening it to the team. Do not enter real customer or financial information.</p></div>
      <div className="admin-stats">
        <div><span>Sessions</span><b>{classes.length}</b></div>
        <div><span>Bookings</span><b>{bookings.length}</b></div>
        <div><span>Members</span><b>{members.length}</b></div>
        <div><span>Net this month</span><b>£{(monthIncome - monthExpenses).toFixed(2)}</b></div>
      </div>

      <div className="admin-card">
        <div className="accounting-title">
          <div><p className="eyebrow eyebrow-plain">Simple cashbook · {accountPeriod}</p><h3>Money in &amp; out</h3></div>
          <div className="money-totals"><span>In <b>£{monthIncome.toFixed(2)}</b></span><span>Out <b>£{monthExpenses.toFixed(2)}</b></span></div>
        </div>
        <p className="admin-note">A simple manual record for keeping track. Not connected to the bank or payment provider.</p>
        <form className="ledger-form" onSubmit={addLedgerEntry}>
          <label>Type<select name="type"><option value="income">Money in</option><option value="expense">Money out</option></select></label>
          <label>Category<input name="category" placeholder="e.g. Class fees, rent" required/></label>
          <label>Amount (£)<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required/></label>
          <label>Date<input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required/></label>
          <label className="ledger-note">Note<input name="note" placeholder="Optional"/></label>
          <button className="btn btn-ink btn-small" type="submit">Add entry <Plus size={15} aria-hidden="true"/></button>
        </form>
        <div className="ledger-rows">
          {monthEntries.slice(0, 8).map(entry => <div className="ledger-row" key={entry.id}>
            <span className={entry.type === 'income' ? 'ledger-sign income' : 'ledger-sign expense'} aria-hidden="true">{entry.type === 'income' ? '+' : '−'}</span>
            <div><b>{entry.category}</b><small>{entry.date}{entry.note ? ` · ${entry.note}` : ''}</small></div>
            <strong>{entry.type === 'income' ? '+' : '−'}£{entry.amount.toFixed(2)}</strong>
            <button type="button" className="row-btn" aria-label="Remove ledger entry" onClick={() => setLedger(prev => prev.filter(item => item.id !== entry.id))}><X size={15} aria-hidden="true"/></button>
          </div>)}
          {monthEntries.length === 0 && <p className="admin-empty">No entries this month. Add income and costs to see your monthly total.</p>}
        </div>
      </div>


      <div className="admin-divider"><span>Classes &amp; attendance</span><span>Local demo data</span></div>

      <div className="admin-card">
        <h3>Timetable</h3>
        <p className="source-status" data-testid="timetable-source">{sourceLabel(timetableStatus)}</p>
        {sheetConfigured ? <>
          <p className="admin-note">The public timetable comes from the gym's Google Sheet. To add, change or hide a class, edit the sheet. Changes appear on the site within a few minutes (Google can take about five minutes to publish them).</p>
          {sheetEditUrl ? <a className="btn btn-ink btn-small" href={sheetEditUrl} target="_blank" rel="noopener noreferrer">Open the timetable sheet <ArrowUpRight size={15} aria-hidden="true"/></a> : <p className="admin-note">Ask whoever set up the site for the sheet link, or open it from your Google Drive.</p>}
        </> : <p className="local-only"><strong>Local preview only</strong> — set up the Google Sheet to change the real timetable (see docs/TIMETABLE.md). Sessions added here only appear in this browser.</p>}
      </div>

      {!sheetConfigured ? <>
      <form className="admin-card class-form" onSubmit={saveClass} aria-label="Add a session (local preview only)">
        <h3><Plus size={17} aria-hidden="true"/> Add a session <span className="label-optional">· local preview</span></h3>
        <div className="form-grid">
          <label>Session name<input name="title" placeholder="e.g. Boxing fundamentals" required/></label>
          <label>Level<select name="level"><option>First time</option><option>All levels</option></select></label>
          <label>Day<input name="day" placeholder="e.g. Monday" required/></label>
          <label>Start time<input name="time" type="time" required/></label>
          <label>Duration (min)<input name="duration" type="number" min="20" placeholder="Minutes" required/></label>
          <label>Public price (£)<input name="price" type="number" min="0.5" step="0.5" placeholder="10" defaultValue="10" required/></label>
          <label>Coach<input name="coach" placeholder="Coach name"/></label>
          <label>Places<input name="capacity" type="number" min="1" placeholder="Max people" required/></label>
        </div>
        <button className="btn btn-ink btn-small" type="submit">Add to timetable <Plus size={15} aria-hidden="true"/></button>
      </form>
      </> : null}

      <div className="admin-list">
        <h3>Upcoming sessions</h3>
        {classes.length ? classes.map(c => <div className="admin-row" key={c.id}>
          <div><b>{c.title}</b><span>{c.day} · {c.time} · {c.price == null ? 'price to be confirmed' : `public £${Number(c.price).toFixed(2)}`}</span></div>
          {!sheetConfigured ? <button type="button" className="row-btn" aria-label={`Remove ${c.title} on ${c.day}`} onClick={() => setClasses(prev => prev.filter(x => x.id !== c.id))}><Minus size={16} aria-hidden="true"/></button> : null}
        </div>) : <p className="admin-empty">Add the first real class and its schedule.</p>}
      </div>

      <div className="admin-list">
        <h3>Members</h3>
        <form className="member-form" onSubmit={addMember}>
          <label className="sr-only" htmlFor="member-name">Member name</label>
          <input id="member-name" name="name" placeholder="Member name" required/>
          <label className="sr-only" htmlFor="member-email">Email address</label>
          <input id="member-email" name="email" type="email" placeholder="Email address" required/>
          <button className="btn btn-ink btn-small" type="submit">Add member <Plus size={15} aria-hidden="true"/></button>
        </form>
        {members.length ? members.map((member, index) => <div className="admin-row" key={`${member.email}-${index}`}>
          <div><b>{member.name}</b><span>{member.email}</span></div>
          <button type="button" className="row-btn" aria-label={`Remove ${member.name}`} onClick={() => setMembers(prev => prev.filter((_, i) => i !== index))}><Minus size={16} aria-hidden="true"/></button>
        </div>) : <p className="admin-empty">No members saved yet.</p>}
      </div>

      <div className="admin-list">
        <h3>Booking list</h3>
        {bookings.length ? bookings.map(b => <div className="admin-row" key={b.id}>
          <div><b>{b.name}</b><span>{b.className} · {b.day} {b.time} · {b.price == null ? 'price TBC' : `£${Number(b.price).toFixed(2)}`} · {b.email}</span><small>{b.status}</small></div>
          <label className="attendance"><input type="checkbox" onChange={e => setBookings(prev => prev.map(x => x.id === b.id ? { ...x, attended: e.target.checked } : x))} checked={!!b.attended}/> Attended</label>
        </div>) : <p className="admin-empty">No bookings yet.</p>}
      </div>
    </section>
  </div>;
}
