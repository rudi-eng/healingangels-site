# Deployment guide — Healing Angels on Cloudflare + GitHub

Estimated time: **15 minutes**. All on Cloudflare's **free tier**.

---

## 0. Prerequisites

- A Cloudflare account (sign up free at <https://dash.cloudflare.com/sign-up>).
- A GitHub account.
- On your computer:
  - **Node.js 18+** — <https://nodejs.org/>
  - **Python 3.11+** — <https://www.python.org/>
  - **uv** — `pip install uv` or see <https://docs.astral.sh/uv/>
  - Cloudflare CLI: `npm install -g wrangler`
- Authenticate Wrangler once:
  ```
  wrangler login
  ```

## 1. Push this repo to GitHub

```
cd healingangels.site
git init
git add -A
git commit -m "Healing Angels — initial site + API"
git branch -M main
git remote add origin https://github.com/<your-username>/healingangels.site.git
git push -u origin main
```

## 2. Deploy the static front end on Cloudflare Pages

1. Go to **Cloudflare Dashboard → Pages → Create project → Connect to Git**.
2. Pick your `healingangels.site` repository.
3. Build settings:
   - **Framework preset**: `None`
   - **Build command**: *(leave empty)*
   - **Build output directory**: `/` (the repo root)
   - **Root directory**: `/`
4. **Save and Deploy**. Cloudflare Pages will give you a URL like `https://healingangels.pages.dev`. That's your site live.

## 3. Create the D1 database

```
wrangler d1 create healingangels
```

It will print a `database_id` like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Open `worker/wrangler.toml` and paste it into the `database_id` field.

## 4. Create the R2 photo bucket

```
wrangler r2 bucket create healing-photos
```

## 5. Apply the database schema (creates the tables)

From the repository root:

```
wrangler d1 execute healingangels --local  --file=schema/schema.sql
wrangler d1 execute healingangels --remote --file=schema/schema.sql
```

## 6. Seed example content (members, posts, listings, insight)

```
uv run python scripts/seed.py --local
uv run python scripts/seed.py --remote
```

After this, the homepage will show three example members, an example insight, two example blog posts, and four example adoptable pets.

## 7. Set the admin secrets

Generate the password hash:

```
uv run python scripts/hash.py
```

Enter a strong password (use **something different** from any password you have already shared anywhere). The script prints a `salt:hash` string.

Set three Cloudflare secrets (run from inside the `worker/` directory):

```
cd worker
wrangler secret put ADMIN_USERNAME
# paste: Laleh   (or your chosen admin username)

wrangler secret put ADMIN_PASSWORD_HASH
# paste the salt:hash string printed by scripts/hash.py

wrangler secret put SESSION_SECRET
# paste any long random string, e.g. the output of: python -c "import secrets; print(secrets.token_hex(32))"
```

## 8. Deploy the Python Worker

```
cd worker
uv run pywrangler deploy
```

It will deploy the API to something like `https://healingangels-api.<your-subdomain>.workers.dev`.

Test it:

```
curl https://healingangels-api.<your-subdomain>.workers.dev/api/
# {"ok":true,"name":"healingangels-api",...}
```

## 9. Connect the front end to the API

The frontend pages call `/api/*`. There are two easy ways to wire this up.

### Option A — route `/api/*` from the Pages project to the Worker (recommended)

1. In the Cloudflare dashboard go to **Pages → your project → Functions → Routes / bindings** (or **Custom Domains** for the Pages project).
2. Add a **route**: path pattern `/api/*` → the `healingangels-api` Worker.
3. After this, `https://healingangels.pages.dev/api/insight` proxies to the Worker and the homepage shows the live insight from D1.

### Option B — point the frontend at the worker's URL directly

Open `assets/js/app.js`, find the `API_BASE` line, and replace `/api` with the full Worker URL, e.g.:

```js
return "https://healingangels-api.<your-subdomain>.workers.dev/api";
```

Also update `CORS_ORIGIN` in `worker/wrangler.toml` to `https://healingangels.pages.dev` and redeploy the Worker with `uv run pywrangler deploy`.

## 10. (Optional) Use your own domain `healingangels.site`

1. In Cloudflare dashboard, add the site **healingangels.site** to Cloudflare DNS (free plan is fine).
2. Pages → your Pages project → **Custom domains** → **Set up a custom domain** → `healingangels.site`.
3. Update `CORS_ORIGIN` in `worker/wrangler.toml` to `https://healingangels.site` and redeploy the Worker.
4. If you used Option A above, point the `/api/*` route at the new domain.

## 11. Local development

```
# terminal 1 — run the API locally
cd worker
uv run pywrangler dev

# terminal 2 — serve the static pages
cd healingangels.site
python -m http.server 8000
```

Open <http://localhost:8000>. The frontend calls `/api/*` by default — to point it at your local Worker, open the browser console on `localhost:8000` and run:

```js
localStorage.apiBase = "http://localhost:8787/api";
location.reload();
```

(D1 + R2 run on the same local Wrangler session — your local DB is in `worker/.wrangler/state/v3/d1/...`.)

---

That's it. The site is live, the owner can sign in, and content updates from the dashboard appear instantly. No further code commits needed for everyday updates.