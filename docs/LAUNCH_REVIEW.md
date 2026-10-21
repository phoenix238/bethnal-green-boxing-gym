# Club-first launch review — 21 October 2026

## Confirmed in this conversation

- Use **JB** publicly. Explain once that he was known as **Bernie Paul** during his boxing career.
- The club welcomes **adults aged 18 and over** for now, including beginners, returning amateurs and experienced boxers.
- Group classes cost **£10**. The existing £5 Proposition Studios tenant rate and £40 private sessions remain as previously supplied; confirm these before launch.
- Address: **279 Cambridge Heath Road, London, E2 0EL**. Basement of the Proposition Studios building, opposite York Hall.
- Keep the established fight-poster visual style. Focus the writing on the club and ways to train.

## Structure implemented

Main navigation: Classes & coaching / The club / White collar & wellbeing / Visit, plus Book a class.

Home: club introduction and actual SSD training loop → group/private choice → current SSD photo gallery → live timetable → short club introduction → first-visit steps and WhatsApp action → booking link.

The club combines the space, coaches, training approach, session media and community ambitions. The old Coaches and Community routes remain available for existing links. JB's longer story remains linked from his coach card. The unused kit teaser is removed from the public page.

## Sources and editorial decisions

- Owner supplied two interview transcripts on 21 October. Only a factual summary is used; the raw transcripts stay private because they contain other people's personal stories.
- Club origin: unused basement, donated equipment, and a ring arranged with help from JB's former promoter. No promoter name, exact founding year, contested title details, knockout timings or private anecdotes are added.
- Dr Alix Daniel supplied a proposed bio via the owner. The edited version retains her qualifications, interests, English/French consultations and practice address. Her practice website also identifies her at 10 Harley Street: https://dralixdanielprivategp.com/ . Qualifications are based on her supplied biography, not independently credential-verified.
- White collar content now explains the format first, provides an interest enquiry to JB/Ben, then introduces Dr Alix as the associated medical advisor. Medical appointments have their own practice contact route. The prescribing-policy paragraph is omitted from the club introduction; it is better addressed by her practice. No medical appointment form or health-data collection is added.
- Owner supplied the coaches' directions reel: https://www.facebook.com/reel/1158733356862918 . Facebook did not load for inspection; the Visit page links to it without invented written entrance instructions or an automatic Facebook embed.
- Known Cal.com session slugs have edited site titles/descriptions to remove typos. Their dates, duration, capacity and price metadata still come from Cal.com. Unknown future session types use their own Cal.com descriptions. Update the original descriptions in Cal.com too so the booking destination matches.

- Owner confirmed Ben makes boxing podcasts and supplied his YouTube channel: https://www.youtube.com/@hardestgame007 . Ben’s coach card now links to it in a new tab, using the clean URL without tracking parameters. The same clickable podcast link is also in the footer of every page. No unverified episode details or career claims were added.

## Media selection

Reviewed the 33-photo source contact sheet, available Resolve grade exports and the existing website-loop storyboard. Website images preserve the saved **top 33 / Boxing Gym Grade** treatment. No new colour treatment was applied; only black export bars were removed and web sizes made.

| Source | Use | Reason |
| --- | --- | --- |
| PTM08037 | Homepage photo gallery | Coaching in progress with other people in the room; makes training the subject. |
| PTM08449 | Homepage club introduction | Clear partner pad work and the gym's poster wall. |
| PTM08472 | Club training section | Close view of focused training and technique. |
| PTM08481 | Gym detail | Boxing boots and the ring canvas; useful detail between wider pictures. |
| Final Exports / 2026-10-20 BGBC Website Loop — 12.5s | Homepage hero and Club session video | Short landscape sequence with varied training, coaching and movement. Web copy is 1280×720 H.264, silent, about 3.3 MB. Existing play/pause and reduced-motion handling retained. |

Additional SSD media now used:

- **PTM08321.JPG**: current group picture in the homepage gallery, web-sized from the camera JPEG. The separate Resolve photo export was unavailable for this frame; no new colour grade is claimed.
- **Final Exports / Landscape 30s promo, 3s and 6s**: current coaching portraits of Ben and JB, identified by the existing on-video name labels. Cropped frames replace Ben's missing picture and JB's historical coach-card portrait. The historical photo remains on his story page.

The 30-second landscape promo is a good candidate for an optional watch-in-full feature after its captions and audio are reviewed. Keep the vertical promo for social channels; it is not the best fit for a wide site panel. Raw camera files and full video masters are not committed.

Resolve's photo export returned a mixture of successes and failures. Selected images were exported and visually checked; **the complete 33-photo finishing/export process is not finished**. The original grades and source media were not overwritten. A broader contact sheet is saved with the local review deliverables.

## Remaining to-dos

### JB

- [ ] Approve the short biography and revised club story; confirm an exact opening date only if it is to be published.
- [ ] Confirm the £5 tenant eligibility/code arrangement and final group-session description.
- [ ] Supply or approve written entrance instructions, an entrance photo and access details.
- [ ] Confirm equipment provision, arrival time and cancellation policy with Ben.
- [ ] Identify which community activities are happening today, if any. Minibus, council work and youth support remain ambitions; current classes are 18+.
- [ ] Approve the selected public photos/video and confirm their existing consent covers these new selections. Record consent privately, outside GitHub.

### Ben

- [ ] Supply a short coaching background and approve the selected current video-frame portrait, or provide a preferred portrait.
- [ ] Approve the group/private descriptions and confirm the £40 private-session price and duration.
- [ ] Confirm what happens in each group session and how optional sparring works, including what beginners should expect.
- [ ] Confirm gloves/wraps, arrival time and first-visit practicalities.
- [ ] Correct the original Cal.com event titles/descriptions, verify availability, location and cancellation terms. Site editorial copy does not update Cal.com itself.

### Dr Alix Daniel

- [ ] Approve the edited biography and the description of the club role.
- [ ] Confirm which services happen at the gym and which are arranged through the practice. Do not imply blood tests/scans are physically performed in the gym unless confirmed.
- [ ] Confirm visit dates, examination appointments, fees, contact route and event-attendance arrangements.
- [ ] Supply a portrait if desired. No substitute silhouette is shown.

### Website owner before merging for launch

- [ ] Finish the items above that affect visitor expectations.
- [ ] Check one group and one private booking through Cal.com, including the payment configuration. No reservation or payment was submitted during this work.
- [ ] Owner-demo controls are now hidden on public pages and available only with `?demo=1`. This is a local demo, not authenticated administration. The footer states that bookings are handled by Cal.com. No payment configuration was verified or changed.
- [ ] Review original press-photo permissions if keeping the historical story scrapbook.

## Verification

- Production build passes.
- Existing tests plus booking-fallback and cache/date regression checks: 18/18 pass.
- Browser checks: Home, Classes, Club, Doctor and Visit render; live Cal.com dates load; group/private links target their respective event slugs. Selected 1280×720 video loads and plays muted with a working pause control. Phone home/Visit pages at 390px have no horizontal overflow; menu opens and closes after navigation. No broken loaded images or duplicate IDs were found on the checked class page.
- Independent reviewer checked source and the final desktop/390px phone preview. Review findings led to homepage media, a clear enquiry-first white collar page, hidden public demo controls, a reliable booking link while the embed loads, a 24-hour cache limit with a saved-data notice, and removal of past dates. A PR workflow now runs the tests and production build.

This branch does not deploy to GitHub Pages until merged into main. It does not change payments, Cal.com configuration or owner-dashboard storage.
