# ic-ETITE'28 Portal

Accounts, admin CMS, events (BOLT), evaluation, emails, certificates, TechNext stall booking and conference registration — built into the main Next.js site, running entirely on free tiers.

## Architecture

| Piece | Where | Free-tier notes |
| --- | --- | --- |
| Website + portal (Next.js 15) | Vercel | Server actions and API routes do auth, emails and PDFs |
| Database | Cloudflare D1 `icetite` | 5 GB, 5M reads / 100k writes per day |
| D1 gateway | Cloudflare Worker `icetite-d1-gateway` (`workers/d1-gateway`) | 100k requests/day; the site talks to D1 only through it, with a shared secret |
| Email | Gmail SMTP (`ieeeitsvitscore@gmail.com`, same as IEEE ITS) | ~500/day personal Gmail; the queue stops at the daily limit and a daily cron sends the rest |
| Certificates | Generated on demand with pdf-lib | Never stored — rendered when downloaded or attached to an email |

Schema: `db/migrations/0001_init.sql`.

## Editing the website (CMS)

Everything public is editable by admins, without code:

- **Page content** (Admin → *Page content*) — pick a page; every text on it appears as a form field (with colour, size, bold and hide options) and every image with *Replace* / *Restore*. A live preview of the page sits beside the form (desktop / tablet / phone): click any text in the preview to jump to its field. Nothing changes on the website until you click **Publish**; *Discard* drops unsaved edits. Only admins can reach this; the public site has no editing controls.
- **Lists** (Admin → *Lists*) — organizing committee sections and members, functional committees, student committee, international / national advisory boards, technical programme committee, web team and research tracks. Add, remove, duplicate, reorder and edit entries (photos can be uploaded) with the same live preview and Publish / Discard. *Restore* (↺) brings back the original list from the code.
- **Appearance** — Site content → *Appearance*: the ten theme colours (primary, accent, text, backgrounds, borders…), heading and body fonts (9 Google fonts) and overall text size, with a live preview and “Reset to original”.
- **Structured content** — Site content: important dates and countdown, fees and early bird, deadlines, prizes, visibility of BOLT/TechNext, the announcement bar, sponsorship packages, invoice template, payment links; Admin → *Hotels*; events, rounds and certificates in their own sections.

How it works: `scripts/cms-codemod.mjs` wraps page text in `<E>` and swaps `next/image` for `components/cms/EImage`, which read overrides (`texts`, `images` settings). Lists are defined in `lib/collections.ts` and read with `useCollection()` (saved copies in the `collections` setting). The admin preview loads the page in an iframe with `?cms_preview=1`; only when framed by the admin (same origin) does the page report its fields and show unsaved drafts sent by `postMessage`. Run it again after adding new pages or components (`node scripts/cms-codemod.mjs`). Theme colours are CSS variables used through Tailwind `brand-*` classes.

## Roles and URLs

| Who | URL | What |
| --- | --- | --- |
| Everyone | `/login`, `/signup` | One account; email verified with a 6-digit code |
| Participant | `/dashboard` | Conference registration, TechNext booking, events, payments, certificates |
| Participant | `/events/<slug>` | Register, create team (gets a code) / join with code, submit links per round, see published scores, results, certificates |
| Evaluator | `/evaluate` | Score teams per category for each round, mark who qualifies for the next round |
| Admin | `/admin` | Everything below |

**Admin login:** sign in at `/login`. Emails listed in `ADMIN_EMAILS` become admins automatically; the first admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) is created by `npm run db:setup`. Change that password after the first login (Dashboard → Profile). Add more admins or evaluators at `/admin/users`.

## Admin portal

- **Site content (CMS)** — important dates (home, Important Dates, Call for Papers, hero countdown), conference fee table (Registration page + amounts charged), BOLT / TechNext visibility (pages, navbar badges, footer, sitemap), conference & stall registration open/closed, TechNext stall types and prices, payment provider and links.
- **Events & BOLT** — per event: settings (visibility hidden/unlisted/public, open or invite-list registration, solo/team with min–max size, registration window, up to 6 submission link fields, fee per team/member, payment link, number of winners) and tabs for participants & teams (search, payment status, remove), rounds & evaluators (scoring categories, deadlines, open/close submissions), scores & qualification (leaderboard, qualify top N / by minimum score, publish scores to teams), results (auto-rank from final round or manual, announce + email winners), emails, certificates, export & purge.
- **TechNext stalls** — review bookings (approve/reject emails the exhibitor), amount, payment status/reference, per-booking payment link, notes; emails, certificates, export.
- **Conference registrations** — confirm delegates, reconcile payments; emails, certificates, export.
- **Email & SMTP** — SMTP settings (password stored encrypted), test email, send queue (respects the daily limit), retry / cancel.

### Prize pools, deadlines and early-bird pricing
All set from the admin portal — no code changes:

| | Deadlines | Early bird | Prizes |
| --- | --- | --- | --- |
| Conference | CMS → *Conference registration*: opens / closes dates | Early-bird end date + default % · per-tier *Early INR / Early USD* in the fee table | *Best paper awards* (headline + list) on the Registration page |
| TechNext | CMS → *TechNext stalls*: opens / closes dates | Early-bird end date + default % · per-stall *Early ₹* | *TechNext awards* on the TechNext page |
| BOLT / events | Event settings: registration opens / closes | *Early-bird fee* + end date/time | *Prize pool* headline + up to 10 prizes on the event and BOLT pages |

