# Private class rehearsal

This Worker serves the member phone, shared tablet at `/kiosk`, and Coach desk at `/#signin`. Use fictional records. The staging waiver and the seeded £5 referral reward are rehearsal fixtures. The existing public site builds separately.

## Run the checks

Use Node 24 and run `npm ci`, `npm test` and `npm run build` from this folder. For the three-device browser rehearsal, install Python Playwright and Chromium, then run `python3 test/browser.py`. Set `CHROMIUM_PATH` if Chromium is installed elsewhere. The test exercises the built Worker with separate browser contexts, test identities, and one SQLite database. The local preview command `npm run dev` serves synthetic identities and records on loopback. Its test sign-in routes are excluded from the deployed Worker.

## JB’s rehearsal

Open the private Site using an invited account. Choose **Sign in**, then **Load rehearsal class** if the register is empty. The fixture creates AM42 and JL18 and a class starting five minutes after loading. On later days add a class under **Class times and register**. See [the class-night guide](CLASS-NIGHT.md).

The owner email is configured server-side in `ADMIN_EMAIL`. An optional `JB_EMAIL` grants the same desk access to the invited JB identity. Ben and the shared tablet use separate signed-in identities with one-hour role invitations. For a no-phone member, issue a member invitation and hand it to the member after checking their identity. These invitations assign app roles after the visitor has access to the private Site. Open the staff desk only on the staff device.

The Worker trusts identity headers supplied by Sites dispatch. Run it behind that boundary. The registered kiosk role only receives check-in status. The wall QR points to the private rehearsal. Print a permanent live QR after confirming the club-owned portal address.

## Storage, bank and mail

D1 binding `DB` stores immutable events in `portal_events`. A compare-and-append check commits each command, its referral changes and its outbox records together. Member and staff views derive from the same rows. Confirmations keep one key per transaction and reminders one per member and class. Cash and attendance corrections retain the original entries in the register history.

The bank and delivery controls are simulators. A statement entry uses the original transaction ID so a later import cannot duplicate it. A rehearsal bank failure holds reminders. The Worker’s scheduled handler refreshes, assesses eligible classes from thirty minutes after the end and drains its rehearsal outbox. The protected `POST /ops/class-night` endpoint runs the same cycle. The rehearsal is available on demand. Unattended live operation requires a scheduler and the verified owner-run bank and mail integrations.

To promote this to real use, integrate the original Starling reader, verify the raw reference, amount, transaction ID and available payer name on a club-authorised test transfer, and connect a mail provider with an idempotency lookup for ambiguous delivery retries. Confirm the actual waiver, referral rules, guardian process and access policy with JB. Replace the rehearsal-specific sign-up wording and check the original member screens against the local preview.

## Backup and rollback

The automated restore test takes a consistent SQLite snapshot and reopens a separate database. It checks integrity and compares the restored staff projection. For hosted records, export an authenticated, access-controlled snapshot and hold it in the club’s restricted backup location. Rehearse recovery into a separate database before using real records. Rebuild the previous Worker revision against a restored copy and compare member balances, visit counts and delivery keys. Keep sending disabled during recovery.

For a code rollback, use the preceding private Site version against the same append-only schema. If writes or the schema have changed incompatibly, pause access, take a current snapshot, and roll forward or restore to a separate database for review. Keep the newer register for reconciliation before reopening. A restore can replay previously sent email jobs, so reconcile delivery IDs against the provider’s history first.

Use **Download private backup** on the desk to take a consistent register export. Run `node restore.mjs BACKUP.json NEW.sqlite` to validate its checksum and restore into a new file. Store the export in restricted storage. The checksum detects damage, and access control protects the file.
