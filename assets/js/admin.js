/* Healing Angels — owner dashboard runtime
   - login / logout / session check
   - insight CRUD (single record, PUT replaces)
   - blog post CRUD
   - member moderation (approve/reject/delete)
   - listing moderation (approve/reject/delete)
   - photo upload to R2 + gallery
   All API calls go through HA.api (see app.js).
*/

(function () {
  "use strict";
  const { api, el, esc, fmtDate, mdToHtml, imgOrPlaceholder } = HA;

  function msg(id, kind, text) {
    const n = document.getElementById(id);
    n.className = "form-msg " + kind;
    n.textContent = text;
  }

  // ---------- Auth ----------
  const loginView = document.getElementById("login-view");
  const dash = document.getElementById("dash");

  async function checkSession() {
    try {
      const me = await api.me();
      if (me && me.username) showDashboard();
      else showLogin();
    } catch (e) { showLogin(); }
  }

  function showLogin() { loginView.classList.remove("hidden"); dash.classList.add("hidden"); }
  function showDashboard() { loginView.classList.add("hidden"); dash.classList.remove("hidden"); loadAll(); }

  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Signing in…";
    try {
      const res = await api.login({ username: f.username.value, password: f.password.value });
      if (res && res.username) { showDashboard(); msg("login-msg", "ok", "Welcome back."); }
      else { msg("login-msg", "err", "Wrong username or password."); }
    } catch (err) {
      msg("login-msg", "err", "Sign in failed: " + err.message);
    } finally { btn.disabled = false; btn.textContent = "Sign in"; f.password.value = ""; }
  });

  document.getElementById("logout-btn").addEventListener("click", async () => {
    try { await api.logout(); } catch (e) {}
    showLogin();
  });

  // ---------- Tabs ----------
  const tabs = document.querySelectorAll("#admin-nav a");
  const panes = document.querySelectorAll(".admin-tab");
  tabs.forEach(a => a.addEventListener("click", (e) => {
    e.preventDefault();
    tabs.forEach(x => x.classList.remove("active"));
    a.classList.add("active");
    panes.forEach(p => p.classList.remove("active"));
    document.getElementById("tab-" + a.dataset.tab).classList.add("active");
  }));

  // ---------- Insight ----------
  const insightForm = document.getElementById("insight-form");
  insightForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Publishing…";
    try {
      await api.setInsight({ excerpt: f.excerpt.value, prayer: f.prayer.value });
      msg("insight-msg", "ok", "Today's insight is live.");
      loadInsight();
    } catch (err) { msg("insight-msg", "err", "Failed: " + err.message); }
    finally { btn.disabled = false; btn.textContent = "Publish today's insight"; }
  });

  async function loadInsight() {
    const cur = document.getElementById("insight-current");
    try {
      const i = await api.insight();
      cur.innerHTML = `
        <div class="insight-excerpt">${esc(i.excerpt || "No insight has been published yet.")}</div>
        <div class="insight-prayer"><b>A short prayer</b><p>${esc(i.prayer || "—")}</p></div>
        <div class="insight-date">${i.set_at ? fmtDate(i.set_at) : ""}</div>`;
      insightForm.excerpt.value = i.excerpt || "";
      insightForm.prayer.value = i.prayer || "";
    } catch (e) {
      cur.innerHTML = '<p class="muted">Could not load the current insight.</p>';
    }
  }

  // ---------- Blog ----------
  const postForm = document.getElementById("post-form");
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const btn = document.getElementById("post-save");
    btn.disabled = true; btn.textContent = "Saving…";
    const body = {
      title: f.title.value,
      cover_url: f.cover_url.value,
      published_at: f.date.value || new Date().toISOString().slice(0, 10),
      body_md: f.body_md.value,
    };
    try {
      if (f.id.value) { await api.updatePost(f.id.value, body); msg("post-msg", "ok", "Post updated."); }
      else { await api.savePost(body); msg("post-msg", "ok", "Post published."); }
      postForm.reset(); document.getElementById("p-date").value = new Date().toISOString().slice(0, 10);
      loadPosts();
    } catch (err) { msg("post-msg", "err", "Failed: " + err.message); }
    finally { btn.disabled = false; btn.textContent = "Save post"; }
  });

  document.getElementById("post-clear").addEventListener("click", () => {
    postForm.reset(); document.getElementById("p-id").value = ""; document.getElementById("p-date").value = new Date().toISOString().slice(0, 10);
  });

  async function loadPosts() {
    const tb = document.querySelector("#posts-table tbody");
    try {
      const data = await api.blog();
      const posts = data.posts || [];
      if (posts.length === 0) { tb.innerHTML = '<tr><td colspan="3" class="muted">No posts yet.</td></tr>'; return; }
      tb.innerHTML = posts.map(p => `<tr>
        <td>${esc(fmtDate(p.published_at))}</td>
        <td>${esc(p.title)}</td>
        <td>
          <button class="mini-btn" data-edit="${esc(p.id)}">Edit</button>
          <button class="mini-btn danger" data-del="${esc(p.id)}">Delete</button>
        </td></tr>`).join("");
      tb.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editPost(b.dataset.edit)));
      tb.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => delPost(b.dataset.del)));
    } catch (e) { tb.innerHTML = `<tr><td colspan="3" class="muted">Failed to load posts.</td></tr>`; }
  }

  async function editPost(id) {
    try {
      const p = await api.post(id);
      document.getElementById("p-id").value = p.id;
      document.getElementById("p-title").value = p.title || "";
      document.getElementById("p-cover").value = p.cover_url || "";
      document.getElementById("p-date").value = (p.published_at || "").slice(0, 10);
      document.getElementById("p-body").value = p.body_md || "";
      document.getElementById("tab-blog").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) { alert("Could not load the post: " + e.message); }
  }

  async function delPost(id) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try { await api.deletePost(id); loadPosts(); } catch (e) { alert("Failed: " + e.message); }
  }

  // ---------- Members ----------
  async function loadMembers() {
    const pen = document.querySelector("#pending-table tbody");
    const app = document.querySelector("#members-table tbody");
    try {
      // pending — only admins can see; if endpoint 403s (not logged in) it'll surface below
      let pending = [];
      try { pending = (await api.pendingMembers()).members || []; }
      catch (e) { pending = []; }
      if (pending.length === 0) { pen.innerHTML = '<tr><td colspan="5" class="muted">No pending submissions.</td></tr>'; }
      else {
        pen.innerHTML = pending.map(m => `<tr>
          <td><b>${esc(m.name)}</b>${m.location ? "<br><span class='faint'>" + esc(m.location) + "</span>" : ""}</td>
          <td>${esc(m.pet_name || "")}<br><span class="faint">${esc(m.pet_species || "")} ${esc(m.pet_breed || "")}</span></td>
          <td style="max-width: 360px;">${esc((m.story || "").slice(0, 220))}${(m.story || "").length > 220 ? "…" : ""}</td>
          <td>${esc(fmtDate(m.created_at))}</td>
          <td>
            <button class="mini-btn ok" data-appr="${esc(m.id)}">Approve</button>
            <button class="mini-btn danger" data-rej="${esc(m.id)}">Reject</button>
          </td></tr>`).join("");
        pen.querySelectorAll("[data-appr]").forEach(b => b.addEventListener("click", () => moderate(b.dataset.appr, "approve", loadMembers)));
        pen.querySelectorAll("[data-rej]").forEach(b => b.addEventListener("click", () => moderate(b.dataset.rej, "reject", loadMembers)));
      }
    } catch (e) { pen.innerHTML = '<tr><td colspan="5" class="muted">Could not load pending members.</td></tr>'; }

    try {
      const approved = (await api.members()).members || [];
      if (approved.length === 0) { app.innerHTML = '<tr><td colspan="5" class="muted">No approved members yet.</td></tr>'; return; }
      app.innerHTML = approved.map(m => `<tr>
        <td><b>${esc(m.name)}</b></td>
        <td>${esc(m.pet_name || "")} <span class="faint">(${esc(m.pet_species || "")})</span></td>
        <td>${esc(m.location || "")}</td>
        <td>${(m.badges || []).map(b => `<span class="badge ${esc(b)}">${esc(b)}</span>`).join(" ") || "<span class='faint'>—</span>"}</td>
        <td><button class="mini-btn danger" data-del="${esc(m.id)}">Delete</button></td>
      </tr>`).join("");
      app.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => moderate(b.dataset.del, "delete", loadMembers)));
    } catch (e) { app.innerHTML = '<tr><td colspan="5" class="muted">Could not load approved members.</td></tr>'; }
  }

  async function moderate(id, action, reload) {
    const labels = { approve: "Approve this member?", reject: "Reject this member?", delete: "Delete this member permanently?" };
    if (action !== "approve" && !confirm(labels[action] || "Are you sure?")) return;
    try {
      if (action === "approve") await api.approveMember(id);
      else if (action === "reject") await api.rejectMember(id);
      else if (action === "delete") await api.deleteMember(id);
      reload();
    } catch (e) { alert("Failed: " + e.message); }
  }

  // ---------- Listings ----------
  async function loadListings() {
    const pen = document.querySelector("#list-pending-table tbody");
    const pub = document.querySelector("#list-published-table tbody");
    try {
      const data = await api.listings();
      const all = data.listings || [];
      const pending = all.filter(l => l.status === "pending");
      const published = all.filter(l => l.status === "approved");
      if (pending.length === 0) pen.innerHTML = '<tr><td colspan="5" class="muted">Nothing pending.</td></tr>';
      else {
        pen.innerHTML = pending.map(l => `<tr>
          <td><span class="status-pill pending">${esc(l.type)}</span></td>
          <td><b>${esc(l.title)}</b></td>
          <td style="max-width: 320px;">${esc((l.body || "").slice(0, 220))}${(l.body || "").length > 220 ? "…" : ""}</td>
          <td>${esc(l.contact || "")}</td>
          <td>
            <button class="mini-btn ok" data-appr="${esc(l.id)}">Approve</button>
            <button class="mini-btn danger" data-rej="${esc(l.id)}">Reject</button>
          </td></tr>`).join("");
        pen.querySelectorAll("[data-appr]").forEach(b => b.addEventListener("click", () => moderateListing(b.dataset.appr, "approve")));
        pen.querySelectorAll("[data-rej]").forEach(b => b.addEventListener("click", () => moderateListing(b.dataset.rej, "reject")));
      }
      if (published.length === 0) pub.innerHTML = '<tr><td colspan="4" class="muted">No published listings yet.</td></tr>';
      else {
        pub.innerHTML = published.map(l => `<tr>
          <td><span class="status-pill approved">${esc(l.type)}</span></td>
          <td><b>${esc(l.title)}</b></td>
          <td>${esc(l.contact || "")}</td>
          <td><button class="mini-btn danger" data-del="${esc(l.id)}">Delete</button></td>
        </tr>`).join("");
        pub.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", () => moderateListing(b.dataset.del, "delete")));
      }
    } catch (e) {
      pen.innerHTML = '<tr><td colspan="5" class="muted">Could not load listings.</td></tr>';
      pub.innerHTML = '<tr><td colspan="4" class="muted">Could not load listings.</td></tr>';
    }
  }

  async function moderateListing(id, action) {
    if (action !== "approve" && !confirm("Are you sure?")) return;
    try {
      if (action === "approve") await api.approveListing(id);
      else if (action === "reject") await api.rejectListing(id);
      else if (action === "delete") await api.deleteListing(id);
      loadListings();
    } catch (e) { alert("Failed: " + e.message); }
  }

  // ---------- Photos ----------
  const photoForm = document.getElementById("photo-form");
  photoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const btn = f.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Uploading…";
    const fd = new FormData();
    fd.append("file", f.file.files[0]);
    fd.append("alt", f.alt.value);
    try {
      const res = await api.uploadPhoto(fd);
      msg("photo-msg", "ok", "Uploaded. URL: " + res.url);
      f.reset(); loadPhotos();
    } catch (err) { msg("photo-msg", "err", "Upload failed: " + err.message); }
    finally { btn.disabled = false; btn.textContent = "Upload"; }
  });

  async function loadPhotos() {
    const g = document.getElementById("photo-gallery");
    try {
      const res = await fetch(HA.API_BASE.replace("/api", "") + "/api/photos").then(r => r.json());
      const list = (res && res.photos) ? res.photos : [];
      if (list.length === 0) { g.innerHTML = '<p class="empty">No uploads yet. Use the form above.</p>'; return; }
      g.innerHTML = list.map((p, idx) => `
        <article class="card">
          ${imgOrPlaceholder(p.url, idx, p.alt || "")}
          <div class="card-body">
            <input value="${esc(p.url)}" readonly style="font-size:.78rem; padding: .4em .6em; border:1px solid var(--line); border-radius: 8px; width: 100%;">
            <span class="faint" style="font-size:.78rem;">${esc(p.alt || "")}</span>
          </div>
        </article>`).join("");
    } catch (e) { g.innerHTML = '<p class="empty">Photos will appear here after upload.</p>'; }
  }

  // ---------- Load all tabs ----------
  function loadAll() {
    loadInsight(); loadPosts(); loadMembers(); loadListings(); loadPhotos();
  }

  // boot
  document.getElementById("p-date").value = new Date().toISOString().slice(0, 10);
  checkSession();
})();