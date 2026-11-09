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
npm run db:setup -- .env.production.local
```

Vercel → Project → Settings → Environment Variables: add every key from `.env.production.local` (you can paste the file's contents), then redeploy.

### Local development

```bash
npx wrangler d1 migrations apply icetite --local --config workers/d1-gateway/wrangler.toml
npx wrangler dev --config workers/d1-gateway/wrangler.toml --local --port 8788   # needs workers/d1-gateway/.dev.vars with GATEWAY_SECRET
npm run dev
```
