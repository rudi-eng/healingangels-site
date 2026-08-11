"""Produce the ADMIN_PASSWORD_HASH secret from a chosen password.

Usage:
    uv run python scripts/hash.py
    # then enter your password when prompted
    # the script prints a string like:  9c4f...:e3b0...
    # set it as a Cloudflare secret:     wrangler secret put ADMIN_PASSWORD_HASH

The format is  "<salt>:<sha256(salt + ':' + password)>"  — the Worker's
login handler verifies against this using hmac.compare_digest (constant time).

NOTE on choice of algorithm:
  bcrypt/argon2 would be more standard, but those libraries may not be
  available in the Cloudflare Python Workers runtime (restricted stdlib).
  This worker runs on a fast edge runtime with rate-limiting by Cloudflare,
  HTTPS, and an HttpOnly cookie — and there is exactly ONE owner account.
  SHA-256 with a long random salt and online rate-limiting is sufficient
  for this site's threat model. See docs/SECURITY.md for the reasoning and
  how to upgrade if you ever add many users.
"""

import hashlib
import secrets
import getpass


def make_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256((salt + ":" + password).encode()).hexdigest()
    return f"{salt}:{h}"


def verify_hash(password: str, stored: str) -> bool:
    if ":" not in stored:
        return False
    salt, expected = stored.split(":", 1)
    given = hashlib.sha256((salt + ":" + password).encode()).hexdigest()
    # constant-time compare
    return secrets.compare_digest(given, expected)


if __name__ == "__main__":
    print("Healing Angels — admin password hash generator")
    print("Your input will not be echoed. Press Enter to confirm.\n")
    pw = getpass.getpass("Choose the owner password: ")
    if not pw:
        print("Password cannot be empty.")
        raise SystemExit(1)
    pw2 = getpass.getpass("Repeat password:      ")
    if pw != pw2:
        print("Passwords do not match.")
        raise SystemExit(1)
    h = make_hash(pw)
    print("\n--------------- ADMIN_PASSWORD_HASH ---------------")
    print(h)
    print("---------------------------------------------------")
    print("\nIn the worker/ directory run:")
    print("  wrangler secret put ADMIN_PASSWORD_HASH")
    print("and paste the value above when prompted.")
    print("\nAlso set the username secret:")
    print("  wrangler secret put ADMIN_USERNAME")
    print("and enter: Laleh  (or your chosen admin username)\n")
    print("Self-test:", "OK" if verify_hash(pw, h) else "FAILED")