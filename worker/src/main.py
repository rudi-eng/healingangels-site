"""Healing Angels — Cloudflare Python Worker.

A single-entry API serverless function for the Healing Angels site.
Implements: auth (session cookie), members, blog, insights, listings,
photos (R2). Data is stored in Cloudflare D1.

Bindings (in wrangler.toml):
  - DB      : D1 database
  - PHOTOS  : R2 bucket
Secrets (wrangler secret put ...):
  - ADMIN_USERNAME
  - ADMIN_PASSWORD_HASH    (sha256(salt + password); see scripts/hash.py)
  - SESSION_SECRET
Vars:
  - CORS_ORIGIN
"""

from __future__ import annotations

import json
import time
import hmac
import hashlib
import secrets as _secrets
from urllib.parse import parse_qs

from workers import WorkerEntrypoint, Response


# ----------------------------- helpers -----------------------------

def _json(data, status=200, headers=None):
    h = {"Content-Type": "application/json; charset=utf-8"}
    if headers:
        h.update(headers)
    return Response(json.dumps(data), status=status, headers=h)


def _text(body, status=200, headers=None):
    h = {"Content-Type": "text/plain; charset=utf-8"}
    if headers:
        h.update(headers)
    return Response(body, status=status, headers=h)


def _err(msg, status=400):
    return _json({"error": msg}, status=status)


def _cors_headers(env):
    origin = getattr(env, "CORS_ORIGIN", None) or "*"
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }


def _apply_cors(resp, env):
    for k, v in _cors_headers(env).items():
        resp.headers.set(k, v)
    return resp


# ----------------------------- db helpers -----------------------------

async def _db_query(env, sql, params=None):
    stmt = env.DB.prepare(sql)
    if params:
        stmt = stmt.bind(*params)
    result = await stmt.all()
    return result.results if hasattr(result, "results") else result


async def _db_one(env, sql, params=None):
    rows = await _db_query(env, sql, params)
    return rows[0] if rows else None


async def _db_run(env, sql, params=None):
    stmt = env.DB.prepare(sql)
    if params:
        stmt = stmt.bind(*params)
    return await stmt.run()


def _row_to_dict(row):
    if row is None:
        return None
    try:
        return dict(row)
    except Exception:
        # JS Proxy: copy known fields
        out = {}
        for k in row:
            out[k] = row[k]
        return out


# ----------------------------- auth -----------------------------

COOKIE_NAME = "ha_session"
SESSION_TTL = 60 * 60 * 24 * 7  # 7 days


def _hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((salt + ":" + password).encode()).hexdigest()


def _sign_token(env, payload: dict) -> str:
    secret = getattr(env, "SESSION_SECRET", None) or "dev-secret"
    body = json.dumps({"payload": payload, "exp": int(time.time()) + SESSION_TTL}, separators=(",", ":"))
    sig = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    token = body.encode().hex() + "." + sig
    return token


def _verify_token(env, token: str):
    if not token or "." not in token:
        return None
    try:
        body_hex, sig = token.rsplit(".", 1)
        body = bytes.fromhex(body_hex).decode()
        secret = getattr(env, "SESSION_SECRET", None) or "dev-secret"
        expected = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(body)
        if data.get("exp", 0) < int(time.time()):
            return None
        return data.get("payload")
    except Exception:
        return None


def _get_cookie(request, name):
    cookie = request.headers.get("Cookie") or ""
    for part in cookie.split(";"):
        if "=" in part:
            k, v = part.strip().split("=", 1)
            if k == name:
                return v
    return None


async def _is_admin(request, env):
    token = _get_cookie(request, COOKIE_NAME)
    payload = _verify_token(env, token or "")
    return bool(payload and payload.get("role") == "admin")


def _set_cookie_headers():
    # Cookie attributes set via Set-Cookie; HttpOnly, SameSite=Lax, Secure (auto on https)
    return {"Set-Cookie": f"{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"}


# ----------------------------- body parsing -----------------------------

async def _read_json(request):
    try:
        text = await request.text()
        return json.loads(text) if text else {}
    except Exception:
        return {}


