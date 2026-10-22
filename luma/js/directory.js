// Directory: search, filters and sorting. Filters are kept in the URL so a filtered list can be shared.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var L = window.Luma, $ = L.$, $all = L.$all, icon = L.icon, esc = L.esc;
  var RES = L.RES, CATS = L.CATS, CAT = L.CAT;
  var AUD = ["families", "youth", "adults", "seniors", "students", "jobseekers", "uninsured", "disability", "survivors"];

  var p = new URLSearchParams(location.search);
  var state = {
    q: p.get("q") || "",
    cat: (p.get("cat") || "").split(",").filter(Boolean),
    aud: (p.get("aud") || "").split(",").filter(Boolean),
    open: p.get("open") === "1", walkin: p.get("walkin") === "1", spanish: p.get("spanish") === "1",
    sort: p.get("sort") || "az", me: null
  };

  function count(fn) { return RES.filter(fn).length; }
  $("[data-f-cat]").innerHTML = CATS.map(function (c) {
    return '<label class="opt"><input type="checkbox" name="cat" value="' + c.id + '">' + esc(c.name) +
      '<span class="n">' + count(function (r) { return L.inCat(r, c.id); }) + "</span></label>";
  }).join("");
  $("[data-f-aud]").innerHTML = AUD.map(function (a) {
    return '<label class="opt"><input type="checkbox" name="aud" value="' + a + '">' + esc(window.LUMA_AUDIENCES[a]) + "</label>";
  }).join("");

  var form = $("[data-filter-form]"), qInput = $("#dir-q"), sortSel = $("[data-sort]");

  function syncControls() {
    qInput.value = state.q;
    ["cat", "aud"].forEach(function (k) {
      $all("input[name=" + k + "]", form).forEach(function (i) { i.checked = state[k].indexOf(i.value) > -1; });
    });
    ["open", "walkin", "spanish"].forEach(function (k) { $("input[name=" + k + "]", form).checked = state[k]; });
    sortSel.value = state.sort === "near" && !state.me ? "az" : state.sort;
    // show how many are picked on each dropdown
    var counts = { cat: state.cat.length, aud: state.aud.length, more: [state.open, state.walkin, state.spanish].filter(Boolean).length };
    $all("[data-dd]").forEach(function (dd) {
      var n = counts[dd.getAttribute("data-dd")], s = dd.querySelector("summary"), b = s.querySelector(".dd__n");
      dd.classList.toggle("has-value", n > 0);
      if (n && !b) { b = document.createElement("span"); b.className = "dd__n"; s.insertBefore(b, s.lastChild); }
      if (b) { if (n) b.textContent = n; else b.remove(); }
    });
  }

  // only one dropdown open at a time, and close them when clicking elsewhere
  $all("[data-dd]").forEach(function (dd) {
    dd.addEventListener("toggle", function () {
      if (dd.open) $all("[data-dd]").forEach(function (o) { if (o !== dd) o.open = false; });
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-dd]")) $all("[data-dd]").forEach(function (o) { o.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = $("[data-dd][open]");
    if (open) { open.open = false; open.querySelector("summary").focus(); }
  });

  function matches(r) {
    if (state.cat.length && !state.cat.some(function (c) { return L.inCat(r, c); })) return false;
    if (state.aud.length && r.aud.indexOf("all") === -1 && !state.aud.some(function (a) { return r.aud.indexOf(a) > -1; })) return false;
    if (state.open) { var s = L.openStatus(r.oh); if (!s || !s.open) return false; }
    if (state.walkin && !r.lat) return false;
    if (state.spanish && r.lang.indexOf("Spanish") === -1) return false;
    if (state.q) {
      var hay = [r.name, r.blurb, r.desc, r.address, r.city, CAT[r.cat].name, (r.also || []).map(function (a) { return CAT[a].name; }).join(" ")].join(" ").toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }
  function dist(r) { return r.lat ? L.milesBetween(state.me[0], state.me[1], r.lat, r.lng) : 9999; }
  function sorter(a, b) {
    if (state.sort === "near" && state.me) return dist(a) - dist(b);
    if (state.sort === "open") {
      var rank = function (r) { var s = L.openStatus(r.oh); return s && s.open ? 0 : s ? 1 : 2; };
      if (rank(a) !== rank(b)) return rank(a) - rank(b);
    }
    if (state.sort === "cat" && a.cat !== b.cat) return CATS.indexOf(CAT[a.cat]) - CATS.indexOf(CAT[b.cat]);
    return a.name.localeCompare(b.name);
  }

  var resultsEl = $("[data-results]");
  function render() {
    syncControls();
    var list = RES.filter(matches).sort(sorter);
    $("[data-count]").innerHTML = "<strong>" + list.length + "</strong> of " + RES.length + " listings";
    resultsEl.innerHTML = list.length ? list.map(function (r) {
      return L.resourceCard(r, { distance: state.sort === "near" && state.me && r.lat ? dist(r) : null });
    }).join("") : '<div class="empty" style="grid-column:1/-1"><h3>No listings match</h3><p>Try a different search or clear some filters. If you need help right now, call or text <a href="tel:988">988</a>.</p><button type="button" class="btn btn--ghost btn--sm" data-clear-all>Clear filters</button></div>';

    var pills = [];
    if (state.q) pills.push(["q", "", '"' + state.q + '"']);
    state.cat.forEach(function (c) { pills.push(["cat", c, CAT[c].name]); });
    state.aud.forEach(function (a) { pills.push(["aud", a, window.LUMA_AUDIENCES[a]]); });
    if (state.open) pills.push(["open", "", "Open now"]);
    if (state.walkin) pills.push(["walkin", "", "Walk-in location"]);
    if (state.spanish) pills.push(["spanish", "", "Spanish"]);
    $("[data-active]").innerHTML = pills.map(function (pl) {
      return '<button type="button" class="pill-x" data-remove="' + pl[0] + '" data-val="' + esc(pl[1]) + '" aria-label="Remove ' + esc(pl[2]) + '">' + esc(pl[2]) + icon("x") + "</button>";
    }).join("") + (pills.length > 1 ? '<button type="button" class="link-btn small" data-clear-all>Clear all</button>' : "");

    var q = new URLSearchParams();
    if (state.q) q.set("q", state.q);
    ["cat", "aud"].forEach(function (k) { if (state[k].length) q.set(k, state[k].join(",")); });
    ["open", "walkin", "spanish"].forEach(function (k) { if (state[k]) q.set(k, "1"); });
    if (state.sort !== "az") q.set("sort", state.sort);
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  var t;
  qInput.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = qInput.value.trim(); render(); }, 150);
  });
  form.addEventListener("change", function (e) {
    var i = e.target;
    if (i.name === "cat" || i.name === "aud") state[i.name] = $all("input[name=" + i.name + "]:checked", form).map(function (x) { return x.value; });
    else if (i.name === "open" || i.name === "walkin" || i.name === "spanish") state[i.name] = i.checked;
    else return;
    L.track("filter_apply", { filter: i.name, value: i.value });
    render();
  });
  document.addEventListener("click", function (e) {
    var rm = e.target.closest("[data-remove]");
    if (rm) {
      var k = rm.getAttribute("data-remove"), v = rm.getAttribute("data-val");
      if (k === "q") state.q = "";
      else if (Array.isArray(state[k])) state[k] = state[k].filter(function (x) { return x !== v; });
      else state[k] = false;
      render(); return;
    }
    if (e.target.closest("[data-clear-all]")) {
      Object.assign(state, { q: "", cat: [], aud: [], open: false, walkin: false, spanish: false });
      render();
    }
  });
  sortSel.addEventListener("change", function () {
    if (sortSel.value === "near" && !state.me) {
      if (!navigator.geolocation) { L.toast("Location isn't available in this browser", "info"); sortSel.value = state.sort; return; }
      navigator.geolocation.getCurrentPosition(function (pos) {
        state.me = [pos.coords.latitude, pos.coords.longitude]; state.sort = "near"; render();
      }, function () { L.toast("Couldn't get your location", "info"); sortSel.value = state.sort; });
      return;
    }
    state.sort = sortSel.value; render();
  });

  render();
});
