# Healing Angels

A quiet, professional, prayerful community website about how cats (and dogs) heal us — and how we heal them in return. Built for the **Friends of Caycuma** rescue effort in Caycuma.

**English only.** Beautiful on the outside, simple underneath: plain HTML, CSS, JS, and JSON. No database. No worker.

## How it works

| Piece | What it is |
|--------|------------|
| Public pages | Static HTML + public JSON (no emails/phones) |
| Auto-save | Signups and owner edits save automatically in the browser |
| Secret vault | Email & phone stored privately — never on public pages or desk tables |
| Owner desk | `admin.html` — **password locked** (default `1234Laleh`) |

**Email and phone** are required on signup forms. They are **secret**: not on the website, not in the owner tables. Only a signed-in owner can download them via **Backup**.

## Pages

- **`index.html`** — Insight of the Day, therapy preview, Caycuma call-to-action, journal preview  
- **`members.html`** — therapy stories + join form (email + phone required)  
- **`club.html`** — donate, volunteer, adopt, list a pet  
- **`blog.html`** / **`blog/post.html`** — journal  
- **`admin.html`** — owner desk (no password; export JSON when done)

## Everyday workflow

1. Open `admin.html` → unlock with password (`1234Laleh` until you change it).
2. Write today’s insight, a blog post, approve members — **saves automatically**.
3. Change your password under **Password**.
4. Optional: **Backup** for a private offline copy (includes secret contacts).
5. **Lock desk** when done.

## Local preview

```
python -m http.server 8000
```

Open <http://localhost:8000>. (JSON needs a tiny local server — opening `index.html` as a file often blocks fetch.)

## Deploy (Cloudflare Pages)

1. Push this repo to GitHub (`rudi-eng/healingangels-site`).
2. Cloudflare Pages → Connect to Git → this repo.
3. Framework: **None** · Build command: empty · Output directory: `/`
4. Deploy. Done.

Optional: custom domain `healingangels.site`.

## Repository layout

```
healingangels-site/
├── index.html  members.html  club.html  blog.html  admin.html
├── blog/post.html
├── data/                 ← all content lives here
│   ├── insight.json
│   ├── members.json      ← includes private email & phone
│   ├── blog.json
│   └── listings.json     ← includes private email & phone
├── assets/css/styles.css
├── assets/js/app.js      ← loads JSON + forms
├── assets/js/admin.js    ← owner desk
├── wrangler.toml         ← Pages project name only
└── docs/
```

## A note from the owner

> *Cats and dogs do not heal us by doing anything. They heal us by being entirely, unapologetically present. This site is a small thank-you, and a small prayer.*
