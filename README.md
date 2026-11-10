# ic-ETITE'28 — Website & Portal

Website and participant/admin portal for **ic-ETITE'28**, the Third International Conference on Emerging Trends in Information Technology and Engineering, VIT Vellore (10–11 February 2028).

Live: https://ic-etite28.vercel.app

It contains the public conference website plus a portal with accounts, an admin CMS, the **BOLT** hackathon (and any other event), evaluation, emails, certificates, invoices, **TechNext** stall booking and conference registration. Everything runs on free tiers.

## Features

**Public website**: home, call for papers, research tracks, important dates, registration and fees, keynote speakers, committees, advisory board, sponsorship, venue, hotels, visa, contact, previous editions, BOLT and TechNext pages. It includes SEO metadata, a sitemap and robots.txt.

**Accounts**
- Sign up with email verification (6-digit code), log in, forgot / reset password.
- Profile page.
- Roles: participant, evaluator, admin.
- Rate limits (`lib/auth/rateLimit.ts`):

  | What | Limit |
  | --- | --- |
  | Failed logins per email | 8 per 15 min |
  | Failed logins per network | 40 per 15 min |
  | Password-reset emails per address | 3 per hour |
  | Password-reset requests per network | 15 per hour |
  | Signups per network | 30 per hour |
  | Verification-code resends | 5 per hour, and 1 per minute |
  | Wrong verification codes | 6 per 15 min, then the code is cancelled |

  Network limits are generous because many students share one campus IP.

**Admin CMS** (`/admin`). Admins can change all of these without touching code:
- **Page content**: every text and image on every page as a form field, with a live preview (desktop / tablet / phone). Texts can be re-coloured, resized, bolded or hidden. Nothing changes until you click Publish.
- **Lists**: committees, advisory boards, team and research tracks. Add, remove, reorder and edit entries, with a live preview.
- **Site content**:
  - important dates and countdown
  - fees and early-bird pricing
  - deadlines and prize pools
  - BOLT / TechNext visibility
  - scrolling announcement bar
  - sponsorship packages
  - invoice template
  - payment links / VIT payment API
- **Appearance**: theme colours, fonts and text size.
- **Hotels**: add and edit the hotels shown on the site.

**Events (BOLT hackathon and others)**
- Registration: hidden / unlisted / public; open or invite-list only; solo or team with team codes (team names must be unique); early-bird fees and prize pools.
- Rounds:
  - the admin sets how many rounds there are
  - each round has its own submission links, scoring categories and deadline
- Scoring: multiple evaluators score each team. Averaged scores, top-N or minimum-score qualification to the next round, and scores can be published to teams.
- Results and winners, with emails drafted by the admin.
- Certificates:
  - template designer, PDFs made on demand
  - email or download
  - generate from an Excel sheet, matched to each person's login email
- Export everything as a ZIP of CSVs, then delete the participant data.

**TechNext** expo stall booking: admin approval, stall types and prices, early bird, payments.

**Conference registration**: registration tiers, early bird, delegate confirmation and payment reconciliation.

**Invoices**: generated automatically when a payment succeeds, each with a unique number. The admin sets the template.

**Email**
- Gmail / Google Workspace SMTP with a send queue that respects the daily sending limit.
- Automatic notices with editable templates.
- A **separate SMTP account for verification codes and password-reset links** (see below).

## Tech stack

| Piece | Where | Notes |
| --- | --- | --- |
| Website + portal | Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript, hosted on Vercel | Server actions + API routes |
| Database | Cloudflare D1 `icetite` | Schema in `db/migrations/` |
| D1 gateway | Cloudflare Worker (`workers/d1-gateway`) | The site reaches D1 only through it, using a shared secret |
| Email | Gmail / Google Workspace SMTP via nodemailer | Queue in `email_outbox`; daily Vercel cron sends what is left |
| PDFs | pdf-lib | Certificates and invoices are made when needed, never stored |

## Email accounts and limits

Admin → **Email & SMTP** has two SMTP accounts:

- **Main SMTP**: notices, bulk emails, certificates and invoices.
- **OTP & password-reset SMTP**: only verification codes and password-reset links.
  - Any field left empty uses the main account's value, so at first both use the same login and password.
  - Fill in another account later to give codes their own daily limit.
  - Codes and links that cannot be sent within 30 minutes are dropped instead of arriving after they have expired. The user can simply request a new one.

Each SMTP login has its own 24-hour quota, set as the "daily sending limit":

| Account type | Google's limit |
| --- | --- |
| Personal Gmail | about 500/day |
| Google Workspace (e.g. @vit.ac.in) | 2,000/day |

Set the daily sending limit a little below Google's figure. Bulk emails over the limit wait in the queue and go out the next day.

## Project layout

```
app/                 pages, portal (dashboard, events, evaluate, admin), API routes, server actions
components/          site sections, portal UI, components/cms (CMS text/image/list rendering), components/admin
lib/                 db client, auth, settings, pricing, payments, invoices, notifications, email, certificates, collections
data/                default content (committees, advisory board, team, tracks)
db/migrations/       D1 schema (apply in order)
workers/d1-gateway/  Cloudflare Worker that exposes D1 to the site
scripts/             db setup / seed, CMS codemod
```

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
```

Environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site |
| `D1_GATEWAY_URL`, `D1_GATEWAY_SECRET` | D1 gateway Worker URL and its shared secret |
| `SESSION_SECRET` | 32+ random characters; also encrypts SMTP passwords stored in D1 |
| `ADMIN_EMAILS` | Comma-separated emails that become admins |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin, created by `npm run db:setup` |
| `CRON_SECRET` | Protects `/api/cron/email` |
| `SMTP_*`, `SMTP_OTP_*` (optional) | Override the SMTP settings saved in the admin |

Never commit `.env.local`, `.env.vercel.local` or `workers/d1-gateway/.dev.vars`. They are git-ignored.

### Database and gateway (Cloudflare)

```bash
cd workers/d1-gateway
npx wrangler d1 migrations apply icetite --remote
npx wrangler deploy
npx wrangler secret put GATEWAY_SECRET   # same value as D1_GATEWAY_SECRET
```

Create the first admin and the default settings (safe to run again):

```bash
npm run db:setup -- .env.local
```

### Local development

```bash
npx wrangler d1 migrations apply icetite --local --config workers/d1-gateway/wrangler.toml
npx wrangler dev --config workers/d1-gateway/wrangler.toml --local --port 8788
npm run dev
```

Set `D1_GATEWAY_URL=http://127.0.0.1:8788` in `.env.local`. Without SMTP configured, emails are printed to the server console in development.

### Deploying

Push to the GitHub repository connected to Vercel. Add every environment variable in Vercel → Project → Settings → Environment Variables. Apply new files in `db/migrations/` to the remote database **before** deploying code that uses them.

## More documentation

[`PORTAL.md`](PORTAL.md) is the admin guide. It covers roles and URLs, every admin section, pricing rules, rounds, scoring, certificates, invoices, payments and the after-event export.
