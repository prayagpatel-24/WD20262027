// Directory: search, filters and sorting. Filters are kept in the URL so a filtered list can be shared.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, icon = site.icon, esc = site.esc;
  var resources = site.resources, categories = site.categories, catById = site.catById;
  var AUD = ["families", "youth", "adults", "seniors", "students", "jobseekers", "uninsured", "disability", "survivors"];

  var p = new URLSearchParams(location.search);
  var state = {
    q: p.get("q") || "",
    cat: (p.get("cat") || "").split(",").filter(Boolean),
    aud: (p.get("aud") || "").split(",").filter(Boolean),
    open: p.get("open") === "1", walkin: p.get("walkin") === "1", spanish: p.get("spanish") === "1",
    near: p.get("near") === "1" || p.get("sort") === "near", me: null
  };

  function count(fn) { return resources.filter(fn).length; }
  $("[data-f-cat]").innerHTML = categories.map(function (c) {
    return '<label class="opt"><input type="checkbox" name="cat" value="' + c.id + '">' + site.catName(c) +
      '<span class="n">' + count(function (r) { return site.inCat(r, c.id); }) + "</span></label>";
  }).join("");
  $("[data-f-aud]").innerHTML = AUD.map(function (a) {
    return '<label class="opt"><input type="checkbox" name="aud" value="' + a + '">' + esc(window.LUMA_AUDIENCES[a]) + "</label>";
  }).join("");

  var form = $("[data-filter-form]"), qInput = $("#dir-q");

  function syncControls() {
    qInput.value = state.q;
    ["cat", "aud"].forEach(function (k) {
      $all("input[name=" + k + "]", form).forEach(function (i) { i.checked = state[k].indexOf(i.value) > -1; });
    });
    ["open", "walkin", "spanish"].forEach(function (k) { $("input[name=" + k + "]", form).checked = state[k]; });
    $("input[name=near]", form).checked = !!state.me;
    var sort = state.me ? "near" : "az";
    $all("[data-sort]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sort") === sort)); });
  }

  function matches(r) {
    if (state.cat.length && !state.cat.some(function (c) { return site.inCat(r, c); })) return false;
    if (state.aud.length && r.aud.indexOf("all") === -1 && !state.aud.some(function (a) { return r.aud.indexOf(a) > -1; })) return false;
    if (state.open) { var s = site.openStatus(r.oh); if (!s || !s.open) return false; }
    if (state.walkin && !r.lat) return false;
    if (state.spanish && r.lang.indexOf("Spanish") === -1) return false;
    if (state.q) {
      var hay = [r.name, r.blurb, r.desc, r.address, r.city, catById[r.cat].name, (r.also || []).map(function (a) { return catById[a].name; }).join(" ")].join(" ").toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }
  function dist(r) { return r.lat ? site.milesBetween(state.me[0], state.me[1], r.lat, r.lng) : 9999; }
  function sorter(a, b) {
    if (state.me) return dist(a) - dist(b);
    return a.name.localeCompare(b.name);
  }

  var resultsEl = $("[data-results]");
  function render() {
    syncControls();
    var list = resources.filter(matches).sort(sorter);
    $("[data-count]").textContent = list.length === resources.length ? resources.length + " listings" : list.length + " of " + resources.length + " listings";
    resultsEl.innerHTML = list.length ? list.map(function (r) {
      return site.listingCard(r, state.me && r.lat ? dist(r) : null);
    }).join("") : '<li class="empty"><h3>No listings match</h3><p>Try a different search or clear some filters. If you need help right now, call or text <a href="tel:988">988</a>.</p><button type="button" class="btn btn--ghost btn--sm" data-clear-all>Clear filters</button></li>';

    var pills = [];
    if (state.q) pills.push(["q", "", '"' + state.q + '"']);
    state.cat.forEach(function (c) { pills.push(["cat", c, catById[c].name]); });
    state.aud.forEach(function (a) { pills.push(["aud", a, window.LUMA_AUDIENCES[a]]); });
    if (state.open) pills.push(["open", "", "Open now"]);
    if (state.walkin) pills.push(["walkin", "", "Walk-in location"]);
    if (state.spanish) pills.push(["spanish", "", "Spanish"]);
    $("[data-active]").innerHTML = pills.map(function (pl) {
      return '<button type="button" class="filter-x" data-remove="' + pl[0] + '" data-val="' + esc(pl[1]) + '" aria-label="Remove ' + esc(pl[2]) + '">' + esc(pl[2]) + icon("x") + "</button>";
    }).join("") + (pills.length > 1 ? '<button type="button" class="link-btn small" data-clear-all>Clear all</button>' : "");

    var q = new URLSearchParams();
    if (state.q) q.set("q", state.q);
    ["cat", "aud"].forEach(function (k) { if (state[k].length) q.set(k, state[k].join(",")); });
    ["open", "walkin", "spanish"].forEach(function (k) { if (state[k]) q.set(k, "1"); });
    if (state.me) q.set("sort", "near");
    history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : ""));
  }

  function locate() {
    if (!navigator.geolocation) { site.toast("Location isn't available in this browser", "info"); render(); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      state.me = [pos.coords.latitude, pos.coords.longitude]; render();
    }, function () { site.toast("Couldn't get your location", "info"); render(); });
  }

  var t;
  qInput.addEventListener("input", function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = qInput.value.trim(); render(); }, 150);
  });
  form.addEventListener("change", function (e) {
    var i = e.target;
    if (i.name === "near") { if (i.checked) locate(); else { state.me = null; render(); } return; }
    if (i.name === "cat" || i.name === "aud") state[i.name] = $all("input[name=" + i.name + "]:checked", form).map(function (x) { return x.value; });
    else if (i.name === "open" || i.name === "walkin" || i.name === "spanish") state[i.name] = i.checked;
    else return;
    render();
  });
  $all("[data-sort]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-sort") === "near") { if (!state.me) locate(); }
      else { state.me = null; render(); }
    });
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

  // on phones the filters are hidden behind a button
  var toggle = $("[data-filters-toggle]");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    form.classList.toggle("is-open", open);
  });

  render();
  if (state.near) locate();
});
