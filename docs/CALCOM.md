> Update, 22 October 2026: the club has removed the Proposition Studios discount from the website. Older setup notes below are historical; use the standard £10 group rate.

# Cal.com: live timetable and bookings

Cal.com is the club's booking system. The owner manages classes, private sessions and instructors there, and the website shows the Cal.com booking page inside the timetable section.

## Set-up (owner, about 20 minutes)

1. Sign up at https://cal.com (free plan). Choose a username such as `bethnalgreenboxing`.
2. **Group classes:** create an event type per class (e.g. "Open level boxing", 60 min), turn on **seats** and set the number of places, and set the weekly availability (Tuesday and Thursday 7pm).
3. **Private sessions:** create a "1-to-1 with Bernie" event type. Later, each instructor can have their own account or event type with their own availability.
4. **Payments:** Apps → Stripe → connect a Stripe account, then on each event type set a price (£10). Stripe charges a fee per payment. Check refund and cancellation settings before going live.
5. **£5 studio-holder rate:** check whether your Cal.com plan supports discount or coupon codes. If it does not, create a separate hidden "Studio holder" event type at £5 and share its link only with studio holders.
6. Send the developer only the **username** (not a password). It goes in the hosting provider's environment variable `VITE_CAL_LINK`. That is not a secret.

## What the website does

- `VITE_CAL_LINK` set: the timetable section shows the Cal.com booking page and a "Book a class" button. The demo booking preview is no longer used.
- `VITE_CAL_LINK` empty: the site falls back to the Google Sheet timetable (docs/TIMETABLE.md) or the built-in timetable, with the demo booking preview.

## What is live once this is set up

Bookings and payments are handled by Cal.com and Stripe, not by this website. Cal.com stores customer names and emails, so mention it in the privacy notice. The owner panel on this site stays a demo.
