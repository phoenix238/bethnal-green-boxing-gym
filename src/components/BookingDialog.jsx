import React, { useRef } from 'react';
import { ArrowRight, MessageCircle, X } from 'lucide-react';
import * as content from '../content.js';
import { useDialog } from './ui.jsx';

// Preview only: nothing here reserves a place or takes a payment. Submissions are saved in this browser for the owner demo.
export default function BookingDialog({ session, onClose, onSubmit }) {
  const ref = useRef(null);
  const whatsapp = content.media?.whatsapp ?? null;
  const price = session.price;
  const submit = event => onSubmit(event, session);
  useDialog(ref, onClose);
  const notice = 'Demo only: this preview does not take payment or hold a place. Use the public booking calendar for real classes.';
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
        {whatsapp ? <p><a className="inline-link" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true"/> For now, message the WhatsApp group to book</a></p> : null}
      </div>
      <form onSubmit={submit}>
        <div className="price-line" aria-live="polite">
          <span>Price</span>
          <b>{price == null ? 'To be confirmed' : `£${Number(price).toFixed(2)}`}</b>
        </div>
        <label>Your name<input name="name" autoComplete="name" required data-autofocus/></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required/></label>
        <p className="modal-small">Demo only: details are saved in this browser, not sent to the gym.</p>
        <button className="btn btn-ink modal-submit" type="submit">Preview booking <ArrowRight size={18} aria-hidden="true"/></button>
      </form>
    </section>
  </div>;
}