async def _read_form(request):
    try:
        form = await request.formData()
        out = {}
        for k in form.keys():
            vals = form.get_all(k)
            out[k] = vals[0] if len(vals) == 1 else vals
        return out
    except Exception:
        return {}


# ----------------------------- id generation -----------------------------

def _new_id(prefix=""):
    return prefix + _secrets.token_hex(8)


# ----------------------------- router -----------------------------

class Default(WorkerEntrypoint):
    async def fetch(self, request):
        try:
            url = str(request.url)
            from urllib.parse import urlparse
            parsed = urlparse(url)
        except Exception:
            parsed = None
        path = parsed.path if parsed else "/"
        method = (request.method or "").upper()
        env = self.env

        # CORS preflight
        if method == "OPTIONS":
            return _apply_cors(_text("ok", 204), env)

        # Strip a leading /api
        route = path
        if route.startswith("/api"):
            route = route[len("/api"):] or "/"

        handler = _match(method, route)
        if not handler:
            return _apply_cors(_err("Not found", 404), env)

        try:
            resp = await handler(self, request, env)
        except PermissionError as e:
            resp = _err(str(e) or "Forbidden", 403)
        except Exception as e:
            resp = _err("Server error: " + str(e), 500)
        return _apply_cors(resp, env)


# ----------------------------- route table -----------------------------

ROUTES = []


def route(method, pattern):
    def deco(fn):
        ROUTES.append((method.upper(), pattern, fn))
        return fn
    return deco


def _split(p):
    return [s for s in p.split("/") if s != ""]


def _match(method, path):
    parts = _split(path)
    for m, pat, fn in ROUTES:
        if m != method:
            continue
        pp = _split(pat)
        if len(pp) != len(parts):
            continue
        params = {}
        ok = True
        for a, b in zip(pp, parts):
            if a.startswith("{") and a.endswith("}"):
                params[a[1:-1]] = b
            elif a != b:
                ok = False
                break
        if ok:
            return lambda self, req, env, params=params, fn=fn: fn(self, req, env, **params)
    return None


def require_admin(fn):
    async def wrapper(self, request, env, **params):
        if not await _is_admin(request, env):
            raise PermissionError("Admin only")
        return await fn(self, request, env, **params)
    return wrapper


# =================== INSIGHT ===================

@route("GET", "/insight")
async def get_insight(self, request, env):
    row = await _db_one(env, "SELECT * FROM insights ORDER BY id DESC LIMIT 1")
    if not row:
        return _json({"excerpt": "", "prayer": "", "set_at": None})
    d = _row_to_dict(row)
    return _json({"excerpt": d.get("excerpt"), "prayer": d.get("prayer"), "set_at": d.get("set_at")})


@route("PUT", "/insight")
@require_admin
async def set_insight(self, request, env):
    body = await _read_json(request)
    excerpt = (body.get("excerpt") or "").strip()
    prayer = (body.get("prayer") or "").strip()
    if not excerpt and not prayer:
        return _err("excerpt or prayer required")
    import datetime
    set_at = datetime.datetime.utcnow().isoformat() + "Z"
    await _db_run(
        env,
        "INSERT INTO insights (excerpt, prayer, set_at) VALUES (?, ?, ?)",
        [excerpt, prayer, set_at],
    )
    return _json({"ok": True, "excerpt": excerpt, "prayer": prayer, "set_at": set_at})


# =================== MEMBERS ===================

def _member_to_dict(row, badges=None):
    d = _row_to_dict(row) if row else None
    if d is None:
        return None
    if badges is not None:
        d["badges"] = badges
    return d


async def _load_badges(env, member_id):
    rows = await _db_query(env, "SELECT badge FROM member_badges WHERE member_id = ?", [member_id])
    return [r["badge"] for r in rows] if rows else []


@route("GET", "/members")
async def list_members(self, request, env):
    rows = await _db_query(env, "SELECT * FROM members WHERE status = 'approved' ORDER BY created_at DESC")
    out = []
    for r in rows or []:
        d = _row_to_dict(r)
        d["badges"] = await _load_badges(env, d["id"])
        out.append(d)
    return _json({"members": out})


