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
- The owner supplied the club logo (`public/logo.jpg`, black background, so it is only placed on black). Merchandise artwork is still expected. Do not create a replacement logo.

## Founder story and copy guardrails

The recordings have since been supplied and machine-transcribed; see [docs/INTERVIEW_NOTES.md](docs/INTERVIEW_NOTES.md) for what they say and what still needs confirming (it includes a professional career with titles, which must be confirmed with the founder before going on the site). The original note below was written before the recordings were available. The owner-provided background says the founder started boxing at about 15 at Finchley Boxing Club, trained there for around three years, then moved with brothers Steve and John to Tottenham New Enterprise Boxing Club. All three boxed competitively and travelled from Highgate to Tottenham. The founder recalls being underestimated by a trainer, persevering, and later winning amateur bouts. Do not add titles, dates, quotes, or embellishments. Check all founder-story copy against the full recordings when they become available.

The owner shared Proposition Studios' artist studios page for context: https://www.propositionstudios.com/artiststudios . It was not accessible for research from the build environment, so do not claim any further details about the building based on it.

## Current implementation

React + Vite front-end. `src/main.jsx` holds the app state and the guarded `localStorage` helpers; page sections, the booking dialog and the owner panel are in `src/components/`; styles are in `src/style.css`; all public copy comes from `src/content.js`. Fonts (Anton and Archivo) load from Google Fonts in `index.html`. It has a responsive single-page site (hero, approach, fight-bill timetable, story, photo collage of the space, community aims, kit teaser, find us), the initial two-session timetable, a demo booking dialog, and an owner demo panel with class management, demo members/attendance, and a simple manual monthly cashbook. The demo persists in browser `localStorage` only.

**Important:** this is not a live booking or management system. The booking form does not reserve a real place or charge a card. There is no user login, shared database, payment provider, bank connection, or real accounting integration. Never enter real member, customer, or financial data in the demo. The site should not be marketed as accepting live bookings or payments until those systems are implemented and tested.

## Change log

- First demo draft (team pass): five real gym photos added in `public/photos` (location metadata stripped). Public copy moved to `src/content.js` so it can be fact-checked in one place. Visual direction follows the founder's wish for a rustic, old-school look based on the gym's own fight posters. The site now shows the name **Bethnal Green Boxing Club**, as printed on the ring canvas and said in the interview; the repository is still called "boxing-gym". Owner to confirm the official name. The founder's professional titles are deliberately left off until he confirms the wording. Any interview quote on the site is marked as draft wording.

- Added `docs/INTERVIEW_NOTES.md` summarising both recordings. It records new facts (a £25/£40 monthly subscription idea, rustic old-school design wish, community page, minibus fundraising goal, club name question) as unconfirmed.

- Story copy now restates only the owner-supplied background (Finchley Boxing Club, Tottenham New Enterprise Boxing Club, brothers Steve and John, competitive boxing, underestimated then later won amateur bouts). The earlier draft used "his brothers" and "brotherhood", which were not in the source; the founder's pronouns are unconfirmed, so copy avoids them. Checked against the machine transcript of the recordings.
- Timetable badge reads "BOOKING NOT YET OPEN" and the dialog is labelled "Booking preview" so the public page does not imply live booking.
- Local storage reads/writes are now guarded, so corrupt or blocked storage no longer blanks the page.

- QA pass on the demo draft: fixed malformed-storage crashes, focus-ring contrast on the timetable, consistent "Proposition Studios artist" wording, time format for owner-added sessions, smaller 600px photo versions via `srcset`, favicon, pinned dependency versions; removed the unconfirmed "boxed professionally" line and an embellishment or two from the story.
- **Before sharing a public link:** hide the booking preview button and owner demo entry points (for example behind `?demo=1`), so real visitors are not invited to type their details into a form that goes nowhere. They are visible now because this is a demo for the owner.

