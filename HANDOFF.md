# Project handover

This file is the durable handover for the owner and any developer or assistant continuing the work. Keep it updated in the GitHub repository whenever a decision or project status changes.

## Goal and audience

Build a welcoming, affordable website for a new community boxing gym in Bethnal Green. The gym is for local people, including beginners; the tone should be personal, grounded, confident, and supportive rather than like a chain fitness business. The site needs a public class timetable and, in a later production version, a straightforward way for the owner to manage classes, attendance, members, and finances.

## Confirmed owner decisions

- There are currently two classes: Tuesday and Thursday evenings at 7pm.
- Both classes are open level and beginner-friendly.
- The owner is currently the only person managing the gym.
- The public price is £10 per class.
- The reduced price is £5 for people who belong to Proposition Studios, the building where the gym is based. The exact eligibility check still needs agreement.
- The owner wants instant reservation with online payment eventually, and a manager view to add/remove classes and handle attendance and members.
- Class capacity, duration, exact location/address, refund/cancellation rules, and actual payment/accounting workflow have not been confirmed.
- Merchandise artwork and the existing logo are expected from the owner. Do not create a replacement logo; current artwork is a temporary typographic treatment.

## Founder story and copy guardrails

The recordings have since been supplied and machine-transcribed; see [docs/INTERVIEW_NOTES.md](docs/INTERVIEW_NOTES.md) for what they say and what still needs confirming (it includes a professional career with titles, which must be confirmed with the founder before going on the site). The original note below was written before the recordings were available. The owner-provided background says the founder started boxing at about 15 at Finchley Boxing Club, trained there for around three years, then moved with brothers Steve and John to Tottenham New Enterprise Boxing Club. All three boxed competitively and travelled from Highgate to Tottenham. The founder recalls being underestimated by a trainer, persevering, and later winning amateur bouts. Do not add titles, dates, quotes, or embellishments. Check all founder-story copy against the full recordings when they become available.

The owner shared Proposition Studios' artist studios page for context: https://www.propositionstudios.com/artiststudios . It was not accessible for research from the build environment, so do not claim any further details about the building based on it.

## Current implementation

React + Vite front-end. `src/main.jsx` holds the app state and the guarded `localStorage` helpers; page sections, the booking dialog and the owner panel are in `src/components/`; styles are in `src/style.css`; all public copy comes from `src/content.js`. Fonts (Anton and Archivo) load from Google Fonts in `index.html`. It has a responsive single-page site (hero, approach, fight-bill timetable, story, photo collage of the space, community aims, kit teaser, find us), the initial two-session timetable, a demo booking dialog, and an owner demo panel with class management, demo members/attendance, and a simple manual monthly cashbook. The demo persists in browser `localStorage` only.

**Important:** this is not a live booking or management system. The booking form does not reserve a real place or charge a card. There is no user login, shared database, payment provider, bank connection, or real accounting integration. Never enter real member, customer, or financial data in the demo. The site should not be marketed as accepting live bookings or payments until those systems are implemented and tested.

## Change log

- First demo draft (team pass): five real gym photos added in `public/photos` (location metadata stripped). Public copy moved to `src/content.js` so it can be fact-checked in one place. Visual direction follows the founder's wish for a rustic, old-school look based on the gym's own fight posters. The site now shows the name **Bethnal Green Boxing Club**, as printed on the ring canvas and said in the interview; the repository is still called "boxing-gym". Owner to confirm the official name. The founder's professional titles are deliberately left off until he confirms the wording. Any interview quote on the site is marked as draft wording.

- Added `docs/INTERVIEW_NOTES.md` summarising both recordings. It records new facts (a £25/£40 monthly subscription idea, rustic old-school design wish, community page, minibus fundraising goal, club name question) as unconfirmed.

- Story copy now restates only the owner-supplied background (Finchley Boxing Club, Tottenham New Enterprise Boxing Club, brothers Steve and John, competitive boxing, underestimated then later won amateur bouts). The earlier draft used "his brothers" and "brotherhood", which were not in the source; the founder's pronouns are unconfirmed, so copy avoids them. Still needs checking against the recordings.
- Timetable badge reads "BOOKING NOT YET OPEN" and the dialog is labelled "Booking preview" so the public page does not imply live booking.
- Local storage reads/writes are now guarded, so corrupt or blocked storage no longer blanks the page.

## Open questions for the owner (demo draft)

- Official name: "Bethnal Green Boxing Club" (ring canvas, interview) or "Bethnal Green Boxing Gym"?
- How the founder wants to be named and referred to on the site. Copy currently says "our founder" throughout. In the recording he introduces himself as "Mr. Paul", so "he" and a name would read more naturally once he approves.
- Sign-off for the one quote on the site ("It breaks you down to build you up."), taken from the machine transcript.
- Whether the professional titles can be stated, and in what exact words.

## Run and verify

From the repository directory:

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Open the exact URL Vite prints in the same development environment/browser preview. If the chosen port is already in use, Vite prints a different port; use that printed URL. Stop the server with Ctrl+C in its terminal. Verify a production build with:

```sh
npm run build
```

## Suggested next work

1. Get the interview files and verify the story and voice; replace any unsupported copy.
2. Confirm the gym address, class duration/capacity, cancellation/refund rules, and how Proposition Studios membership eligibility will be checked.
3. Choose and implement a small production stack. Supabase (authentication and database) and Stripe Checkout were discussed as options, not selected or configured. Do not ask the owner to paste credentials into chat or commit them.
4. Protect the owner dashboard with authentication and authorization; store bookings, classes, attendance, and members centrally with backups and privacy-conscious retention.
5. For payments, use hosted checkout and verify payment status server-side with signed webhooks before confirming a place. Handle capacity races, refunds, cancellations, and failed payments.
6. Decide whether the cashbook is sufficient or whether the owner needs accounting software/export. Do not present a manual demo ledger as accounting advice or tax records.
7. Add the provided logo, merchandise artwork, and real gym photos once supplied. Merchandise checkout remains a future foundation, not an implemented shop.
8. Before launch, test booking/payment flows, dashboard permissions, accessibility, mobile layout, backups, and recovery.

## Handover between Codex and Claude

Use this GitHub repository as the shared checkpoint. Before changing code, the next assistant should read `CLAUDE.md`, `HANDOFF.md`, and `README.md`, then inspect the current branch and uncommitted changes. Commit completed work with a clear message and push it to GitHub or open a pull request so the other assistant sees the same state. Do not overwrite or discard another assistant's uncommitted changes. Update this handover when decisions change. Keep secrets in the deployment host's secret manager; a shared handover is project context, never a shared password.

Suggested message to Claude after opening the GitHub repository:

> Please continue the Bethnal Green Boxing Gym website from this repository. Read `CLAUDE.md`, `HANDOFF.md`, and `README.md` first. Preserve the confirmed owner decisions and the prototype/live-service boundaries. Tell me what you found and what you plan to change, then work in small reviewable commits. Do not invent founder facts or request/commit secret credentials.
