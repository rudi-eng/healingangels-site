# Healing Angels

A quiet, professional, prayerful community website about how cats (and dogs) heal us — and how we heal them in return. Built for the **Friends of Caycuma** rescue effort in Caycuma.

The site is in **English**.

The site has:

- **`index.html`** — landing page with the daily **Insight of the Day** (a phrase from the book + a short prayer), a preview of the **Therapy Session** gallery, a **Friends of Caycuma** call-to-action, and the latest journal entries.
- **`members.html`** — the **Therapy Session** gallery rendered from the database, plus a public "become a member" form (submissions go to an owner approval queue).
- **`members.json`** is replaced by a real database (Cloudflare D1) — see `docs/DEPLOY.md`.
- **`club.html`** — **Friends of Caycuma**: donate, volunteer, adopt (cats **and** dogs), and list-a-pet for adoption.
- **`blog.html`** + **`blog/post.html`** — the owner's journal.
- **`admin.html`** — owner-only dashboard: write today's insight, post a journal entry, approve member & pet-listing submissions, upload photos to R2.

## Stack

- **Frontend**: static HTML/CSS/JS — served by Cloudflare Pages (auto-deploys from GitHub on every push).
- **API**: a Python Cloudflare Worker (`worker/`) — see `worker/src/main.py`.
- **Database**: Cloudflare **D1** (SQLite).
- **Photos**: Cloudflare **R2** (`healing-photos` bucket).
- **Auth**: hashed password (sha256 + salt) verified in the Worker, signed session cookie (HMAC-SHA256) in HttpOnly + SameSite=Lax + Secure.

All on Cloudflare's **free tier**.

## Quick start (read this first)

1. **Read `docs/DEPLOY.md`** — 15-minute setup on Cloudflare + GitHub.
2. **Read `docs/ADMIN.md`** — how the owner uses the dashboard.
3. **Read `docs/SECURITY.md`** — how the admin login is protected, and what to do if you ever want to rotate the password.

## Daily workflow (for the owner, once deployed)

1. Go to `https://healingangels.site/admin`
2. Sign in with your username & password.
3. Write today's **Insight of the Day** → publish.
4. Optionally: write a blog post, approve members, approve list-a-pet submissions, upload a photo.
5. Nothing else. No code, no commits.

## Repository layout

```
healingangels-site/
├── index.html  club.html  members.html  admin.html  blog.html
├── blog/post.html
├── assets/
│   ├── css/styles.css
│   ├── js/app.js   (shared frontend runtime + API client)
│   └── js/admin.js (owner dashboard runtime)
├── wrangler.toml            Cloudflare Pages (static site)
├── worker/                  Python Cloudflare Worker (the API)
│   ├── wrangler.toml
│   ├── pyproject.toml
│   └── src/main.py
├── schema/schema.sql        D1 table definitions
├── seed/                    example content loaded by scripts/seed.py
├── scripts/
│   ├── seed.py              apply schema + seed data to D1
│   └── hash.py              generate the ADMIN_PASSWORD_HASH secret
└── docs/                    DEPLOY.md, ADMIN.md, SECURITY.md
```

## A note from the owner

> *Cats and dogs do not heal us by doing anything. They heal us by being entirely, unapologetically present. This site is a small thank-you, and a small prayer.*