- Second pass: real logo in the header (now a black bar), a hero badge and the footer; logo green (#2fa84f, 6.8:1 on black) used as an accent on dark sections only. Story uses the founder photos (postbox print plus a taped scrapbook) and the `story.pro` chapter; quote block hidden while `story.quote` is null; the magazines close-up photo is no longer used. New "The club" section (group photos plus a muted looping video that loads when scrolled into view, does not autoplay with reduced motion, and has a play/pause button) and a WhatsApp "Join" section; WhatsApp links also in the footer and booking dialog.
- Timetable can now come from a Google Sheet published as CSV (`src/timetable.js`, owner guide `docs/TIMETABLE.md`, `.env.example`). Set `VITE_TIMETABLE_CSV_URL` in the hosting provider to switch it on. If the sheet fails (5s timeout, error or no valid rows), the site falls back to the last good copy cached in that browser, then the built-in two classes. Without the setting, the owner panel's add/remove form is a local preview only. `npm test` runs the parser tests.
- Booking preview: the rate dropdown is replaced by a discount-code field. The owner sets the code in the owner panel (`bgbg-discount-v1`, this browser only). **Demo only**: anyone can read client-side code, so a real code must be checked on the server once online payment exists.

- Owner says consent is given for the class photos and video (record who gave it and when, outside GitHub). Owner chose to make the repository public and use free GitHub Pages for previews (`.github/workflows/pages.yml`, deploys on push to `main`). Cal.com is the chosen booking/timetable system (`docs/CALCOM.md`); the site embeds it when `VITE_CAL_LINK` is set.

- **Classes now come live from Cal.com.** `src/calclasses.js` reads the club's public Cal.com profile (no key needed): each visible event type becomes a class with its title, description, length, price, places and next three dates. The home page shows a short "range of classes" teaser and `#/classes` is a full classes page with descriptions. Owner workflow: add or edit an event type in Cal.com (write a good description, set GBP price, seats, availability) and the website follows. Hidden event types and Cal.com's starter "15/30 min meeting" never show. Titles containing "private", "1-to-1" or "PT" are grouped under Private sessions. The old Google Sheet timetable code and the demo booking dialog are no longer used on the public page.
- Still hard-coded on the home page and needing a human edit if the classes change: the hero line "Tuesday and Thursday nights at 7pm" and the Visit section's "When" row. (Fixed below: the hero now reads live from Cal.com.)

- **Site split into pages (October 2026, owner request).** Hash routes: Home `#/` (hero + classes teaser only, owner asked for two sections at most), `#/classes`, `#/story`, `#/gym` (approach, club photos/video, the space), `#/community` (aims + kit), `#/visit` (find us + WhatsApp). The "Come as you are. Leave a bit stronger." band closes the inner pages.
- **Booking pop-up.** Every yellow Book / Book a class button opens the Cal.com calendar in a pop-up on the site (`src/calembed.js`, Cal.com's official embed script from app.cal.com). If that script can't load, the button opens Cal.com in a new tab. Bookings and payments are handled by Cal.com, not this site.
- Hero "Next up" line now shows the next three class dates from Cal.com, so it changes when the classes change. It shows whatever availability Cal.com has: at the time of writing the "mixed levels" event type still uses Cal.com's default hourly weekday availability and Cal Video as its location, so the owner must set the real class times and the gym as the location in Cal.com.
- Copy changes from the owner: "Come as you are. Leave a bit stronger." follows "You come down, you work, you sweat." in the hero; "donated bags and gloves" became "kit donated by the community"; the "From a grubby basement to a proper gym" section is now "Built by the community. For the community." (owner's choice: the section is not about artists or Proposition Studios). The owner benched an "about four small gyms at Proposition Studios" line as too complicated to explain for now. The chairman's brief and "grubby" wording were removed.

- **Rebalance pass (October 2026, owner request, branch `claude/epic-tesla-55oofm`, not on `main` until the owner approves).** Copy rewritten so the site balances Bernie, a small personal gym, and a good place to learn. Home is now: hero ("Learn to box with Bernie." with a photo (a class group in the ring, until the owner supplies a new one)), "You'll be trained by Bernie" (new `meet` copy), "What to expect" first-class steps (new `firstClass` copy, generic advice only), then the classes. This goes past the earlier "two sections at most" home-page rule on purpose, because the owner said the balance was off; owner to confirm. Story page ends on a fight-bill poster for round two and a "Train with Bernie" button instead of the generic band. Gym page order: the space, the people, how we train. Community page ends with the WhatsApp join block. No hero animation for now: the owner tried a pencil-sketch boxer and an anime impact frame, rejected both, and will supply a hero photo instead. Until then the hero shows the class group photo in the ring, `clubGroup`, at the owner's request (`hero.photo` in `src/content.js`; drop the new photo in `public/photos/`, add it to `photos`, and point `hero.photo` at it). Footer and WhatsApp copy now point to the Cal.com booking calendar.

- Fixed a blank-page crash: the timetable cache read `localStorage` outside its try/catch, so any browser that blocks site storage (some privacy modes, sandboxed previews) showed an empty white page.

## Open questions for the owner (demo draft)

- Who will create the timetable Google Sheet, and which hosting provider will hold `VITE_TIMETABLE_CSV_URL`?
- How studio holders receive the discount code, and how often it changes.
- Permission for the press photos and magazine cover, and consent from identifiable members (a parent's for anyone under 18) in the club photos and video, before launch.

- Official name: "Bethnal Green Boxing Club" (ring canvas, interview) or "Bethnal Green Boxing Gym"?
- How the founder wants to be named and referred to on the site. Copy currently says "our founder" throughout. In the recording he introduces himself as "Mr. Paul", so "he" and a name would read more naturally once he approves.
- Sign-off for the one quote on the site ("It breaks you down to build you up."), taken from the machine transcript.
- Whether the site can say he boxed professionally, and whether the titles can be stated, in what exact words.
- What "Proposition Studios artist" means for the £5 rate and how it is checked.
- Ben Doughty (coach, one-to-one + group classes with Bernie): his Facebook page is login-walled and his YouTube channel (@hardestgame007, "The Hardest Game") showed only its title, so nothing about his background was read. His bio in `coaches` (`src/content.js`) is a placeholder; needs his own text and a real photo (currently `public/photos/ben-placeholder.svg`). Private lesson £40, booked through the Cal.com link (the button opens the main Cal.com page; add a private-lesson event slug to `BookButton` once it exists). Owner said Ben agrees to be named (message was garbled; confirm). Home copy says Bernie takes group classes with Ben; confirm.
- Did 29 November 1995 win the Southern Area title or defend it? Home copy says he "won a Southern Area title fight", based on the photo caption.
- First-class practicalities for "What to expect": class length, arrive early?, are gloves and wraps provided? Full address.

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

1. Done: recordings transcribed and summarised in `docs/INTERVIEW_NOTES.md`. Get founder sign-off on the items marked Check and on the quote.
2. Confirm the gym address, class duration/capacity, cancellation/refund rules, and how Proposition Studios membership eligibility will be checked.
3. Choose and implement a small production stack. Supabase (authentication and database) and Stripe Checkout were discussed as options, not selected or configured. Do not ask the owner to paste credentials into chat or commit them.
4. Protect the owner dashboard with authentication and authorization; store bookings, classes, attendance, and members centrally with backups and privacy-conscious retention.
5. For payments, use hosted checkout and verify payment status server-side with signed webhooks before confirming a place. Handle capacity races, refunds, cancellations, and failed payments.
6. Decide whether the cashbook is sufficient or whether the owner needs accounting software/export. Do not present a manual demo ledger as accounting advice or tax records.
7. Real gym photos are in. Add the provided logo and merchandise artwork once supplied. Merchandise checkout remains a future foundation, not an implemented shop.
8. Before launch, test booking/payment flows, dashboard permissions, accessibility, mobile layout, backups, and recovery.

## Handover between Codex and Claude

Use this GitHub repository as the shared checkpoint. Before changing code, the next assistant should read `CLAUDE.md`, `HANDOFF.md`, and `README.md`, then inspect the current branch and uncommitted changes. Commit completed work with a clear message and push it to GitHub or open a pull request so the other assistant sees the same state. Do not overwrite or discard another assistant's uncommitted changes. Update this handover when decisions change. Keep secrets in the deployment host's secret manager; a shared handover is project context, never a shared password.

Suggested message to Claude after opening the GitHub repository:

> Please continue the Bethnal Green Boxing Gym website from this repository. Read `CLAUDE.md`, `HANDOFF.md`, and `README.md` first. Preserve the confirmed owner decisions and the prototype/live-service boundaries. Tell me what you found and what you plan to change, then work in small reviewable commits. Do not invent founder facts or request/commit secret credentials.

## Club-first rethink (October 2026, owner request)

The site is being refocused on **Bethnal Green Boxing Club as a place to train**, not on Bernie alone. Home, Gym, Community, call-to-action and footer copy are now clearly marked `[Placeholder]` so the owner can see the shape and fill it in. Bernie's confirmed story page is untouched (still at `#/story`, linked from the Coaches page); the previous home/gym/community wording is in git history before this change.

New structure: Classes · Coaches (Bernie + Ben) · White collar · The gym · Community · Visit.

- **White collar page (`#/doctor`)**: placeholder only. No doctor name, credentials or medical claims were supplied. Open questions: doctor's name and agreement to be named; what the doctor actually does; what health forms/checks are needed; whether white collar fights need extra approval or insurance. The site must not claim medical clearance or run fights until confirmed. No health data is collected by the site.
- Community project: copy is a placeholder. Owner to write.


## Club-first launch copy and media — 21 October 2026

The owner's latest instructions supersede the old naming/address/audience questions: call the founder **JB**, explain the historical Bernie Paul name once, current classes are **18+**, group classes **£10**, address **279 Cambridge Heath Road, London, E2 0EL**. Two full interview transcripts and Dr Alix Daniel's proposed biography were supplied. Raw interviews remain private.

See [docs/LAUNCH_REVIEW.md](docs/LAUNCH_REVIEW.md) for source decisions, navigation changes, media selections, unconfirmed practicalities and separate JB/Ben/doctor checklists. This review includes the new doctor introduction and directions-reel link. The existing visual style and legacy routes remain. Cal.com availability is unchanged; editorial copy for the two known events now lives in content.js, so original event descriptions also need updating in Cal.com. Medical arrangements remain described as planned. Owner demo and the existing demo notice are unchanged.

Ben’s coach bio now mentions his boxing podcasts and links to the owner-supplied YouTube channel (`@hardestgame007`), opening in a new tab. No video embed or episode claims were added.
