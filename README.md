# Bethnal Green Boxing Gym

A responsive website prototype for the new community gym, built with React and Vite. The public timetable starts with open-level Tuesday and Thursday sessions at 7pm. Copy welcomes beginners while keeping both sessions open to every level. Prices are £10 public and £5 for Proposition Studios members.

## Run locally

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Open the local Vite address printed in the terminal. Create a production build with `npm run build`.

For the project decisions, known open questions, current limitations, and a handover prompt for another developer or assistant, read [HANDOFF.md](HANDOFF.md). Claude-specific repository guidance is in [CLAUDE.md](CLAUDE.md).

## Prototype boundaries

The owner panel is opened with **Owner demo** in the footer or the round button at the lower right. It can add and remove sessions, record demo bookings and attendance, add members, and keep a simple monthly income and expense list. This data stays in the current browser's local storage. The booking form does not charge a card or hold a real place, and the owner panel does not yet have sign-in or shared storage. Do not enter real customer or financial information.

Connect Supabase authentication and shared database storage, and Stripe Checkout with a verified payment webhook, before using this site for live bookings or records. Class capacity, duration, gym address, and the exact criteria for the Proposition Studios rate still need to be confirmed. Founder-story copy also needs to be checked against the two interview recordings when those files are available.
