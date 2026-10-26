# Layout, calls to action and on-page SEO audit — 26 October 2026

## Outcome and scope

Local review of all ten public routes, preserving the club's poster-style design. Changes are in the local preview, not deployed. This is an on-site layout/content/technical review, not a search-ranking or backlink audit. No Search Console, traffic or keyword-volume data was available; no ranking, difficulty or Core Web Vitals score is claimed.

The strongest material is the real coaching experience, original imagery and practical local details. The largest remaining search issue is hash routing. The most useful immediate layout fixes were clearer booking choices, removing duplicate sections and giving visitors direct access to either coach's full biography.

## Supplied copy boundary

- Ben's biography is now in `src/ben-biography.js`, using the exact words supplied in chat. Original spelling, punctuation and numerals are retained, including “manger/ trainer”. Browser whitespace collapses repeated spaces normally. Email-signature/attachment markers are not biography content.
- Bernie's homepage introduction and “Bernie Paul – Founder & Head Coach” are the owner's latest exact text, stored in `content.meet`. This supersedes the earlier short editorial introduction.
- Bernie's complete supplied story remains in `src/tribute.js`. The only change from the saved text is the full stop in “THE STORY OF A CHAMPION.” from the latest paste. All 29 text blocks remain present and in order.
- Added training information and booking links sit outside the supplied biographies. The older interview-based story and archive remain accessible at `#/story`.
- The owner's latest exact homepage copy includes “British and Commonwealth” champion wording. It is retained at the owner's explicit request; this is supplied copy, not a new independent verification of the title history. Earlier source discrepancies are recorded in REDESIGN_REVIEW.md.

## Page-by-page decisions

| Page | Finding | Implemented adjustment / role |
| --- | --- | --- |
| Home | Coaches already introduced twice; a third coaches promo repeated the journey. | Kept each coach's introduction and full-profile link; removed the final repeated coaches promo. Supplied Bernie introduction retained verbatim. Space hire stays as a separate secondary use. |
| Classes | Routines were buried in a long payment block; repeated event descriptions and generic titles slowed booking. | Tuesday/Thursday routines now sit together with immediate group/private price-labelled buttons. Duplicate known-event descriptions removed from booking cards. Payment information has its own lower block. Ben profile, FAQ and directions links remain. |
| Meet the coaches | Entire editorial story, scrapbook and tribute came before Ben, putting him roughly 5,700px down the desktop page. | Direct profile jump links; complete supplied Bernie story and Ben biography; separate training CTAs; archival material remains on the story page. Direct profile URLs survive reload and move focus correctly. |
| The club | Static session film/photo section repeated the surrounding photography and live Instagram gallery. | Retained space introduction/photos, training approach, Instagram gallery, community text and a closing classes CTA; removed redundant Club film/photo section from this route. Source component/media preserved. |
| Space hire | Closing class-booking banner distracted from hire enquiries; “Photography” broke awkwardly in a four-column card. | Removed class banner; two-column use cards on larger screens; email/WhatsApp hire enquiries remain the main actions. |
| FAQ | Helpful answers lacked a direct route back to choosing a class. | Added Find a class alongside Plan your visit. Questions remain expandable. |
| Visit | Directions were below all seven information cards; additional contact section repeated the same action. | Map/WhatsApp actions moved near the heading; retained full practical details and directions video; removed duplicate Join section. |
| Bernie story / Ben profile | Older links may still be in use. | Both routes retained; Ben's dedicated profile uses the same verbatim source; archive story and full tribute retained. |
| Community | Supporting page rather than primary navigation. | Existing copy retained, including clear distinction between present activity and future aspirations. |

Navigation remains Classes → Meet the coaches → The club → Space hire → FAQ → Visit. White collar/wellbeing stays hidden; its source is preserved for later restoration.

## Responsive and accessibility review

