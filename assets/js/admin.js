/* Healing Angels — owner dashboard (JSON only, no login)
   Email & phone are never shown here. Open the exported JSON files to see them.
*/

(function () {
  "use strict";
  var api = HA.api;
  var esc = HA.esc;
  var fmtDate = HA.fmtDate;

  function msg(id, kind, text) {
    var n = document.getElementById(id);
    if (!n) return;
    n.className = "form-msg " + kind;
    n.textContent = text;
  }

  function clip(s, n) {
    s = s || "";
    return s.length > n ? s.slice(0, n) + "…" : s;
  }

  // ---------- Tabs ----------
  var tabs = document.querySelectorAll("#admin-nav a");
  var panes = document.querySelectorAll(".admin-tab");
  tabs.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      tabs.forEach(function (x) {
        x.classList.remove("active");
      });
      a.classList.add("active");
      panes.forEach(function (p) {
        p.classList.remove("active");
      });
      document.getElementById("tab-" + a.dataset.tab).classList.add("active");
    });
  });

  // ---------- Export / reset ----------
  var exportBtn = document.getElementById("export-json");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      api.exportAll();
      msg(
        "export-msg",
        "ok",
        "Downloading insight.json, members.json, blog.json, listings.json — put them in the data/ folder and re-upload the site."
      );
    });
  }

  var resetBtn = document.getElementById("reset-local");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (
        !confirm(
          "Clear local edits and reload from the data/*.json files on the site?"
        )
      )
        return;
      api.resetToFiles();
      location.reload();
    });
  }

  // ---------- Insight ----------
  var insightForm = document.getElementById("insight-form");
  insightForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    var btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Saving…";
    try {
      await api.setInsight({
        excerpt: f.excerpt.value,
        prayer: f.prayer.value,
      });
      msg("insight-msg", "ok", "Insight saved. Export JSON when you want it on the live site.");
      loadInsight();
    } catch (err) {
      msg("insight-msg", "err", "Failed: " + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Save insight";
    }
  });

  async function loadInsight() {
    var cur = document.getElementById("insight-current");
    try {
      var i = await api.insight();
      cur.innerHTML =
        '<div class="insight-excerpt">' +
        esc(i.excerpt || "No insight yet.") +
        "</div>" +
        '<div class="insight-prayer"><b>A short prayer</b><p>' +
        esc(i.prayer || "—") +
        "</p></div>" +
        '<div class="insight-date">' +
        (i.set_at ? fmtDate(i.set_at) : "") +
        "</div>";
      insightForm.excerpt.value = i.excerpt || "";
      insightForm.prayer.value = i.prayer || "";
    } catch (e) {
      cur.innerHTML = '<p class="muted">Could not load insight.</p>';
    }
  }

  // ---------- Blog ----------
  var postForm = document.getElementById("post-form");
  postForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var f = e.currentTarget;
    var btn = f.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Saving…";
    try {
      await api.savePost({
        id: f.id.value || undefined,
        title: f.title.value,
        cover_url: f.cover_url.value,
        published_at: f.published_at.value,
        body_md: f.body_md.value,
      });
      msg("post-msg", "ok", "Post saved.");
      f.reset();
      document.getElementById("p-id").value = "";
      document.getElementById("p-date").value = new Date()
        .toISOString()
        .slice(0, 10);
      loadPosts();
    } catch (err) {
      msg("post-msg", "err", "Failed: " + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Save post";
    }
  });

  document.getElementById("post-clear").addEventListener("click", function () {
    postForm.reset();
    document.getElementById("p-id").value = "";
    document.getElementById("p-date").value = new Date()
      .toISOString()
      .slice(0, 10);
    msg("post-msg", "", "");
  });

  async function loadPosts() {
    var tb = document.querySelector("#posts-table tbody");
    try {
      var data = await api.blog();
      var posts = data.posts || [];
      if (!posts.length) {
        tb.innerHTML =
          '<tr><td colspan="3" class="muted">No posts yet.</td></tr>';
        return;
      }
      tb.innerHTML = posts
        .map(function (p) {
          return (
            "<tr><td>" +
            esc(p.published_at || "") +
            "</td><td>" +
            esc(p.title) +
            '</td><td class="actions-cell">' +
            '<button type="button" class="btn-ghost" data-edit="' +
            esc(p.id) +
            '">Edit</button> ' +
            '<button type="button" class="btn-ghost" data-del="' +
            esc(p.id) +
            '">Delete</button></td></tr>'
          );
        })
        .join("");
      tb.querySelectorAll("[data-edit]").forEach(function (b) {
        b.addEventListener("click", function () {
          editPost(b.getAttribute("data-edit"));
        });
      });
      tb.querySelectorAll("[data-del]").forEach(function (b) {
        b.addEventListener("click", async function () {
          if (!confirm("Delete this post?")) return;
          await api.deletePost(b.getAttribute("data-del"));
          loadPosts();
        });
      });
    } catch (e) {
      tb.innerHTML =
        '<tr><td colspan="3" class="muted">Could not load posts.</td></tr>';
    }
  }

  async function editPost(id) {
    var p = await api.post(id);
    if (!p) return;
    document.getElementById("p-id").value = p.id;
    document.getElementById("p-title").value = p.title || "";
    document.getElementById("p-cover").value = p.cover_url || "";
    document.getElementById("p-date").value = p.published_at || "";
    document.getElementById("p-body").value = p.body_md || "";
    document
      .querySelector('#admin-nav a[data-tab="blog"]')
      .click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- Members (no email/phone in UI) ----------
  async function loadMembers() {
    var pendingTb = document.querySelector("#pending-table tbody");
    var approvedTb = document.querySelector("#members-table tbody");
    try {
      var data = await api.members({ all: true });
      var all = data.members || [];
      var pending = all.filter(function (m) {
        return m.status === "pending";
      });
      var approved = all.filter(function (m) {
        return m.status === "approved";
      });

      pendingTb.innerHTML = pending.length
        ? pending
            .map(function (m) {
              return (
                "<tr><td>" +
                esc(m.name) +
                "</td><td>" +
                esc(m.pet_name || "") +
                (m.pet_species ? " · " + esc(m.pet_species) : "") +
                "</td><td>" +
                esc(clip(m.story, 80)) +
                "</td><td>" +
                esc(m.submitted_at || "") +
                '</td><td class="actions-cell">' +
                '<button type="button" class="btn-ghost" data-approve="' +
                esc(m.id) +
                '">Approve</button> ' +
                '<button type="button" class="btn-ghost" data-reject="' +
                esc(m.id) +
                '">Reject</button></td></tr>'
              );
            })
            .join("")
        : '<tr><td colspan="5" class="muted">No pending stories.</td></tr>';

      approvedTb.innerHTML = approved.length
        ? approved
            .map(function (m) {
              return (
                "<tr><td>" +
                esc(m.name) +
                "</td><td>" +
                esc(m.pet_name || "") +
                "</td><td>" +
                esc(m.location || "") +
                "</td><td>" +
                esc((m.badges || []).join(", ")) +
                '</td><td class="actions-cell">' +
                '<button type="button" class="btn-ghost" data-del-m="' +
                esc(m.id) +
                '">Remove</button></td></tr>'
              );
            })
            .join("")
        : '<tr><td colspan="5" class="muted">No approved members yet.</td></tr>';

      pendingTb.querySelectorAll("[data-approve]").forEach(function (b) {
        b.addEventListener("click", async function () {
          await api.setMemberStatus(b.getAttribute("data-approve"), "approved");
          loadMembers();
        });
      });
      pendingTb.querySelectorAll("[data-reject]").forEach(function (b) {
        b.addEventListener("click", async function () {
          if (!confirm("Reject and remove this submission?")) return;
          await api.setMemberStatus(b.getAttribute("data-reject"), "rejected");
          loadMembers();
        });
      });
      approvedTb.querySelectorAll("[data-del-m]").forEach(function (b) {
        b.addEventListener("click", async function () {
          if (!confirm("Remove this member from the site?")) return;
          await api.deleteMember(b.getAttribute("data-del-m"));
          loadMembers();
        });
      });
    } catch (e) {
      pendingTb.innerHTML =
        '<tr><td colspan="5" class="muted">Could not load members.</td></tr>';
      approvedTb.innerHTML =
        '<tr><td colspan="5" class="muted">Could not load members.</td></tr>';
    }
  }

  // ---------- Listings (no email/phone in UI) ----------
  async function loadListings() {
    var pend = document.querySelector("#list-pending-table tbody");
    var pub = document.querySelector("#list-published-table tbody");
    try {
      var data = await api.listings({ all: true });
      var all = data.listings || [];
      var pending = all.filter(function (l) {
        return l.status === "pending";
      });
      var published = all.filter(function (l) {
        return l.status === "approved";
      });

      pend.innerHTML = pending.length
        ? pending
            .map(function (l) {
              return (
                "<tr><td>" +
                esc(l.type) +
                "</td><td>" +
                esc(l.title) +
                "</td><td>" +
                esc(clip(l.body, 80)) +
                '</td><td class="actions-cell">' +
                '<button type="button" class="btn-ghost" data-la="' +
                esc(l.id) +
                '">Approve</button> ' +
                '<button type="button" class="btn-ghost" data-lr="' +
                esc(l.id) +
                '">Reject</button></td></tr>'
              );
            })
            .join("")
        : '<tr><td colspan="4" class="muted">Nothing pending.</td></tr>';

      pub.innerHTML = published.length
        ? published
            .map(function (l) {
              return (
                "<tr><td>" +
                esc(l.type) +
                "</td><td>" +
                esc(l.title) +
                "</td><td>" +
                esc(l.pet_species || "") +
                '</td><td class="actions-cell">' +
                '<button type="button" class="btn-ghost" data-ld="' +
                esc(l.id) +
                '">Remove</button></td></tr>'
              );
            })
            .join("")
        : '<tr><td colspan="4" class="muted">No published listings.</td></tr>';

      pend.querySelectorAll("[data-la]").forEach(function (b) {
        b.addEventListener("click", async function () {
          await api.setListingStatus(b.getAttribute("data-la"), "approved");
          loadListings();
        });
      });
      pend.querySelectorAll("[data-lr]").forEach(function (b) {
        b.addEventListener("click", async function () {
          if (!confirm("Reject and remove?")) return;
          await api.setListingStatus(b.getAttribute("data-lr"), "rejected");
          loadListings();
        });
      });
      pub.querySelectorAll("[data-ld]").forEach(function (b) {
        b.addEventListener("click", async function () {
          if (!confirm("Remove this listing?")) return;
          await api.deleteListing(b.getAttribute("data-ld"));
          loadListings();
        });
      });
    } catch (e) {
      pend.innerHTML =
        '<tr><td colspan="4" class="muted">Could not load listings.</td></tr>';
      pub.innerHTML =
        '<tr><td colspan="4" class="muted">Could not load listings.</td></tr>';
    }
  }

  function loadAll() {
    loadInsight();
    loadPosts();
    loadMembers();
    loadListings();
    var d = document.getElementById("p-date");
    if (d && !d.value) d.value = new Date().toISOString().slice(0, 10);
  }

  loadAll();
})();
