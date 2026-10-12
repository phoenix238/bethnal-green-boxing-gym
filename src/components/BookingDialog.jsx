import React, { useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import * as content from '../content.js';
import { useDialog } from './ui.jsx';

// Preview only: nothing here reserves a place or takes a payment. Submissions are saved in this browser for the owner demo.
export default function BookingDialog({ session, onClose, onSubmit }) {
  const ref = useRef(null);
  useDialog(ref, onClose);
  const notice = content.sessions?.bookingNotice ?? 'Online booking is not open yet. This preview does not take payment or hold a place.';
  return <div className="modal-backdrop" role="presentation" onClick={event => event.target === event.currentTarget && onClose()}>
    <section ref={ref} className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" aria-describedby="booking-notice" tabIndex={-1}>
      <div className="modal-top">
        <p className="eyebrow eyebrow-plain">Booking preview</p>
        <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X aria-hidden="true"/></button>
      </div>
      <h2 id="booking-title" className="modal-title">{session.title}</h2>
      <p className="modal-sub">{session.day} · {session.time}</p>
      <div className="hazard" id="booking-notice">
        <p><strong>{notice}</strong></p>
        {session.price == null ? <p>The gym is confirming class prices and places.</p> : null}
      </div>
      <form onSubmit={event => onSubmit(event, session)}>
        <label>Rate<select name="rate" data-autofocus><option value="public">Public · £{Number(session.price ?? 10).toFixed(2)}</option><option value="community">Proposition Studios artist · £{Number(session.communityPrice ?? 5).toFixed(2)}</option></select></label>
        <label>Your name<input name="name" autoComplete="name" required/></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required/></label>
        <p className="modal-small">Demo only: details are saved in this browser, not sent to the gym.</p>
        <button className="btn btn-ink modal-submit" type="submit">Preview booking <ArrowRight size={18} aria-hidden="true"/></button>
      </form>
    </section>
  </div>;
}
