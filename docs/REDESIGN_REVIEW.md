# Layout redesign — 23 October 2026

Local review only. No deployment, remote push, booking, payment or external account change was made.

## Source review

- Verified `website` origin matches phoenix238/bethnal-green-boxing-gym; working tree was clean before edits.
- Read repository guidance, HANDOFF, README and LAUNCH_REVIEW. Latest conversation supersedes old payment and layout instructions.
- Read all three tabs of the living Google Doc through the connected Drive tool. Only public editorial text was extracted. Private account material was excluded.
- Inspected accessible history from “Boxing Gym Website Plan”, “Review Bethnal Green Boxing Gym” and “Edit Ben's headshot in Darktable”. This is a targeted review, not a claim to have read all ChatGPT history. Older pages remain accessible through pagination but were not exhaustively read.
- Reviewed current desktop/mobile website, current training-loop contact sheets, existing labelled coach promo frame, Ben’s saved-edit export and SSD media arrangement.
- `JB Photos` was not found at the supplied SSD path, including a bounded folder search. Existing historical photos remain in the story. No new archive source was invented.

## Editorial and layout

Home: club name + training film + times/price/walk-in line → Bernie owner/founder → training choices → live calendar → Ben head trainer → first visit/FAQ → gallery → location → secondary white collar, space hire and Instagram links.

Name default: Bernie Paul (JB) once in introductions; Bernie elsewhere. Owner/founder and head trainer roles are explicit. No invented testimonials, class types, hours, accessibility promises or trial deals.

Daughter’s tribute is retained verbatim from its second complete occurrence in tab three, including punctuation. It is explicitly attributed as a daughter’s tribute on the story page. Her separate suggested homepage bio was not copied: it calls Bernie a British champion, a claim disputed by the sources found. Existing story caption “Southern Area title win” also needs owner/source approval before launch.

Career sources: https://boxrec.com/wiki/index.php/Bernard_Paul confirms alias and Commonwealth champion category. https://en.wikipedia.org/wiki/Bernard_Paul_(boxer) supports 35 bouts/21 wins/10 KOs and Southern Area/Commonwealth titles, and describes British title challenge. https://ring-record.com/fighter/bernard-paul conflicts by listing a British reign. Do not use the disputed British-champion claim in public editorial copy. Birth/childhood/family details in the tribute remain family-supplied, not independently verified. Owner should approve the full tribute and press-photo permissions before publishing.

## Media

Ben portrait: local `ben head shot.jpeg` explicitly exported through darktable-cli with `ben head shot.jpeg.xmp`, then web-sized JPEG variants. Original and sidecar unchanged. Dr Alix’s supplied portrait is already present and retained; profile now has a clearer photo/text layout.

Hero film: existing landscape training loop retained without modifying its bytes. A lower-third draft was rendered before the latest instruction arrived; it is excluded from the website and retained only under parent `outputs/unused-draft-*`. Latest user direction explicitly leaves video editing to the user in DaVinci. No further video edit work is planned here. Resolve bridge is stopped; no Resolve timeline was modified.

## Booking without Stripe

Existing Cal.com links and embedded calendar remain. No payment code or card collection added. Visitor copy offers pay at gym and asking by email for private transfer instructions after booking. It never promises an automated payment email or treats a booking as payment.

Official capability research: https://cal.com/features/workflows and https://cal.com/scheduling/frequently-asked-questions document booking-triggered custom emails. https://cal.com/docs/how-to-guides/bookings/how-to-disable-confirmation-email-for-attendees documents default email replacement requirements. Availability/plan and account settings have not been verified. Suggested activation: disable payment requirement on both event types, verify in-person location and weekly availability, configure a booking-triggered email (if account supports it) containing privately supplied payment details; otherwise send manually. Keep reservations and payment reconciliation separate. Test group/private bookings and confirmation emails with owner approval before launch. Do not expose banking details in the repository or frontend environment.

## Activation details still needed

- User to revise the opening film in DaVinci to identify Bernie as Founder.
- Real direct WhatsApp number; `VITE_WHATSAPP_NUMBER` takes international digits. Until set, persistent contact uses confirmed club email. Group invite stays separately labelled.
- Final Cal.com no-Stripe configuration and payment email/manual follow-up choice. No account changes made.
- Entrance/access confirmation, cancellations and remaining trainer/story sign-off.
- Location of new JB archive folder, absent at supplied path during this review.

## SEO limits

Accurate address, email, Instagram and price range in SportsActivityLocation JSON-LD. No invented opening hours or reviews. Static metadata describes Bethnal Green/East London classes. Existing hash routing retained; this does not create separately crawlable server-rendered pages. Consider real URL routes and prerendering as a separate change.

## Completed verification

- Production build and all 18 existing timetable/booking regression checks pass; diff whitespace check passes.
- Browser checked at 1280×720 and 390×844. Home, Classes, Club, Doctor, Story and Visit: no horizontal overflow or broken loaded images. FAQ disclosure opens, phone menu closes after navigation. Portrait cropping reviewed.
- Group Book button opened the actual Cal.com embedded calendar; Tuesday 27 October 18:00 displayed. No visitor data, reservation or payment submitted. Private links retain their private event slug. Live class list loaded after cache fallback.
- Desktop opening and full-home screenshots, phone home and FAQ screenshots are in parent `outputs/redesign-*`. Local preview: http://127.0.0.1:5173/ . Existing hash routes and original video controls/reduced-motion handling retained.


