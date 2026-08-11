# Owner guide — the admin dashboard

The dashboard lives at **`/admin.html`** (e.g. <https://healingangels.site/admin>).

## Signing in

1. Open `/admin.html`.
2. Enter:
   - **Username** — the value you set as the `ADMIN_USERNAME` secret (e.g. `Laleh`).
   - **Password** — the password you ran through `scripts/hash.py`.
3. Click **Sign in**. Your session lasts 7 days.

If you ever see "Wrong username or password" and you're sure the credentials are correct, the most common cause is the `ADMIN_PASSWORD_HASH` secret being set without `salt:hash` format or with extra whitespace. Re-run `scripts/hash.py`, copy the printed value cleanly, and `wrangler secret put ADMIN_PASSWORD_HASH` again.

## The five tabs

### 1. Insight

The **Insight of the Day** is the first thing visitors see on the homepage. Type a short phrase or excerpt from the book, then a short prayer. Click **Publish today's insight**. It replaces the current insight immediately — no deploy, no commit.

The current insight is shown below the form for reference.

### 2. Blog

To write a new journal entry:

1. Title → **Title**
2. (Optional) Paste a photo URL into **Cover image URL**. To upload an image instead, switch to the **Photos** tab first, upload it, then copy its URL back here.
3. **Published date** — defaults to today.
4. **Body (Markdown)** — supports simple Markdown:
   - `# Big heading`
   - `## Smaller heading`
   - `**bold**` and `*italic*`
   - Lists with `- item`
   - Links: `[text](https://...)`
   - Images: `![alt text](https://...)`
   - A quote with `> ...`
5. Click **Save post**. It appears on `blog.html` immediately.

To **edit** an existing post, click **Edit** in the Existing posts table — the form loads the post; change it and Save.

To **delete**, click **Delete** — confirm — it's gone.

### 3. Members

This is the **Therapy Session** gallery queue.

- **Pending submissions** — visitors who filled the "Become a member" form on `members.html`. Their stories are NOT public yet.
  - **Approve** — publishes the story to the gallery immediately.
  - **Reject** — hides the submission without keeping it.
- **Approved members** — currently published.
  - **Delete** — permanently removes a member from the gallery.

### 4. Friends of Caycuma

Two queues: submissions from `club.html`'s volunteer form and "list a pet" form.

- **Pending** — waiting for your approval.
  - **Approve** — an adoption listing goes live on `club.html`; a volunteer offer stays in the table for your records.
  - **Reject** — discards the submission.
- **Published** — currently visible on `club.html`.
  - **Delete** — removes it.

> Note: volunteer offers are auto-approved (they only need to reach you). You'll find them under "Published" so you can email the volunteer directly.

### 5. Photos

Upload an image into R2 storage:

1. **Choose a file** (jpg, png, gif, webp, avif).
2. (Optional) **Description** → text used as alt text for accessibility.
3. **Upload** — the file is stored in R2 and a URL is printed.

After upload, the URL appears in the recent uploads grid. **Click the URL field to copy it**, then paste it into a blog post cover, a member record, or a Caycuma listing wherever you see a "Image URL" field.

## Public content updates from the dashboard

Everything the owner creates or approves in the dashboard appears on the public site **immediately** — there is no "save to GitHub" step.

## What the owner NEVER has to do

- Edit JSON files by hand
- Touch the database directly
- Run git commands
- Re-deploy anything to update content

The only time you need to touch git/Cloudflare again is to **change the password** (set a new `ADMIN_PASSWORD_HASH` secret) — see `docs/SECURITY.md`.