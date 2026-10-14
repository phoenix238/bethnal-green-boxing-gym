# Changing the timetable with a Google Sheet

The class timetable on the website can come from a Google Sheet. Once it is set up, the owner changes classes by editing the sheet. No developer is needed and the site does not need rebuilding.

Until the sheet is set up, the site shows the two confirmed classes (Tuesday and Thursday, 7pm). The "Add a session" form in the Owner demo panel only changes what *your own browser* sees. It does not change the real timetable.

## 1. Make the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a blank spreadsheet. Name it something like "BGBC timetable".
2. In row 1, type these headings, one per column. The order does not matter, and capital letters don't matter:

   `day, time, title, level, duration, capacity, price, reduced_price, coach, notes, show`

3. Add one row per weekly class. To start, copy this table and paste it into cell A1 (it pastes as separate columns):

| day | time | title | level | duration | capacity | price | reduced_price | coach | notes | show |
|---|---|---|---|---|---|---|---|---|---|---|
| Tuesday | 7pm | Open level boxing | All levels | | | 10 | 5 | | | yes |
| Thursday | 7pm | Open level boxing | All levels | | | 10 | 5 | | | yes |

What each column means:

- **day** (required): Monday to Sunday. Short forms like "Tue" or "Thurs" work too.
- **time** (required): for example `7pm`, `7:30pm` or `19:30`.
- **title** (required): the class name. Rows missing a day, time or title are skipped.
- **level**: for example "All levels" or "Beginners".
- **duration**: minutes, as a number. Leave blank if not decided.
- **capacity**: number of places. Leave blank and the site says "Places to be confirmed".
- **price**: public price in pounds, for example `10`. Leave blank and the site says "Price to be confirmed".
- **reduced_price**: the studio-holder price, for example `5`. Leave blank if there is no reduced price for that class.
- **coach**: optional name.
- **notes**: optional short line shown under the class, for example "Bring a water bottle".
- **show**: type `no` to hide a class without deleting the row (for example over a holiday). Blank means yes.

The website sorts classes by day of the week, then by time, so the row order in the sheet does not matter.

**Never put personal information in this sheet** (names, phone numbers, emails, medical notes). A published sheet can be read by anyone who has the link.

## 2. Publish the sheet as CSV

1. In the sheet, open **File → Share → Publish to web**.
2. Under "Link", choose the tab that holds the timetable (not "Entire document").
3. Change "Web page" to **Comma-separated values (.csv)**.
4. Click **Publish**, confirm, and copy the link it shows. It looks like `https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv`.

Publishing makes the sheet *readable* by anyone with the link, which is fine for a public timetable. Who can *edit* it is still controlled by the normal **Share** button in Google Sheets. Only share edit access with people you trust to change the timetable.

## 3. Tell the website where the sheet is

The website reads two settings. They are public links, not passwords, so it is fine for them to be visible.

| Setting name | What to paste |
|---|---|
| `VITE_TIMETABLE_CSV_URL` | The CSV link from step 2 (required) |
| `VITE_TIMETABLE_SHEET_EDIT_URL` | The normal link you use to open the sheet (optional; it adds an "Open the timetable sheet" button to the owner panel) |

**On the live site:** in your hosting provider's dashboard (for example Netlify, Vercel or Cloudflare Pages), find the project's **Environment variables** settings, add the two names above with your links, and redeploy once. After that, timetable changes need no redeploy.

**For a local preview on your computer:** copy `.env.example` to a new file called `.env.local` in the project folder, paste the links after the `=` signs, then run `npm run dev`. `.env.local` is ignored by Git, so it is never uploaded to GitHub.

## 4. Day-to-day

- Edit the sheet, wait a few minutes, then refresh the website. Google can take **about 5 minutes** to update a published sheet.
- The Owner demo panel shows where the timetable came from, for example "Timetable source: Google Sheet, updated 18:42".
- If Google can't be reached, or the sheet has no valid rows, the site shows the last good copy it saw in that browser, and otherwise the built-in two classes. The page is never left blank.
- To stop using the sheet, remove `VITE_TIMETABLE_CSV_URL` from the hosting settings and redeploy.

## For developers

The code is in `src/timetable.js` (CSV parser, column mapping, 5-second timeout, cache in `localStorage` under `bgbg-timetable-cache-v1`). Tests: `npm test` runs `scripts/test-timetable.mjs`.