## Browser feedback revision — 23 October 2026

Supersedes earlier unresolved-number/archive/payment/access notes: direct WhatsApp is +44 7958 675825, archive is `jp photos ` on SSD (trailing space), no step-free access, online bookings will be sent payment information and walk-ins ask JB/Ben for details or bring cash. Service policy is confirmed; delivery configuration is not verified or changed.

All 19 archive HEICs inspected via a local contact sheet. IMG_6841 selected for homepage and Bernie coach card; historic solo portrait, Bernie lettering on shorts and archive context support identification. Cropped JPEG copies only, no restoration or source changes. Current portrait remains a to-do.

Hero has group/private booking and first-visit links; homepage Visit reduced to address/map/Visit link. White-collar text stacked with constrained line lengths. Future community/funding aspirations restored explicitly as ambitions. Dedicated Space hire page and navigation; removed embedded full hire from Club. Gallery has contextual Instagram link. Direct WhatsApp in FAQ, persistent dock, Visit, first-class contact, hire and footer. Existing original film and daughter’s tribute unchanged.

Browser verification for feedback revision: checked 1088×710 and 390×844, plus default 1280×720. Phone Home, Club, Doctor, FAQ, Visit, Space hire and Classes have no horizontal overflow or broken loaded images. Phone menu reaches Space hire and closes on navigation. Home/Club each contain one archive portrait and zero full space-hire sections; dedicated hire route contains one. Hero links verified to group `boxingmixedlevels`, private `private-one-on-one` and Visit. Gallery Instagram and every direct WhatsApp URL verified. FAQ payment/access disclosures opened and checked. Build and 18 tests pass; whitespace diff check clean. Screenshots: parent `outputs/review-home-desktop.png`, `review-home-1088.png`, `review-home-mobile.png`, `review-doctor-1088.png`, `review-doctor-mobile.png`, `review-space-hire-mobile.png`. No booking/contact message/payment submitted or external account changed.

## Latest browser polish — 23 October 2026

Green WhatsApp above paper email in the persistent contact stack, both dark-text bordered/shadow buttons with visible focus. Footer clearance increased. Private booking and Visit hero actions use paper fight-poster buttons; group remains yellow.

Owner's corrected location is **down the road from York Hall**. All current public editorial references and LAUNCH_REVIEW corrected. Historical interview summary retained with a correction note; daughter’s tribute unchanged. Root AGENTS and HANDOFF record the latest rule.

Space hire now describes boxing gym hire in Bethnal Green/East London, supported coaching/classes/filming/photography uses, exact address and basement access, with internal links. Browser title/meta/OG descriptions change for the hire route and restore defaults on navigation. This is useful descriptive content, not an indexing guarantee. Google advises against fragments for changing page content: https://developers.google.com/search/blog/2020/05/frequently-asked-questions-about and https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics . A real-URL/prerender migration is outside this change.

Verification for latest polish: 18/18 existing checks pass; final production build passes; diff whitespace check clean. Visual review at 1280×720, 1088×710 and 390×844. Correct group/private/Visit, WhatsApp and email destinations checked. Home mobile timetable/price and video toggle do not overlap the contact stack; footer text/actions have bottom clearance. No horizontal overflow on reviewed Home, Club, Story, FAQ, Visit and Space hire. No public rendered page retains the incorrect location wording; closed FAQ text also corrected in source. Hire title/description verified and home description restores after navigation. Original film and exact daughter’s tribute unchanged. Screenshots in parent outputs: `polish-home-desktop.png`, `polish-home-1088.png`, `polish-home-mobile.png`, `polish-space-hire-1088.png`. No external mutations or deployment.


## Homepage/payment simplification — 23 October 2026

Removed homepage ClassesPreview rendering and its unused main import. Retained the underlying component, full Classes page, shared live data and booking behavior. Hero schedule/£10/group/private links and TrainingOptions remain. No source links target the removed homepage timetable anchor. Removed the requested payment-confirmation sentence from shared policy and Visit copy. Owner-confirmed payment instructions remain; account configuration and internal reconciliation are unchanged. Dedicated room/ring/training-floor/layout photos for prospective hirers are an unchecked future task, not claimed complete by existing training images.

Verification for simplification: production build and 18/18 existing tests pass, diff check clean. Desktop 1280×720 and phone 390×844 Home checked: no extra timetable, no orphan anchors or horizontal overflow; hero group/private links remain correct. Visit/FAQ/Classes inspected including closed FAQ text: removed sentence absent, simple payment policy present. Full Classes page still shows both live event cards. Private hero action opens correct Cal.com embedded event; modal closed without submitting anything. Screenshots: parent `outputs/simplified-home-desktop.png` and `outputs/simplified-home-mobile.png`. No media or account changes, deployment or reservation.
