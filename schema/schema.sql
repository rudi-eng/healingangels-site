-- Healing Angels — D1 schema (idempotent)
-- Run with:   wrangler d1 execute healingangels --file=schema/schema.sql
-- (add --remote to apply to the production DB instead of local)

CREATE TABLE IF NOT EXISTS members (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  photo_url       TEXT,
  location        TEXT,
  pet_name        TEXT,
  pet_species     TEXT DEFAULT 'cat',
  pet_breed       TEXT,
  pet_adopted     INTEGER DEFAULT 0,
  story           TEXT,
  contact_type    TEXT DEFAULT 'email',
  contact_value   TEXT,
  status          TEXT DEFAULT 'pending',   -- pending | approved | rejected
  created_at      TEXT,
  approved_at     TEXT
);

CREATE TABLE IF NOT EXISTS member_badges (
  member_id  TEXT NOT NULL,
  badge      TEXT NOT NULL,                  -- donated | adopter | volunteer
  PRIMARY KEY (member_id, badge)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT,
  body_md       TEXT,
  cover_url     TEXT,
  published_at  TEXT,
  created_at    TEXT
);

CREATE TABLE IF NOT EXISTS insights (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  excerpt TEXT,
  prayer  TEXT,
  set_at  TEXT
);

CREATE TABLE IF NOT EXISTS listings (
  id           TEXT PRIMARY KEY,
  type         TEXT,                        -- adopt | volunteer | donate-link
  title        TEXT,
  body         TEXT,
  photo_url    TEXT,
  pet_species  TEXT,
  pet_breed    TEXT,
  contact      TEXT,
  status       TEXT DEFAULT 'pending',      -- pending | approved | rejected
  created_at   TEXT,
  approved_at  TEXT
);

CREATE TABLE IF NOT EXISTS photos (
  id          TEXT PRIMARY KEY,
  url         TEXT,
  alt         TEXT,
  created_at  TEXT
);