# Club-first launch review — 21 October 2026

## Confirmed in this conversation

- Use **JB** publicly. Explain once that he was known as **Bernie Paul** during his boxing career.
- Public copy welcomes beginners, returning amateurs and experienced boxers. The owner removed age-restriction wording on 22 October.
- Group classes cost **£10**. Private sessions are £40 as previously supplied. The owner removed the tenant discount on 22 October.
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
| PTM08449 | Retained asset | Replaced on the homepage to avoid repeating the same image. |
| PTM08472 | Club training section | Close view of focused training and technique. |
| PTM08481 | Gym detail | Boxing boots and the ring canvas; useful detail between wider pictures. |
| Final Exports / 2026-10-20 BGBC Website Loop — 12.5s | Homepage hero and Club session video | Short landscape sequence with varied training, coaching and movement. Web copy is 1280×720 H.264, silent, about 3.3 MB. Existing play/pause and reduced-motion handling retained. |

Additional SSD media now used:

- **PTM08321**: current group picture in the homepage gallery. On 22 October the matching saved Resolve grade was successfully exported and replaced the earlier camera JPEG.
- **Final Exports / Landscape 30s promo, 3s and 6s**: current coaching portraits of Ben and JB, identified by the existing on-video name labels. Cropped frames replace Ben's missing picture and JB's historical coach-card portrait. The historical photo remains on his story page.

The 30-second landscape promo is a good candidate for an optional watch-in-full feature after its captions and audio are reviewed. Keep the vertical promo for social channels; it is not the best fit for a wide site panel. Raw camera files and full video masters are not committed.

Resolve's photo export returned a mixture of successes and failures. Selected images were exported and visually checked; **the complete 33-photo finishing/export process is not finished**. The original grades and source media were not overwritten. A broader contact sheet is saved with the local review deliverables.

## Remaining to-dos

### JB

- [ ] Approve the short biography and revised club story; confirm an exact opening date only if it is to be published.
- [ ] Approve the final group-session description.
- [ ] Supply or approve written entrance instructions, an entrance photo and access details.
- [ ] Confirm arrival time and cancellation policy with Ben. Only gloves are available to borrow; visitors need training clothes and training shoes.
- [ ] Identify which community activities are happening today, if any. Minibus, council work and youth support remain ambitions; the site no longer advertises an age restriction.
- [ ] Approve the selected public photos/video and confirm their existing consent covers these new selections. Record consent privately, outside GitHub.

### Ben

- [ ] Supply a short coaching background and approve the selected current video-frame portrait, or provide a preferred portrait.
- [ ] Approve the group/private descriptions and confirm the £40 private-session price and duration.
- [ ] Confirm what happens in each group session and how optional sparring works, including what beginners should expect.
- [ ] Confirm arrival time and any remaining first-visit practicalities. Only gloves can be borrowed; visitors bring training clothes and training shoes.
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

## Browser feedback pass — 22 October

- Club enquiry email confirmed as **bethnalgreenbc@gmail.com**. First-visit and white collar enquiries now use email; a global email link is in the footer. The separately labelled WhatsApp group remains for people who want to join.
- All tenant discount and age-restriction wording removed from the public website and metadata. Discount controls and reduced-price inputs removed from the hidden local demo too; old browser-stored reduced prices no longer apply.
- First-visit copy: “Wear comfortable training clothes and training shoes. We have gloves you can borrow if you need them.”
- Hero rebalanced around a portrait version of the supplied SSD promo, with a smaller title, direct group/private booking buttons and no York Hall tag. Landscape footage remains on the Club page.
- Group picture now uses the saved Resolve grade, matching the darker photos. The third gallery image is the candid **PTM08631**; the Club introduction uses **PTM08539**. No homepage still is repeated.

## Club page feedback — 22 October

- Homepage promo now shows the confirmed weekly group schedule: Tuesdays 6pm and Thursdays 7pm. Live availability remains in the booking calendar and timetable below.
- Replaced the empty lounge/floor images in the Club collage with SSD training shots **PTM08449** and **PTM08082**. PTM08082 is cropped from the existing Resolve still export to remove its black sidebars; the original grade and source files are unchanged.
- Lifted the displayed brightness of the retained **PTM08472** pad-work shot, with a small contrast reduction to help the boxer on the right read more clearly. No source photograph was overwritten.
- Removed all community goals and the minibus/funding/council plans. The section now describes JB’s motivation and the spirit of training together.
- Medical arrangements now direct visitors to speak to JB or email the club, referring to Dr Alix in that sentence. Her full name remains Dr Alix Daniel in her profile.

## Photo balance and editing collection — 22 October

- Added two men’s training images from the saved Resolve cinematic grade: **PTM08062** in the homepage gallery and **PTM08112** beside the club introduction. The group photograph and candid women’s training image remain in the gallery.
- Preserved the original grade in the supplied editing copies; the website adds a small brightness lift for display. Each new web image has a 600px responsive version and an accurate description.
- Supplied a separate compact editing folder with the 16 unique photos currently displayed across Home, Club, Coaches and JB’s Story: eight cinematic PNG stills, eight largest available website JPGs, and a CSV mapping files back to website paths. The set excludes duplicate thumbnails, unused images, logos, videos and the full RAW shoot. Sources are unchanged.

## Owner exposure corrections and SSD organisation — 22 October

- Exported the saved darktable RAW edits for the eight current training photographs: PTM08062, PTM08082, PTM08112, PTM08321, PTM08449, PTM08472, PTM08481 and PTM08631. Chose the latest edited version per image across the original-shoot and selected-33 film rolls; verified each XMP history end against darktable’s saved database history before export.
- Replaced their website JPEGs and responsive 600px versions. Larger files are capped at 2400px on the longest side, with matching intrinsic image dimensions. Removed the extra CSS brightness/contrast adjustments so the owner’s exported exposures are displayed directly.
- Full-resolution corrected JPEGs and the complete 16-photo website export set are saved on Extreme Pro under `Boxing Gym Edits/Exports/Photos/Exposure Corrected`.
- Camera photos/videos, selected RAWs, cinematic still exports, previews, earlier renders and local collected media now have organised SSD locations. Old paths remain as compatibility links for darktable/Resolve and existing documents. Every cross-volume media copy was verified before its local source was removed.
- Website source code, dependencies and the build’s small working media copies remain local pending explicit approval to move the entire website working folder; automatic approval review rejected moving code/dependencies under the media-only authorisation.
