# Deploy — Healing Angels (static + JSON)

Estimated time: **5 minutes**. No database, no Worker, no secrets.

## 1. Put the site on GitHub

```
git add -A
git commit -m "Healing Angels static site"
git push origin main
```

Repo: `https://github.com/rudi-eng/healingangels-site`

## 2. Cloudflare Pages

1. Dashboard → **Pages** → **Create** → **Connect to Git**.
2. Choose `healingangels-site`.
3. Settings:
   - **Framework preset**: None  
   - **Build command**: *(empty)*  
   - **Build output directory**: `/`  
   - **Root directory**: `/`
4. **Save and Deploy**.

You get a URL like `https://healingangels-site.pages.dev`.

## 3. Custom domain (optional)

Pages → project → **Custom domains** → `healingangels.site`.

## 4. Updating content

1. Open **`/admin.html`** on the live site (or locally).
2. Edit insight / blog / approve members.
3. **Save JSON** → download the four files.
4. Replace files in `data/` in the repo.
5. `git push` — Pages redeploys automatically.

To contact a member or listing submitter, open the JSON file and read `email` / `phone`. Those fields never appear in the owner desk UI.

## Local development

```
python -m http.server 8000
```

Open <http://localhost:8000>.
