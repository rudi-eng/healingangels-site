# Healing Angels

A quiet, professional, prayerful community website about how cats (and dogs) heal us — and how we heal them in return. Built for the **Friends of Caycuma** rescue effort in Caycuma.

**English only.** Beautiful on the outside, simple underneath: plain HTML, CSS, JS, and a few JSON files. No database. No worker. No login wall.

## How it works

| Piece | What it is |
|--------|------------|
| Public pages | Static HTML that load `data/*.json` |
| Content | `data/insight.json`, `members.json`, `blog.json`, `listings.json` |
| Signups | Forms save into this browser; owner exports JSON to put back in `data/` |
| Owner desk | `admin.html` — write insight & blog, approve stories, download JSON |

**Email and phone** are collected on member, volunteer, and list-a-pet forms. They live **only inside the JSON files**. They are **never** shown on the public site or on the owner desk. Open `data/members.json` or `data/listings.json` when you need to contact someone.

## Pages

- **`index.html`** — Insight of the Day, therapy preview, Caycuma call-to-action, journal preview  
- **`members.html`** — therapy stories + join form (email + phone required)  
- **`club.html`** — donate, volunteer, adopt, list a pet  
- **`blog.html`** / **`blog/post.html`** — journal  
- **`admin.html`** — owner desk (no password; export JSON when done)

## Everyday workflow

1. Open the site (or `admin.html`).
2. Write today’s insight, a blog post, approve members.
3. **Save JSON** → downloads four files.
4. Drop them into the `data/` folder and push / re-upload.
5. Live site updates. That’s it.

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
