"""Seed the D1 database from the JSON files in seed/.

Usage (from the repo root):
    uv run python scripts/seed.py --remote
    uv run python scripts/seed.py --local

This inserts ONLY rows whose ids do not already exist in the DB, so it can be
re-run safely (idempotent).
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "seed"


def load(name):
    path = SEED / name
    if not path.exists():
        print(f"WARN: {path} not found, skipping")
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def d1(args, sql, params=None):
    cmd = ["wrangler", "d1", "execute", "healingangels"]
    if args.remote:
        cmd.append("--remote")
    else:
        cmd.append("--local")
    if params:
        bindings = []
        for p in params:
            if p is None:
                bindings.append("NULL")
            elif isinstance(p, (int, float)):
                bindings.append(str(p))
            else:
                s = str(p).replace("'", "''")
                bindings.append(f"'{s}'")
        sql_exec = sql.replace("?", "{}").format(*bindings)
    else:
        sql_exec = sql
    cmd += ["--command", sql_exec]
    print(">", sql_exec[:120] + ("..." if len(sql_exec) > 120 else ""))
    if args.dry_run:
        return
    try:
        subprocess.run(cmd, check=True, cwd=str(ROOT / "worker"))
    except subprocess.CalledProcessError as e:
        print(f"FAIL: {e}")
        sys.exit(1)


def seed_insights(args, data):
    for i in data.get("insights", []):
        d1(
            args,
            "INSERT OR IGNORE INTO insights (excerpt, prayer, set_at) VALUES (?, ?, ?)",
            [i.get("excerpt", ""), i.get("prayer", ""), i.get("set_at") or "2026-08-11T00:00:00Z"],
        )


def seed_members(args, data):
    for m in data.get("members", []):
        d1(
            args,
            """INSERT OR IGNORE INTO members
               (id, name, photo_url, location, pet_name, pet_species, pet_breed,
                pet_adopted, story, contact_type, contact_value, status, created_at, approved_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                m["id"], m.get("name", ""), m.get("photo_url") or "",
                m.get("location") or "", m.get("pet_name") or "",
                m.get("pet_species") or "cat", m.get("pet_breed") or "",
                1 if m.get("pet_adopted") else 0,
                m.get("story", ""), m.get("contact_type") or "email",
                m.get("contact_value") or "", m.get("status") or "pending",
                m.get("created_at") or "2026-08-11T00:00:00Z",
                m.get("approved_at") or "2026-08-11T00:00:00Z",
            ],
        )
        for b in m.get("badges", []):
            d1(
                args,
                "INSERT OR IGNORE INTO member_badges (member_id, badge) VALUES (?, ?)",
                [m["id"], b],
            )


def seed_blog(args, data):
    for p in data.get("posts", []):
        d1(
            args,
            """INSERT OR IGNORE INTO blog_posts
               (id, title, slug, body_md, cover_url, published_at, created_at)
               VALUES (?,?,?,?,?,?,?)""",
            [
                p["id"], p.get("title", ""), p.get("slug") or "",
                p.get("body_md", ""), p.get("cover_url") or "",
                p.get("published_at") or "2026-08-11",
                "2026-08-11T00:00:00Z",
            ],
        )


def seed_listings(args, data):
    for l in data.get("listings", []):
        d1(
            args,
            """INSERT OR IGNORE INTO listings
               (id, type, title, body, photo_url, pet_species, pet_breed,
                contact, status, created_at, approved_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
            [
                l["id"], l.get("type", "adopt"), l.get("title", ""),
                l.get("body", ""), l.get("photo_url") or "",
                l.get("pet_species") or "", l.get("pet_breed") or "",
                l.get("contact") or "", l.get("status") or "pending",
                "2026-08-11T00:00:00Z", "2026-08-11T00:00:00Z",
            ],
        )


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--remote", action="store_true", help="apply to the remote D1")
    g.add_argument("--local", action="store_true", help="apply to the local D1 (default)")
    ap.add_argument("--dry-run", action="store_true", help="print but don't execute")
    args = argparse.Namespace(
        remote=ap.parse_args().remote,
        local=not ap.parse_args().remote,
        dry_run=ap.parse_args().dry_run,
    )

    if not (args.remote or args.local):
        args.local = True

    # 1. schema
    print("\n=== Applying schema ===")
    cmd = ["wrangler", "d1", "execute", "healingangels"]
    cmd.append("--remote" if args.remote else "--local")
    cmd += ["--file", str(ROOT / "schema" / "schema.sql")]
    print(">", " ".join(cmd))
    if not args.dry_run:
        try:
            subprocess.run(cmd, check=True, cwd=str(ROOT / "worker"))
        except subprocess.CalledProcessError as e:
            print(f"FAIL schema: {e}")
            sys.exit(1)

    # 2. seed data
    print("\n=== Seeding data ===")
    if (i := load("insight.sample.json")) is not None:
        seed_insights(args, i)
    if (m := load("members.sample.json")) is not None:
        seed_members(args, m)
    if (b := load("blog.sample.json")) is not None:
        seed_blog(args, b)
    if (l := load("listings.sample.json")) is not None:
        seed_listings(args, l)

    print("\nDone.")


if __name__ == "__main__":
    main()