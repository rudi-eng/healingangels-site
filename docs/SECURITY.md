# Security notes — Healing Angels owner login

## Threat model

This is a **single-owner personal/community site**. The admin login protects only the owner dashboard. Public content (insights, blog, members, listings) is read by everyone. Member registrations and "list a pet" submissions are pending until the owner approves them.

## How the login works

1. The owner's password is run through `scripts/hash.py`, which produces `salt:hash` where:
   - `salt` is 16 hex bytes (32 chars) of `secrets.token_hex`
   - `hash` is `sha256(salt + ":" + password).hexdigest()`
2. That string is stored as a Cloudflare **secret** named `ADMIN_PASSWORD_HASH`. It is **not** in the repo, **not** in `wrangler.toml`, **not** in code.
3. The username is stored as the `ADMIN_USERNAME` secret.
4. On `POST /api/login` the Worker recomputes the hash from the submitted password and compares it with the stored hash using `hmac.compare_digest` (constant-time, so timing attacks leak nothing).
5. On success the Worker issues a signed session cookie `ha_session`:
   - Body is a JSON payload `{role:"admin", username:..., exp: <ts>}`.
   - Signature is `hmac_sha256(SESSION_SECRET, body)`.
   - Cookie attributes: `HttpOnly` (no JS access), `SameSite=Lax`, `Secure` (HTTPS only), `Max-Age=604800` (7 days).
6. Every admin-only route runs `require_admin`, which re-verifies the signature and the expiry on the cookie.

## Why SHA-256 instead of bcrypt/argon2?

Both `bcrypt` and `argon2` are third-party Python packages that require native C extensions. The **Cloudflare Python Workers** runtime supports only a subset of the Python standard library and does not reliably support those native extensions.

For this site's threat model, SHA-256 with a long random salt + online rate-limiting is appropriate because:

- There is **exactly one** owner account (no user-enumeration surface).
- Login runs over **HTTPS** (Cloudflare terminates TLS).
- Cloudflare applies automatic **rate-limiting / abuse protection** at the edge.
- The salt ensures the hash is unique even if someone reuses the password elsewhere.
- The secret is never committed to git, never sent to the browser.

If you ever grow to many users (e.g. allow public members to log in), replace this with a proper auth scheme (Cloudflare Zero Trust / Access, or a serverless OAuth provider) — not an upgraded hash. SHA-256+salt is a stop-gap for a single-admin site, not a multi-user auth system.

## Rotate the password

If the password may have leaked, or once a year for hygiene:

```
uv run python scripts/hash.py
# enter a new password
wrangler secret put ADMIN_PASSWORD_HASH
# paste the new salt:hash
```

Done. The old password stops working immediately (the Worker only ever reads the current secret).

## Rotate the session secret

```
python -c "import secrets; print(secrets.token_hex(32))"
wrangler secret put SESSION_SECRET
# paste the new string
```

This signs out **all** currently-logged-in sessions (including yours). Log in again with your password.

## What is NOT protected by the login

- The static pages themselves (`index.html`, `members.html`, `blog.html`, `club.html`) — these are intentionally public, served by Cloudflare Pages.
- Public reads of `/api/insight`, `/api/members`, `/api/blog`, `/api/blog/{id}`, `/api/listings`, `/api/photos`, `/api/photos/{key}`.
- The "become a member" and "list a pet" forms — these create **pending** records only. The owner has to approve them before they become public.

## What IS protected

- `PUT /api/insight`
- `GET /api/members/pending`
- `POST /api/members/{id}/approve|reject`
- `DELETE /api/members/{id}`
- `PUT /api/members/{id}`
- `POST /blog`, `PUT /api/blog/{id}`, `DELETE /api/blog/{id}`
- `POST /api/listings/{id}/approve|reject`
- `DELETE /api/listings/{id}`
- `POST /api/photos/upload`

All of these go through `@require_admin`, so a missing/invalid/expired cookie returns `403 Forbidden`.

## Public form spam

Member registration and list-a-pet are anonymous POST endpoints. Cloudflare's built-in bot protection reduces most abuse. For stronger protection, you can later add a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget to those forms — the Worker can verify the token in a few extra lines.

## Reporting a problem

Email `hello@healingangels.site` (or whatever contact address you set in the footer/README) if you suspect anything wrong.