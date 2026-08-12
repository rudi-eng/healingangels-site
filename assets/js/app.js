/* Healing Angels — static site runtime
   - Public content: data/*.json + local auto-save (no email/phone)
   - Private contacts: locked vault (email/phone) — not on public pages or desk tables
   - Owner desk: password gate (default 1234Laleh), changeable
*/

(function () {
  "use strict";

  var STORE_KEY = "ha_store_v1";
  var PRIVATE_KEY = "ha_private_v1";
  var AUTH_KEY = "ha_auth_v1";
  var SESSION_KEY = "ha_session_v1";
  var DEFAULT_PASSWORD = "1234Laleh";

  /** Path to data/*.json from the current HTML page (handles blog/ subfolder). */
  function dataPath(file) {
    var path = (location.pathname || "").replace(/\\/g, "/");
    var inBlog = /\/blog(?:\/|$)/.test(path) || /blog\/[^/]+\.html$/i.test(path);
    return (inBlog ? "../data/" : "data/") + file;
  }

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fmtDate(s) {
    if (!s) return "";
    try {
      return new Date(s).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return s;
    }
  }

  function badgeLabel(b) {
    var map = { donated: "donated", adopter: "adopter", volunteer: "volunteer" };
    return map[b] || b;
  }

  function uid(prefix) {
    return (
      (prefix || "id") +
      "_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function mdToHtml(md) {
    if (!md) return "";
    var s = String(md);
    s = s.replace(/```([\s\S]*?)```/g, function (_, c) {
      return "<pre><code>" + esc(c.trim()) + "</code></pre>";
    });
    s = esc(s);
    s = s.replace(
      /&lt;pre&gt;&lt;code&gt;([\s\S]*?)&lt;\/code&gt;&lt;\/pre&gt;/g,
      function (_, c) {
        return "<pre><code>" + c + "</code></pre>";
      }
    );
    s = s.replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img alt="$1" src="$2" loading="lazy">'
    );
    s = s.replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    s = s
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h2>$1</h2>");
    s = s.replace(/^---+$/gm, "<hr>");
    s = s.replace(/^&gt; (.*)$/gm, "<blockquote>$1</blockquote>");
    s = s
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/(?:^|\n)[-*] (.+)/g, function (_, line) {
      return "\n<li>" + line + "</li>";
    });
    s = s.replace(/(<li>[\s\S]*?<\/li>)/g, function (m) {
      return "<ul>" + m.replace(/\n/g, "") + "</ul>";
    });
    s = s
      .split(/\n{2,}/)
      .map(function (block) {
        if (/^\s*<(h\d|ul|ol|pre|blockquote|hr|img)/.test(block)) return block;
        return "<p>" + block.trim().replace(/\n/g, "<br>") + "</p>";
      })
      .join("\n");
    return s;
  }

  function placeholderSVG(seed, label) {
    var palettes = [
      ["#F4ECE0", "#C9A6A0"],
      ["#F4ECE0", "#8BA888"],
      ["#F4ECE0", "#C8A951"],
      ["#F3E3E1", "#A9807A"],
      ["#E5EFE3", "#6E8C6B"],
      ["#FBEFD6", "#A88B34"],
    ];
    var p = palettes[(seed || 0) % palettes.length];
    var lbl = label ? label : "";
    return (
      '<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="320" fill="' +
      p[0] +
      '"/>' +
      '<circle cx="200" cy="135" r="58" fill="' +
      p[1] +
      '" opacity="0.35"/>' +
      '<path d="M120 240 Q200 170 280 240 L280 320 L120 320 Z" fill="' +
      p[1] +
      '" opacity="0.35"/>' +
      '<text x="200" y="300" font-family="Georgia, serif" font-size="15" fill="#5E5A55" text-anchor="middle" opacity="0.7">' +
      esc(lbl) +
      "</text></svg>"
    );
  }

  function imgOrPlaceholder(src, seed, label, cls) {
    var c = cls ? cls : "card-photo placeholder";
    if (!src || String(src).endsWith(".svg")) {
      return '<div class="' + c + '">' + placeholderSVG(seed, label) + "</div>";
    }
    return (
      '<div class="' +
      (cls ? cls : "card-photo") +
      '"><img src="' +
      esc(src) +
      '" alt="' +
      esc(label || "") +
      '" loading="lazy"></div>'
    );
  }

  function setNavActive(id) {
    document.querySelectorAll(".nav a").forEach(function (a) {
      if (a.dataset.nav === id) a.classList.add("active");
    });
  }

  async function fetchJson(path) {
    var res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load " + path);
    return res.json();
  }

  function readLocal() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function writeLocal(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  /* ---------- Password / session ---------- */
  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(function (b) {
        return b.toString(16).padStart(2, "0");
      })
      .join("");
  }

  async function sha256(text) {
    var buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(String(text))
    );
    return toHex(buf);
  }

  async function ensureAuthInit() {
    try {
      var raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.hash) return parsed;
      }
    } catch (e) {}
    var hash = await sha256(DEFAULT_PASSWORD);
    var auth = { hash: hash, updated_at: new Date().toISOString() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    return auth;
  }

  function isLoggedIn() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  async function login(password) {
    var auth = await ensureAuthInit();
    var h = await sha256(password || "");
    if (h !== auth.hash) {
      var err = new Error("Wrong password.");
      throw err;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {}
    return { ok: true };
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  async function changePassword(currentPassword, newPassword) {
    var auth = await ensureAuthInit();
    var cur = await sha256(currentPassword || "");
    if (cur !== auth.hash) throw new Error("Current password is wrong.");
    var next = String(newPassword || "");
    if (next.length < 4) throw new Error("New password must be at least 4 characters.");
    var hash = await sha256(next);
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ hash: hash, updated_at: new Date().toISOString() })
    );
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {}
    return { ok: true };
  }

  /* ---------- Private contact vault (email/phone only) ---------- */
  function readPrivate() {
    try {
      var raw = localStorage.getItem(PRIVATE_KEY);
      if (!raw) return { members: {}, listings: {} };
      var p = JSON.parse(raw);
      return {
        members: p.members || {},
        listings: p.listings || {},
      };
    } catch (e) {
      return { members: {}, listings: {} };
    }
  }

  function writePrivate(vault) {
    localStorage.setItem(PRIVATE_KEY, JSON.stringify(vault));
  }

  function setPrivateContact(kind, id, email, phone) {
    var vault = readPrivate();
    if (!vault[kind]) vault[kind] = {};
    vault[kind][id] = {
      email: (email || "").trim(),
      phone: (phone || "").trim(),
    };
    writePrivate(vault);
  }

  function deletePrivateContact(kind, id) {
    var vault = readPrivate();
    if (vault[kind] && vault[kind][id]) {
      delete vault[kind][id];
      writePrivate(vault);
    }
  }

  /** Strip email/phone from a public record (never leave them in the public store). */
  function publicizeMember(m) {
    if (!m) return m;
    return {
      id: m.id,
      name: m.name || "",
      location: m.location || "",
      photo_url: m.photo_url || "",
      pet_name: m.pet_name || "",
      pet_species: m.pet_species || "",
      pet_breed: m.pet_breed || "",
      story: m.story || "",
      badges: Array.isArray(m.badges) ? m.badges : [],
      status: m.status || "pending",
      submitted_at: m.submitted_at || "",
    };
  }

  function publicizeListing(l) {
    if (!l) return l;
    return {
      id: l.id,
      type: l.type || "adopt",
      title: l.title || "",
      body: l.body || "",
      photo_url: l.photo_url || "",
      pet_species: l.pet_species || "",
      pet_breed: l.pet_breed || "",
      status: l.status || "pending",
      submitted_at: l.submitted_at || "",
    };
  }

  /** Migrate any email/phone found on records into the private vault. */
  function migrateSecretsFrom(store) {
    var vault = readPrivate();
    var changed = false;
    (store.members || []).forEach(function (m) {
      if (!m || !m.id) return;
      if (m.email || m.phone) {
        if (!vault.members[m.id]) {
          vault.members[m.id] = {
            email: (m.email || "").trim(),
            phone: (m.phone || "").trim(),
          };
          changed = true;
        }
      }
    });
    (store.listings || []).forEach(function (l) {
      if (!l || !l.id) return;
      if (l.email || l.phone || l.contact) {
        if (!vault.listings[l.id]) {
          vault.listings[l.id] = {
            email: (l.email || "").trim(),
            phone: (l.phone || l.contact || "").trim(),
          };
          changed = true;
        }
      }
    });
    if (changed) writePrivate(vault);
    store.members = (store.members || []).map(publicizeMember);
    store.listings = (store.listings || []).map(publicizeListing);
    return store;
  }

  function emptyStore() {
    return {
      _dirty: false,
      insight: { excerpt: "", prayer: "", set_at: "" },
      members: [],
      posts: [],
      listings: [],
    };
  }

  async function loadFiles() {
    var base = emptyStore();
    try {
      var insight = await fetchJson(dataPath("insight.json"));
      base.insight = {
        excerpt: insight.excerpt || "",
        prayer: insight.prayer || "",
        set_at: insight.set_at || "",
      };
    } catch (e) {}
    try {
      var members = await fetchJson(dataPath("members.json"));
      base.members = Array.isArray(members.members) ? members.members : [];
    } catch (e) {}
    try {
      var blog = await fetchJson(dataPath("blog.json"));
      base.posts = Array.isArray(blog.posts) ? blog.posts : [];
    } catch (e) {}
    try {
      var listings = await fetchJson(dataPath("listings.json"));
      base.listings = Array.isArray(listings.listings) ? listings.listings : [];
    } catch (e) {}
    return migrateSecretsFrom(base);
  }

  function mergeById(fileItems, localItems) {
    var map = {};
    (fileItems || []).forEach(function (x) {
      if (x && x.id) map[x.id] = x;
    });
    (localItems || []).forEach(function (x) {
      if (x && x.id) map[x.id] = x;
    });
    return Object.keys(map).map(function (k) {
      return map[k];
    });
  }

  /**
   * Load site data from data/*.json.
   * If this browser has owner edits or form submissions (_dirty),
   * those are merged on top so the owner desk and signups still work.
   */
  async function loadStore() {
    var base = await loadFiles();
    var local = readLocal();
    if (!local || !local._dirty) return base;

    var merged = {
      _dirty: true,
      insight: local.insight || base.insight,
      members: mergeById(base.members, local.members),
      posts: mergeById(base.posts, local.posts),
      listings: mergeById(base.listings, local.listings),
    };
    return migrateSecretsFrom(merged);
  }

  function getStoreSync() {
    return readLocal() || emptyStore();
  }

  function saveStore(store) {
    store = migrateSecretsFrom(store);
    store._dirty = true;
    writeLocal(store);
    return store;
  }

  function downloadJson(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }

  var data = {
    load: loadStore,
    get: getStoreSync,
    save: saveStore,

    insight: async function () {
      var s = await loadStore();
      return s.insight;
    },

    setInsight: async function (body) {
      var s = await loadStore();
      s.insight = {
        excerpt: (body && body.excerpt) || "",
        prayer: (body && body.prayer) || "",
        set_at: new Date().toISOString().slice(0, 10),
      };
      saveStore(s);
      return s.insight;
    },

    members: async function (opts) {
      var s = await loadStore();
      var list = s.members || [];
      var all = opts && opts.all;
      if (!all) list = list.filter(function (m) {
        return m.status === "approved";
      });
      return { members: list };
    },

    registerMember: async function (body) {
      var email = (body.email || "").trim();
      var phone = (body.phone || "").trim();
      if (!(body.name || "").trim() || !(body.story || "").trim() || !email || !phone) {
        throw new Error("Name, story, email and phone are required.");
      }
      var s = await loadStore();
      var m = publicizeMember({
        id: uid("m"),
        name: (body.name || "").trim(),
        location: (body.location || "").trim(),
        photo_url: (body.photo_url || "").trim(),
        pet_name: (body.pet_name || "").trim(),
        pet_species: body.pet_species || "cat",
        pet_breed: (body.pet_breed || "").trim(),
        story: (body.story || "").trim(),
        badges: Array.isArray(body.badges) ? body.badges : [],
        status: "pending",
        submitted_at: new Date().toISOString().slice(0, 10),
      });
      setPrivateContact("members", m.id, email, phone);
      s.members.unshift(m);
      saveStore(s);
      return { ok: true, id: m.id };
    },

    setMemberStatus: async function (id, status) {
      var s = await loadStore();
      var m = s.members.find(function (x) {
        return x.id === id;
      });
      if (!m) throw new Error("Member not found");
      if (status === "rejected") {
        s.members = s.members.filter(function (x) {
          return x.id !== id;
        });
        deletePrivateContact("members", id);
      } else {
        m.status = status;
      }
      saveStore(s);
      return { ok: true };
    },

    deleteMember: async function (id) {
      var s = await loadStore();
      s.members = s.members.filter(function (x) {
        return x.id !== id;
      });
      deletePrivateContact("members", id);
      saveStore(s);
      return { ok: true };
    },

    blog: async function () {
      var s = await loadStore();
      var posts = (s.posts || []).slice().sort(function (a, b) {
        return String(b.published_at || "").localeCompare(String(a.published_at || ""));
      });
      return { posts: posts };
    },

    post: async function (id) {
      var s = await loadStore();
      return (
        (s.posts || []).find(function (p) {
          return p.id === id;
        }) || null
      );
    },

    savePost: async function (body) {
      var s = await loadStore();
      var post = {
        id: body.id || uid("post"),
        title: (body.title || "").trim(),
        cover_url: (body.cover_url || "").trim(),
        published_at:
          body.published_at || new Date().toISOString().slice(0, 10),
        body_md: body.body_md || "",
      };
      if (!post.title) throw new Error("Title is required");
      var idx = s.posts.findIndex(function (p) {
        return p.id === post.id;
      });
      if (idx >= 0) s.posts[idx] = post;
      else s.posts.unshift(post);
      saveStore(s);
      return post;
    },

    deletePost: async function (id) {
      var s = await loadStore();
      s.posts = s.posts.filter(function (p) {
        return p.id !== id;
      });
      saveStore(s);
      return { ok: true };
    },

    listings: async function (opts) {
      var s = await loadStore();
      var list = s.listings || [];
      if (!(opts && opts.all)) {
        list = list.filter(function (l) {
          return l.status === "approved";
        });
      }
      return { listings: list };
    },

    submitListing: async function (body) {
      var email = (body.email || "").trim();
      var phone = (body.phone || "").trim();
      if (!(body.title || "").trim()) throw new Error("Title is required");
      if (!email || !phone) throw new Error("Email and phone are required.");
      var s = await loadStore();
      var row = publicizeListing({
        id: uid("l"),
        type: body.type || "adopt",
        title: (body.title || "").trim(),
        body: (body.body || "").trim(),
        photo_url: (body.photo_url || "").trim(),
        pet_species: body.pet_species || "",
        pet_breed: (body.pet_breed || "").trim(),
        status: "pending",
        submitted_at: new Date().toISOString().slice(0, 10),
      });
      setPrivateContact("listings", row.id, email, phone);
      s.listings.unshift(row);
      saveStore(s);
      return { ok: true, id: row.id };
    },

    setListingStatus: async function (id, status) {
      var s = await loadStore();
      var row = s.listings.find(function (x) {
        return x.id === id;
      });
      if (!row) throw new Error("Listing not found");
      if (status === "rejected") {
        s.listings = s.listings.filter(function (x) {
          return x.id !== id;
        });
        deletePrivateContact("listings", id);
      } else {
        row.status = status;
      }
      saveStore(s);
      return { ok: true };
    },

    deleteListing: async function (id) {
      var s = await loadStore();
      s.listings = s.listings.filter(function (x) {
        return x.id !== id;
      });
      deletePrivateContact("listings", id);
      saveStore(s);
      return { ok: true };
    },

    /**
     * Owner-only: full backup JSON including private email/phone.
     * Requires an active login session.
     */
    exportAll: async function () {
      if (!isLoggedIn()) throw new Error("Please sign in first.");
      var s = await loadStore();
      var vault = readPrivate();
      var membersFull = (s.members || []).map(function (m) {
        var priv = (vault.members && vault.members[m.id]) || {};
        return Object.assign({}, m, {
          email: priv.email || "",
          phone: priv.phone || "",
        });
      });
      var listingsFull = (s.listings || []).map(function (l) {
        var priv = (vault.listings && vault.listings[l.id]) || {};
        return Object.assign({}, l, {
          email: priv.email || "",
          phone: priv.phone || "",
        });
      });
      downloadJson("insight.json", {
        excerpt: s.insight.excerpt || "",
        prayer: s.insight.prayer || "",
        set_at: s.insight.set_at || "",
      });
      setTimeout(function () {
        downloadJson("members.json", { members: membersFull });
      }, 200);
      setTimeout(function () {
        downloadJson("blog.json", { posts: s.posts || [] });
      }, 400);
      setTimeout(function () {
        downloadJson("listings.json", { listings: listingsFull });
      }, 600);
      setTimeout(function () {
        downloadJson("private-contacts.json", vault);
      }, 800);
    },

    resetToFiles: function () {
      if (!isLoggedIn()) throw new Error("Please sign in first.");
      localStorage.removeItem(STORE_KEY);
      // keep password + private vault unless owner clears vault separately
    },

    clearPrivateVault: function () {
      if (!isLoggedIn()) throw new Error("Please sign in first.");
      localStorage.removeItem(PRIVATE_KEY);
    },
  };

  var auth = {
    login: login,
    logout: logout,
    changePassword: changePassword,
    isLoggedIn: isLoggedIn,
    ensureInit: ensureAuthInit,
    defaultHint: "Default password is 1234Laleh until you change it.",
  };

  function init() {
    // Guarantee visible body even if a CSS animation misbehaves
    try {
      document.body.style.opacity = "1";
    } catch (e) {}

    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (toggle && nav)
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
    document.querySelectorAll("[data-year]").forEach(function (n) {
      n.textContent = new Date().getFullYear();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Warm password hash on first visit (so default 1234Laleh works immediately)
  ensureAuthInit().catch(function () {});

  window.HA = Object.assign(window.HA || {}, {
    data: data,
    api: data, // keep old name so pages can call HA.api.*
    auth: auth,
    fmtDate: fmtDate,
    esc: esc,
    mdToHtml: mdToHtml,
    placeholderSVG: placeholderSVG,
    imgOrPlaceholder: imgOrPlaceholder,
    setNavActive: setNavActive,
    badgeLabel: badgeLabel,
    uid: uid,
  });
})();
