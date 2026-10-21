# Bethnal Green Boxing Club

A responsive website prototype for the new community boxing club (repository name: bethnal-green-boxing-gym), built with React and Vite. It uses real photos of the gym and a design based on its fight-poster walls. All public copy lives in `src/content.js`. See [the launch review](docs/LAUNCH_REVIEW.md) for the latest owner-confirmed details, media choices and remaining to-dos. The site has separate pages (home, classes, story, the gym, community, visit) using `#/page` links, and Book buttons open the Cal.com booking calendar in a pop-up. The public timetable starts with open-level Tuesday and Thursday sessions at 7pm. Copy welcomes beginners while keeping both sessions open to every level. Prices are £10 public and £5 for Proposition Studios artists (eligibility check still to be agreed).

## Run locally

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Open the local Vite address printed in the terminal. Create a production build with `npm run build`. Run the timetable parser tests with `npm test`.

The timetable can be edited by the owner in a Google Sheet: see [docs/TIMETABLE.md](docs/TIMETABLE.md).

For the project decisions, known open questions, current limitations, and a handover prompt for another developer or assistant, read [HANDOFF.md](HANDOFF.md). Claude-specific repository guidance is in [CLAUDE.md](CLAUDE.md).

## Prototype boundaries

The owner panel is opened with **Owner demo** in the footer or the round button at the lower right. It can add and remove sessions (local preview only, unless a Google Sheet is set up, in which case it links to the sheet), set a demo discount code, record demo bookings and attendance, add members, and keep a simple monthly income and expense list. This data stays in the current browser's local storage. The booking form does not charge a card or hold a real place, and the owner panel does not yet have sign-in or shared storage. Do not enter real customer or financial information.

Connect Supabase authentication and shared database storage, and Stripe Checkout with a verified payment webhook, before using this site for live bookings or records. Class capacity, duration, gym address, and the exact criteria for the Proposition Studios rate still need to be confirmed. The recordings are summarised in `docs/INTERVIEW_NOTES.md`; anything marked "Check" there stays off the site until the founder confirms it.