@route("POST", "/members/register")
async def register_member(self, request, env):
    body = await _read_json(request)
    name = (body.get("name") or "").strip()
    story = (body.get("story") or "").strip()
    if not name or not story:
        return _err("name and story are required")
    mid = _new_id("m_")
    import datetime
    created = datetime.datetime.utcnow().isoformat() + "Z"
    await _db_run(
        env,
        """INSERT INTO members
           (id, name, photo_url, location, pet_name, pet_species, pet_breed, pet_adopted,
            story, contact_type, contact_value, status, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        [
            mid,
            name,
            (body.get("photo_url") or "").strip() or None,
            (body.get("location") or "").strip() or None,
            (body.get("pet_name") or "").strip() or None,
            (body.get("pet_species") or "cat").strip(),
            (body.get("pet_breed") or "").strip() or None,
            1 if body.get("pet_adopted") else 0,
            story,
            (body.get("contact_type") or "email").strip(),
            (body.get("contact_value") or "").strip() or None,
            "pending",
            created,
        ],
    )
    for b in (body.get("badges") or []):
        if b in ("donated", "adopter", "volunteer"):
            await _db_run(env, "INSERT INTO member_badges (member_id, badge) VALUES (?, ?)", [mid, b])
    return _json({"ok": True, "id": mid, "status": "pending"})


@route("GET", "/members/pending")
@require_admin
async def pending_members(self, request, env):
    rows = await _db_query(env, "SELECT * FROM members WHERE status = 'pending' ORDER BY created_at DESC")
    out = []
    for r in rows or []:
        d = _row_to_dict(r)
        d["badges"] = await _load_badges(env, d["id"])
        out.append(d)
    return _json({"members": out})


@route("POST", "/members/{id}/approve")
@require_admin
async def approve_member(self, request, env, id=None):
    import datetime
    await _db_run(
        env,
        "UPDATE members SET status = 'approved', approved_at = ? WHERE id = ?",
        [datetime.datetime.utcnow().isoformat() + "Z", id],
    )
    return _json({"ok": True})


@route("POST", "/members/{id}/reject")
@require_admin
async def reject_member(self, request, env, id=None):
    await _db_run(env, "UPDATE members SET status = 'rejected' WHERE id = ?", [id])
    return _json({"ok": True})


@route("DELETE", "/members/{id}")
@require_admin
async def delete_member(self, request, env, id=None):
    await _db_run(env, "DELETE FROM member_badges WHERE member_id = ?", [id])
    await _db_run(env, "DELETE FROM members WHERE id = ?", [id])
    return _json({"ok": True})


@route("PUT", "/members/{id}")
@require_admin
async def update_member(self, request, env, id=None):
    body = await _read_json(request)
    fields = ("name", "photo_url", "location", "pet_name", "pet_species", "pet_breed", "story", "contact_type", "contact_value")
    sets = []
    vals = []
    for f in fields:
        if f in body:
            sets.append(f"{f} = ?")
            vals.append(body[f])
    if sets:
        vals.append(id)
        await _db_run(env, f"UPDATE members SET {', '.join(sets)} WHERE id = ?", vals)
    return _json({"ok": True})


# =================== BLOG ===================

def _slugify(title):
    import re
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", (title or "").lower()).strip()
    s = re.sub(r"\s+", "-", s)
    return s or _new_id("post_")


@route("GET", "/blog")
async def list_posts(self, request, env):
    rows = await _db_query(env, "SELECT id, title, slug, cover_url, published_at, substr(body_md,1,1) as body_first FROM blog_posts ORDER BY published_at DESC")
    out = []
    for r in rows or []:
        d = _row_to_dict(r)
        out.append({k: d.get(k) for k in ("id", "title", "slug", "cover_url", "published_at")})
    # also pull summary
    for post in out:
        full = await _db_one(env, "SELECT body_md FROM blog_posts WHERE id = ?", [post["id"]])
        body = (full or {}).get("body_md", "")
        post["summary"] = body[:150]
    return _json({"posts": out})


@route("GET", "/blog/{id}")
async def get_post(self, request, env, id=None):
    row = await _db_one(env, "SELECT * FROM blog_posts WHERE id = ?", [id])
    if not row:
        return _err("Post not found", 404)
    return _json(_row_to_dict(row))


@route("POST", "/blog")
@require_admin
async def create_post(self, request, env):
    body = await _read_json(request)
    title = (body.get("title") or "").strip()
    body_md = body.get("body_md") or ""
    if not title or not body_md.strip():
        return _err("title and body_md are required")
    pid = _new_id("post_")
    slug = _slugify(title)
    cover = body.get("cover_url") or ""
    pub = body.get("published_at") or ""
    import datetime
    if not pub:
        pub = datetime.datetime.utcnow().date().isoformat()
    created = datetime.datetime.utcnow().isoformat() + "Z"
    await _db_run(
        env,
        """INSERT INTO blog_posts (id, title, slug, body_md, cover_url, published_at, created_at)
           VALUES (?,?,?,?,?,?,?)""",
        [pid, title, slug, body_md, cover, pub, created],
    )
    return _json({"ok": True, "id": pid})


@route("PUT", "/blog/{id}")
@require_admin
async def update_post(self, request, env, id=None):
    body = await _read_json(request)
    fields = ("title", "slug", "body_md", "cover_url", "published_at")
    sets = []
    vals = []
    for f in fields:
        if f in body:
            sets.append(f"{f} = ?")
            vals.append(body[f])
    if sets:
        vals.append(id)
        await _db_run(env, f"UPDATE blog_posts SET {', '.join(sets)} WHERE id = ?", vals)
    return _json({"ok": True})


@route("DELETE", "/blog/{id}")
@require_admin
async def delete_post(self, request, env, id=None):
    await _db_run(env, "DELETE FROM blog_posts WHERE id = ?", [id])
    return _json({"ok": True})


# =================== LISTINGS (Caycuma) ===================

@route("GET", "/listings")
async def list_listings(self, request, env):
    # public: only approved (admin sees all via same endpoint — frontend filters)
    rows = await _db_query(env, "SELECT * FROM listings ORDER BY created_at DESC")
    out = []
    for r in rows or []:
        out.append(_row_to_dict(r))
    return _json({"listings": out})


@route("POST", "/listings")
async def submit_listing(self, request, env):
    body = await _read_json(request)
    title = (body.get("title") or "").strip()
    body_text = (body.get("body") or "").strip()
    typ = (body.get("type") or "adopt").strip()
    if not title or not body_text:
        return _err("title and body are required")
    if typ not in ("adopt", "volunteer", "donate-link"):
        typ = "adopt"
    lid = _new_id("l_")
    import datetime
    created = datetime.datetime.utcnow().isoformat() + "Z"
    status = "approved" if typ == "volunteer" else "pending"
    await _db_run(
        env,
        """INSERT INTO listings (id, type, title, body, photo_url, pet_species, pet_breed, contact, status, created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?)""",
        [
            lid, typ, title, body_text,
            body.get("photo_url") or "",
            body.get("pet_species") or "",
            body.get("pet_breed") or "",
            body.get("contact") or "",
            status, created,
        ],
    )
    return _json({"ok": True, "id": lid, "status": status})


@route("POST", "/listings/{id}/approve")
@require_admin
async def approve_listing(self, request, env, id=None):
    import datetime
    await _db_run(
        env,
        "UPDATE listings SET status = 'approved', approved_at = ? WHERE id = ?",
        [datetime.datetime.utcnow().isoformat() + "Z", id],
    )
    return _json({"ok": True})


@route("POST", "/listings/{id}/reject")
@require_admin
async def reject_listing(self, request, env, id=None):
    await _db_run(env, "UPDATE listings SET status = 'rejected' WHERE id = ?", [id])
    return _json({"ok": True})


@route("DELETE", "/listings/{id}")
@require_admin
async def delete_listing(self, request, env, id=None):
    await _db_run(env, "DELETE FROM listings WHERE id = ?", [id])
    return _json({"ok": True})


# =================== PHOTOS (R2) ===================

@route("GET", "/photos")
async def list_photos(self, request, env):
    rows = await _db_query(env, "SELECT id, url, alt, created_at FROM photos ORDER BY created_at DESC LIMIT 50")
    out = [_row_to_dict(r) for r in rows or []]
    return _json({"photos": out})


@route("POST", "/photos/upload")
async def upload_photo(self, request, env):
    form = await _read_form(request)
    if not form or "file" not in form:
        return _err("file field required")
    file = form["file"]
    # JS File-like object from formData: read via .arrayBuffer()
    try:
        buf = await file.arrayBuffer()
        data = bytes(buf)
    except Exception as e:
        return _err("could not read file: " + str(e))
    alt = (form.get("alt") or "")
    ext = (file.name or "img").rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "gif", "webp", "avif"):
        ext = "jpg"
    key = _new_id() + "." + ext
    try:
        await env.PHOTOS.put(key, data, contentType=file.type or "image/" + ext)
    except Exception as e:
        return _err("R2 upload failed: " + str(e))

    # Construct a public URL. If using R2 public dev URL set PUBLIC_R2_BASE var,
    # this returns {PUBLIC_R2_BASE}/{key}. Otherwise proxy through the Worker.
    base = getattr(env, "PUBLIC_R2_BASE", "") or ""
    if base:
        url = base.rstrip("/") + "/" + key
    else:
        url = "/api/photos/" + key
    pid = _new_id("ph_")
    import datetime
    created = datetime.datetime.utcnow().isoformat() + "Z"
    await _db_run(
        env,
        "INSERT INTO photos (id, url, alt, created_at) VALUES (?,?,?,?)",
        [pid, url, alt, created],
    )
    return _json({"ok": True, "id": pid, "url": url})


@route("GET", "/photos/{key}")
async def get_photo(self, request, env, key=None):
    obj = await env.PHOTOS.get(key)
    if not obj:
        return _err("Not found", 404)
    body = await obj.arrayBuffer()
    ctype = obj.httpMetadata.get("contentType") if hasattr(obj, "httpMetadata") else "image/jpeg"
    return Response(body, status=200, headers={"Content-Type": ctype, "Cache-Control": "public, max-age=31536000"})


# =================== AUTH ===================

@route("POST", "/login")
async def login(self, request, env):
    body = await _read_json(request)
    username = (body.get("username") or "").strip()
    password = body.get("password") or ""
    admin_user = getattr(env, "ADMIN_USERNAME", "") or ""
    pw_hash = getattr(env, "ADMIN_PASSWORD_HASH", "") or ""
    # ADMIN_PASSWORD_HASH format: "salt:hash" (sha256). see scripts/hash.py
    if not admin_user or not pw_hash or ":" not in pw_hash:
        return _err("Admin is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD_HASH secrets.", 503)
    salt, stored_hash = pw_hash.split(":", 1)
    given_hash = _hash_password(password, salt)
    if not hmac.compare_digest(given_hash, stored_hash) or username != admin_user:
        return _err("Wrong username or password", 401)
    token = _sign_token(env, {"role": "admin", "username": username})
    return Response(
        json.dumps({"ok": True, "username": username}),
        status=200,
        headers={
            "Content-Type": "application/json",
            "Set-Cookie": f"{COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age={SESSION_TTL}",
        },
    )


@route("POST", "/logout")
async def logout(self, request, env):
    return Response(
        json.dumps({"ok": True}),
        status=200,
        headers={
            "Content-Type": "application/json",
            "Set-Cookie": f"{COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0",
        },
    )


@route("GET", "/me")
async def me(self, request, env):
    token = _get_cookie(request, COOKIE_NAME)
    payload = _verify_token(env, token or "")
    if payload and payload.get("role") == "admin":
        return _json({"username": payload.get("username"), "role": "admin"})
    return _json({"username": None, "role": None})


# =================== HEALTH ===================

@route("GET", "/")
async def index(self, request, env):
    return _json({"ok": True, "name": "healingangels-api", "version": "0.1.0"})