An item's own early price wins; otherwise the default % applies; after the early-bird date the regular price applies. The amount is fixed when someone first registers, so editing a registration later keeps the early-bird price. Registrations outside the open/close window are refused (existing unpaid registrations can still be edited).

### Rounds
Events → *Rounds & evaluators*: set the **number of rounds** (1–10), then for each round set its name, **scoring categories** with max marks, how evaluators' scores combine (average/sum), the submission deadline, and **what teams submit**: the event's default fields, fields for that round only (up to 6, each a link, short text or long text, required or optional), or no submission (e.g. on-site judging). Open/close submissions and publish scores per round. Round 2 onwards is open only to teams qualified in the previous round.

### Scoring with several evaluators
Every evaluator scores independently (they only see their own marks). Per round, choose whether a team's score is the **average** or the **sum** of its evaluators (Rounds & evaluators → *Combine evaluators' scores*); the leaderboard, qualification, team view and `{{score}}` in emails all follow it. Scores & qualification → *Evaluations by evaluator* shows each evaluator's category marks, total and comments per team, and lets an admin remove a single evaluation.

### Certificates from Excel
Admin → *Certificates (Excel)*: create a batch, import an `.xlsx` or `.csv` (header row; name and email columns are detected and can be changed; rows with a missing name or invalid email are skipped and reported). Other columns become `{{placeholders}}` for custom certificate text; columns named team, position/rank/award and institution/college fill those fields automatically. Design the template, then **Release to recipients** — each certificate appears in the dashboard of whoever logs in with that email (including people who sign up later) — and/or **Queue certificate emails** (PDF attached; "only people not emailed yet" avoids duplicates). Bulk PDF/ZIP download works as for events.

### Automatic notices
Sent the moment something happens (Admin → Email & SMTP → *Automatic notices* to edit wording or switch any off): conference registration received, TechNext booking received / approved / not approved, event registration, team created (with the team code), member joined (to the member and the lead), and payment received (with the invoice PDF attached).

### Invoices
When a payment becomes **paid** — an admin marks it paid, or the payment gateway confirms it via `/api/payments/callback` — the portal issues an invoice with a unique sequential number (`PREFIX/2027-28/00001`), confirms conference registrations, and emails the payer the PDF. Set the issuer details, GSTIN/PAN, GST % (amounts are GST-inclusive), prefix, footer and signatory under Site content → *Invoice template* and preview it there. All invoices: Admin → *Invoices* (download, resend). Payers download theirs from the dashboard. PDFs are generated on demand; only the invoice record is stored.

### Hotels, sponsorship packages and the announcement bar
- Admin → *Hotels*: add, edit or remove hotels and publish the directory (until published, the Hotels page shows "will be updated soon").
- Site content → *Sponsorship packages*: tiers, prices, badge, tagline, benefits and card style for the Sponsorship page.
- Site content → *Scrolling announcement bar*: on/off, label, speed, whether visitors can close it, and the items (text, link, "New" tag). It scrolls above the navbar on public pages.

### Emails
Compose in an event / TechNext / conference page, choose an audience (all, no team, payment due, qualified / not qualified in round N, winners, approved exhibitors, confirmed delegates…), use placeholders like `{{name}}`, `{{team}}`, `{{score}}`, `{{rank}}`, `{{portalUrl}}`, optionally attach a certificate, save as a draft, and queue. Then **Email & SMTP → Send queued emails**. Verification codes and password resets go out immediately.

### Certificates
Upload a template image (blank where the name goes), drag the name / team / position / date fields into place, preview, save, then **Release to recipients**. Participants download from their event page or dashboard; admins can download everything as one PDF or as ZIPs of individual PDFs (built in the browser), or email them as attachments. Nothing is stored except the template.

### Payments
Every registration has payment status, amount, reference and payment-link columns. Provider **manual** sends payers to the configured link (with `?ref=<payment id>`) and an admin marks them paid. When VIT shares its payment API, set provider **VIT payment API** in the CMS, add `VIT_PAYMENT_*` env vars, and fill in `createVitCheckout()` / the callback in `lib/payments.ts`.

### After an event
Event → **Export & purge**: download a ZIP of CSVs (participants with contacts, teams and members, submissions, scores, results and qualifiers per round, winners, certificate lists), then delete the participant data (keeps the event archived) or the whole event.

## Setup

```bash
npm install
cp .env.example .env.local        # fill in, see below
```

Cloudflare (already done for production — the database `icetite` exists and the gateway is deployed):

```bash
cd workers/d1-gateway
npx wrangler d1 migrations apply icetite --remote
npx wrangler deploy
npx wrangler secret put GATEWAY_SECRET   # same value as D1_GATEWAY_SECRET
```

Seed the first admin, SMTP settings and the hidden BOLT 3.0 event (safe to re-run):

```bash
npm run db:setup -- .env.vercel.local
```

Vercel → Project → Settings → Environment Variables: add every key from `.env.vercel.local` (you can paste the file's contents), then redeploy.

### Local development

```bash
npx wrangler d1 migrations apply icetite --local --config workers/d1-gateway/wrangler.toml
npx wrangler dev --config workers/d1-gateway/wrangler.toml --local --port 8788   # needs workers/d1-gateway/.dev.vars with GATEWAY_SECRET
npm run dev
```
