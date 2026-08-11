/* Healing Angels — shared frontend runtime
   - API client with relative /api base (same-origin in prod; configurable for local)
   - nav toggle, footer year, render helpers, placeholder SVGs
*/

(function () {
  "use strict";

  // Base URL for the API. In production both Pages and Worker are served
  // from the same domain, so "/api" works. For local dev against a Worker
  // running on localhost:8787, set localStorage.apiBase = "http://localhost:8787".
  const API_BASE = (function () {
    try { const v = localStorage.getItem("apiBase"); if (v) return v.replace(/\/$/, ""); } catch (e) {}
    return "/api";
  })();

  async function req(path, opts) {
    const o = opts || {};
    const init = {
      method: o.method || "GET",
      headers: o.headers || {},
      credentials: "same-origin",
    };
    if (o.body !== undefined && o.body !== null) {
      if (o.body instanceof FormData) { init.body = o.body; }
      else { init.headers["Content-Type"] = "application/json"; init.body = JSON.stringify(o.body); }
    }
    let res;
    try { res = await fetch(API_BASE + path, init); }
    catch (e) { throw new Error("Network error reaching the server. Is the API running?"); }
    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) { try { data = await res.json(); } catch (e) { data = null; } }
    else { try { data = await res.text(); } catch (e) {} }
    if (!res.ok) {
      const msg = (data && (data.error || data.message)) || ("HTTP " + res.status);
      const err = new Error(msg); err.status = res.status; err.data = data; throw err;
    }
    return data;
  }

  const api = {
    insight:        () => req("/insight"),
    setInsight:     (body) => req("/insight", { method: "PUT", body }),
    members:        () => req("/members"),
    registerMember: (body) => req("/members/register", { method: "POST", body }),
    pendingMembers: () => req("/members/pending"),
    approveMember:  (id) => req(`/members/${id}/approve`, { method: "POST" }),
    rejectMember:   (id) => req(`/members/${id}/reject`, { method: "POST" }),
    deleteMember:   (id) => req(`/members/${id}`, { method: "DELETE" }),
    updateMember:   (id, body) => req(`/members/${id}`, { method: "PUT", body }),
    blog:           () => req("/blog"),
    post:           (id) => req(`/blog/${encodeURIComponent(id)}`),
    savePost:       (body) => req("/blog", { method: "POST", body }),
    updatePost:     (id, body) => req(`/blog/${encodeURIComponent(id)}`, { method: "PUT", body }),
    deletePost:     (id) => req(`/blog/${encodeURIComponent(id)}`, { method: "DELETE" }),
    listings:       () => req("/listings"),
    submitListing:  (body) => req("/listings", { method: "POST", body }),
    approveListing: (id) => req(`/listings/${id}/approve`, { method: "POST" }),
    rejectListing:  (id) => req(`/listings/${id}/reject`, { method: "POST" }),
    deleteListing:  (id) => req(`/listings/${id}`, { method: "DELETE" }),
    uploadPhoto:    (formData) => req("/photos/upload", { method: "POST", body: formData }),
    login:          (body) => req("/login", { method: "POST", body }),
    logout:         () => req("/logout", { method: "POST" }),
    me:             () => req("/me"),
  };

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v !== null && v !== undefined) n.setAttribute(k, v);
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return n;
  }

  function fmtDate(s) {
    if (!s) return "";
    try {
      const d = new Date(s);
      const loc = (window.HA && HA.i18n && HA.i18n.locale) ? HA.i18n.locale() : undefined;
      return d.toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return s; }
  }

  function t(key, fallback) {
    if (window.HA && HA.i18n && typeof HA.i18n.t === "function") return HA.i18n.t(key, fallback);
    return fallback != null ? fallback : key;
  }

  function badgeLabel(b) {
    const map = { donated: "badge.donated", adopter: "badge.adopter", volunteer: "badge.volunteer" };
    return t(map[b] || ("badge." + b), b);
  }

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // very small, safe-ish markdown for blog bodies (headings, p, strong, em, links, images, lists, blockquote, hr, code)
  function mdToHtml(md) {
    if (!md) return "";
    let s = String(md);
    // code blocks ```...```
    s = s.replace(/```([\s\S]*?)```/g, (_, c) => "<pre><code>" + esc(c.trim()) + "</code></pre>");
    // escape remaining HTML
    s = esc(s);
    // restore the code blocks we just escaped inside
    s = s.replace(/&lt;pre&gt;&lt;code&gt;([\s\S]*?)&lt;\/code&gt;&lt;\/pre&gt;/g, (_, c) => "<pre><code>" + c + "</code></pre>");
    // images: ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2" loading="lazy">');
    // links: [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // headings
    s = s.replace(/^### (.*)$/gm, "<h3>$1</h3>")
         .replace(/^## (.*)$/gm, "<h2>$1</h2>")
         .replace(/^# (.*)$/gm, "<h2>$1</h2>");
    // hr
    s = s.replace(/^---+$/gm, "<hr>");
    // blockquote
    s = s.replace(/^&gt; (.*)$/gm, "<blockquote>$1</blockquote>");
    // bold / italic / code
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
         .replace(/\*([^*]+)\*/g, "<em>$1</em>")
         .replace(/`([^`]+)`/g, "<code>$1</code>");
    // lists (simple)
    s = s.replace(/(?:^|\n)[-*] (.+)/g, (m, line) => "\n<li>" + line + "</li>");
    s = s.replace(/(<li>[\s\S]*?<\/li>)/g, m => "<ul>" + m.replace(/\n/g, "") + "</ul>");
    // paragraphs: blank lines separate
    s = s.split(/\n{2,}/).map(block => {
      if (/^\s*<(h\d|ul|ol|pre|blockquote|hr|img)/.test(block)) return block;
      return "<p>" + block.trim().replace(/\n/g, "<br>") + "</p>";
    }).join("\n");
    return s;
  }

  // an inline SVG placeholder so pages look professional without real images yet
  function placeholderSVG(seed, label) {
    const palettes = [
      ["#F4ECE0", "#C9A6A0"],
      ["#F4ECE0", "#8BA888"],
      ["#F4ECE0", "#C8A951"],
      ["#F3E3E1", "#A9807A"],
      ["#E5EFE3", "#6E8C6B"],
      ["#FBEFD6", "#A88B34"],
    ];
    const p = palettes[(seed || 0) % palettes.length];
    const lbl = label ? label : "";
    const svg =
      '<svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="320" fill="' + p[0] + '"/>' +
      '<circle cx="200" cy="135" r="58" fill="' + p[1] + '" opacity="0.35"/>' +
      '<path d="M120 240 Q200 170 280 240 L280 320 L120 320 Z" fill="' + p[1] + '" opacity="0.35"/>' +
      '<text x="200" y="300" font-family="Georgia, serif" font-size="15" fill="#5E5A55" text-anchor="middle" opacity="0.7">' + esc(lbl) + '</text>' +
      '</svg>';
    return svg;
  }

  function imgOrPlaceholder(src, seed, label, cls) {
    if (!src) return '<div class="' + (cls ? cls : "card-photo placeholder") + '">' + placeholderSVG(seed, label) + '</div>';
    if (src.endsWith(".svg")) return '<div class="' + (cls ? cls : "card-photo placeholder") + '">' + placeholderSVG(seed, label) + '</div>';
    return '<div class="' + (cls ? cls : "card-photo") + '"><img src="' + esc(src) + '" alt="' + esc(label || "") + '" loading="lazy"></div>';
  }

  function setNavActive(id) {
    document.querySelectorAll(".nav a").forEach(a => { if (a.dataset.nav === id) a.classList.add("active"); });
  }

  function init() {
    // mobile nav toggle
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));
    // footer year
    document.querySelectorAll("[data-year]").forEach(n => { n.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", init);

  window.HA = Object.assign(window.HA || {}, {
    api, el, fmtDate, esc, mdToHtml, placeholderSVG, imgOrPlaceholder, setNavActive, API_BASE, t, badgeLabel
  });
})();