# Claude project guide

Start with `README.md` and `HANDOFF.md` before editing. Treat this repository as the shared source of truth for the Bethnal Green community boxing gym website. Keep changes in this GitHub repository so the owner can return to Codex or Claude without losing decisions.

The owner is new to development. Prefer clear, affordable, maintainable steps and explain how to preview changes in plain language. Do not ask for information that is already recorded here. If a real-world decision is missing, use a clearly labelled placeholder and record the open question in `HANDOFF.md`.

Do not invent founder history, quotes, gym address, class capacity, or business details. The founder interview recordings were not available in the working environment; the supplied background in `HANDOFF.md` is the only source currently available. Do not put credentials, passwords, API keys, or personal customer/payment information in GitHub. Declare secret names and destinations in deployment configuration and have the owner enter values through the provider's secret settings.

The current application is a front-end prototype. Its booking and owner dashboard data are local to one browser. It has no live payment processing, authentication, shared database, or production accounting. Never describe these features as production-ready. Before enabling them, design and verify a secure backend, payment webhook, authorization, privacy and data-retention approach, and failure handling.

Before handing work back, run `npm run build`, update `README.md` or `HANDOFF.md` when behavior or decisions change, and report exactly what is and is not live. Prefer small commits and pull requests when a shared remote workflow is available.
