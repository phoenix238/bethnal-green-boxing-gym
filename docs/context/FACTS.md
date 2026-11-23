# Things that cost a day to learn

Written by hand, unlike MAP.md. Each entry says how it was established, so it
can be re-checked cheaply rather than re-discovered expensively.

If you are an agent: read this before the docs of whatever framework this is,
and before reading `node_modules`. If an entry turns out to be wrong, fix it in
the same change.

## Deployment

**The published website builds from main. Use a separate branch and server for club records.**

How this is known: HANDOFF.md, October Cloudflare and GitHub Pages deployment notes (2026-11-23).

## Portal integration

**The 23 November checkout at 9d99c14 lacks the Mac project’s AGENTS.md, club-preview directory and Starling reader. Integrate against the original files when supplied.**

How this is known: Launch brief and git log --all for the three paths (2026-11-23).

## Portal rehearsal

**On staging, Starling imports and email delivery use fictional fixtures. Provider credentials and genuine member records need club authorisation. The shared register uses D1.**

How this is known: portal/README.md and private staging rehearsal on 23 November 2026 (2026-11-23).