- Browser DOM checks on ten routes at 320, 390, 768 and 1280px: 40 combinations, no horizontal page overflow, one main H1 per page, no duplicate IDs, no missing image `alt` attributes and no unnamed links by the checked criteria.
- Visual screenshots reviewed for Home, coaches, Classes, Club, Space hire, Visit and FAQ at representative desktop/mobile/tablet sizes. This is not a claim that every scroll position/device has been exhaustively assessed.
- Mobile/tablet contact stack now opens from one compact Contact button, reducing obstruction of booking actions. Expanded links retain green WhatsApp above email. Escape closes and returns focus; clicking outside or navigating closes it. Desktop stack remains visible. A floating control can still overlap content at some scroll positions; it is intentionally much smaller below 960px.
- Instagram reel opened in the native dialog with readyState 4, playing and no media error; close worked.
- Mobile navigation opens/closes and Escape returns focus. FAQ disclosures operate. Profile jump links target the correct section below the sticky header, including on page reload.
- All configured local photographs and generated responsive variants exist. No broken loaded images were reported in the initial 390px DOM pass. Lazy images were not all forced to load in that pass.
- Map, email, WhatsApp and internal profile destinations inspected. A group-booking button opened the correct Cal.com calendar without creating a booking.

## SEO changes and remaining work

| Check | Status | Detail |
| --- | --- | --- |
| Unique page titles/descriptions | Improved | All ten routes have relevant metadata; home static HTML includes local boxing copy. Hash routing still limits independent discovery. |
| Natural local/service wording | Improved | Classes and coaches introductory labels name Bethnal Green. Existing address, East London, pricing, class details and hire uses support search intent without inserting keywords into the supplied biographies. |
| Structure/internal links | Improved | One H1 per view, descriptive profile links, clear training vs hire journeys. Important actions use actual links and booking fallback URLs. |
| Business structured data | Present | SportsActivityLocation with club name, address, email, Instagram and price range; confirmed public telephone added. No opening hours, review ratings or unconfirmed facts invented. |
| Real page URLs | High-priority follow-up | `#/classes` etc change content using fragments. Google advises using real URLs/History API instead. Settle host/domain, add server/static route support, preserve old links, then generate per-page HTML/metadata. |
| Canonicals and sitemap | Follow-up | Final domain is not established in this local task. Add self-consistent canonical URLs, sitemap and robots configuration with the real-route migration; do not put hash routes in a sitemap. |
| Social share image | Follow-up | No explicit `og:image` yet. Use an approved club photo/logo with an absolute final-domain URL once hosting is settled. Client-only metadata changes alone do not ensure social crawlers see each route. |
| Search Console/local presence | Not checked | Verify the final property and Google Business Profile details with owner access; no indexing/ranking claims made. |
| Performance | Partial | Production assets approximately 100KB gzipped JS and 11KB CSS. Homepage films are substantially larger; test real mobile loading after hosting is settled. No measured field CWV or Lighthouse score claimed. Old untracked media files remain local and must not be swept into a release. |
| Booking service copy | Follow-up | Actual Cal.com popup still contains older typo-heavy Tuesday/Thursday wording (“thrusday”, “showdow baoxing”) rather than the polished website descriptions. Align event descriptions separately in Cal.com. No account settings or bookings changed. |

## Search intent map

Suggested targets below reflect the actual offer; no volume or ranking data is implied.

| Existing page | Relevant searches / visitor questions | Intent |
| --- | --- | --- |
| Home / Classes | boxing classes Bethnal Green; boxing gym East London; beginner boxing Bethnal Green | Local training |
| Classes | group boxing classes East London; Tuesday boxing classes; Thursday boxing classes | Timetable/booking |
| Ben / coaches | one-to-one boxing Bethnal Green; private boxing coaching East London; Ben Doughty boxing trainer | Coach research/booking |
| Bernie / coaches | Bernie Paul Punching Postman; Bethnal Green Boxing Club coaches | People/history |
| Space hire | boxing gym hire London; boxing gym filming location; boxing gym photography hire | Hire enquiry |
| FAQ / Visit | what to bring to a boxing class; can I borrow boxing gloves; Bethnal Green Boxing Club directions | First-visit practicalities |

Existing pages already cover these needs. Do not add repetitive location pages, invented testimonials or padded biographies to target more phrases.

## Validation and delivery

18/18 timetable/booking checks and 12/12 video-behaviour checks pass. Production build and whitespace checks pass. Rendered Ben biography, all Bernie story blocks and the homepage introduction compared exactly with their source arrays. The homepage music fade and prior navigation restructure remain in the local changes.

Evidence: parent `outputs/site-audit-2026-10-26` contains responsive-checks.json, rendered-copy.json and representative screenshots. Local source/archive copies are preserved. No deployment, email, Drive upload or external account mutation was performed.

Official guidance used: [Google URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
