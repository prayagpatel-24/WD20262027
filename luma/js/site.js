// Shared code for every page: header, footer, search (Ctrl+K), My List,
// display settings and a few helpers the page scripts use.
(function () {
  "use strict";

  var ICONS = window.LUMA_ICONS || {};
  var CATS = window.LUMA_CATEGORIES || [];
  var RES = window.LUMA_RESOURCES || [];
  var EVENTS = window.LUMA_EVENTS || [];
  var CAT = {};
  CATS.forEach(function (c) { CAT[c.id] = c; });

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">' + (ICONS[name] || "") + "</svg>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // localStorage can throw in private mode, so wrap it
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function telHref(phone) { return "tel:" + String(phone).replace(/[^0-9+]/g, ""); }
  function directionsHref(r) {
    var q = r.lat ? r.lat + "," + r.lng : r.address + ", " + r.city + ", GA " + r.zip;
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
  }
  function fullAddress(r) {
    if (!r.address) return r.scope || "";
    return r.address + ", " + r.city + ", GA " + r.zip;
  }

  // "13:30" -> "1:30 p.m."
  function fmtTime(hhmm) {
    if (!hhmm) return "";
    var p = hhmm.split(":"), h = +p[0], m = +p[1];
    if (h === 12 && m === 0) return "noon";
    var h12 = h % 12 || 12;
    return h12 + (m ? ":" + (m < 10 ? "0" : "") + m : "") + (h >= 12 ? " p.m." : " a.m.");
  }
  var DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var MON_SHORT = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

  // Hours look like "Mo-Fr 08:00-17:00; Sa 10:00-14:00" (or "24/7")
  function parseHours(oh) {
    if (!oh) return null;
    if (oh === "24/7") return "24/7";
    var week = [[], [], [], [], [], [], []];
    oh.split(";").forEach(function (rule) {
      rule = rule.trim(); if (!rule) return;
      var parts = rule.split(/\s+/), days = [];
      parts[0].split(",").forEach(function (seg) {
        var r = seg.split("-");
        var a = DAY_CODES.indexOf(r[0]), b = r[1] ? DAY_CODES.indexOf(r[1]) : a;
        for (var i = a, n = 0; n < 7; i = (i + 1) % 7, n++) { days.push(i); if (i === b) break; }
      });
      parts.slice(1).join("").split(",").forEach(function (span) {
        var t = span.split("-"); if (t.length < 2) return;
        days.forEach(function (d) { week[d].push([toMin(t[0]), toMin(t[1])]); });
      });
    });
    return week;
  }
  function toMin(t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1] || 0); }
  function minToHHMM(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm; }

  function openStatus(oh, when) {
    var w = parseHours(oh);
    if (!w) return null;
    if (w === "24/7") return { open: true, label: "Open 24/7" };
    var now = when || new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < w[d].length; i++) {
      if (m >= w[d][i][0] && m < w[d][i][1]) return { open: true, label: "Open until " + fmtTime(minToHHMM(w[d][i][1])) };
    }
    for (var k = 0; k < 8; k++) {
      var dd = (d + k) % 7, slots = w[dd];
      for (var j = 0; j < slots.length; j++) {
        if (k === 0 && slots[j][0] <= m) continue;
        var day = k === 0 ? "today" : k === 1 ? "tomorrow" : DAY_SHORT[dd];
        return { open: false, label: "Closed, opens " + day + " at " + fmtTime(minToHHMM(slots[j][0])) };
      }
    }
    return { open: false, label: "Closed" };
  }

  // Turn the event patterns in data/events.js into actual dates
  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dateKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function nthWeekday(y, mo, day, nth) {
    if (nth > 0) {
      var first = new Date(y, mo, 1);
      var res = new Date(y, mo, 1 + (day - first.getDay() + 7) % 7 + (nth - 1) * 7);
      return res.getMonth() === mo ? res : null;
    }
    var last = new Date(y, mo + 1, 0);
    return new Date(y, mo, last.getDate() - (last.getDay() - day + 7) % 7);
  }
  function occurrences(from, to) {
    var out = [];
    EVENTS.forEach(function (ev) {
      var dates = [];
      if (ev.date) {
        var s = parseDate(ev.date), e = ev.end ? parseDate(ev.end) : s;
        for (var d = new Date(s); d <= e; d = addDays(d, 1)) dates.push(new Date(d));
      }
      if (ev.weekly) {
        var we = parseDate(ev.weekly.until);
        for (var x = parseDate(ev.weekly.from); x <= we; x = addDays(x, 1)) if (ev.weekly.days.indexOf(x.getDay()) > -1) dates.push(new Date(x));
      }
      if (ev.monthly) {
        var ms = parseDate(ev.monthly.from), me = parseDate(ev.monthly.until);
        for (var y = ms.getFullYear(), mo = ms.getMonth(); new Date(y, mo, 1) <= me; mo++) {
          if (mo > 11) { mo = 0; y++; }
          ev.monthly.nth.forEach(function (n) {
            var dd = nthWeekday(y, mo, ev.monthly.day, n);
            if (dd && dd >= ms && dd <= me) dates.push(dd);
          });
        }
      }
      (ev.extra || []).forEach(function (s) { dates.push(parseDate(s)); });
      dates.forEach(function (d) { if (d >= from && d <= to) out.push({ ev: ev, date: d, key: dateKey(d) }); });
    });
    out.sort(function (a, b) { return a.date - b.date || (a.ev.start || "").localeCompare(b.ev.start || ""); });
    return out;
  }
  function today0() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }

  // Analytics events go into a GA4-style dataLayer. Nothing is sent anywhere yet.
  function track(name, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
  }

  function toast(msg, ic) {
    var region = $(".toast-region");
    if (!region) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = icon(ic || "check") + "<span>" + esc(msg) + "</span>";
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 2800);
  }

  // header and footer
  var NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "directory.html", label: "Directory", page: "directory" },
    { href: "map.html", label: "Map", page: "map" },
    { href: "events.html", label: "Events", page: "events" },
    { href: "get-involved.html", label: "Get Involved", page: "involved" }
  ];

  function renderShell() {
    var page = document.body.getAttribute("data-page");
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    var head = $("[data-site-header]");
    if (head) {
      head.outerHTML =
        '<a class="skip-link" href="#main">Skip to main content</a>' +
        '<header class="site-header"><div class="container">' +
          '<a class="brand" href="index.html"><img src="img/logo-horizontal.png" alt="Luma home" width="193" height="44"></a>' +
          '<nav class="nav" id="site-nav" aria-label="Main">' +
            '<button class="icon-btn nav__close" type="button" data-close-nav aria-label="Close menu">' + icon("x") + "</button>" +
            '<ul class="nav__list">' + NAV.map(function (n) {
              return '<li><a class="nav__link" href="' + n.href + '"' + (n.page === page ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
            }).join("") + "</ul></nav>" +
          '<div class="header-actions">' +
            '<button class="search-trigger" type="button" data-open-palette aria-label="Search the site">' + icon("search", "icon--sm") +
              '<span class="label">Search</span><span class="kbd" aria-hidden="true">' + (isMac ? "⌘" : "Ctrl") + " K</span></button>" +
            '<button class="icon-btn" type="button" data-open-display aria-label="Display settings">' + icon("accessibility") + "</button>" +
            '<button class="icon-btn" type="button" data-open-mylist aria-label="My List">' + icon("bookmark") + '<span class="count-badge" data-mylist-count hidden>0</span></button>' +
            '<button class="icon-btn menu-toggle" type="button" data-open-nav aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">' + icon("menu") + "</button>" +
          "</div>" +
        '</div></header><div class="nav-scrim" data-close-nav></div>';
    }
    var foot = $("[data-site-footer]");
    if (foot) {
      foot.outerHTML =
        '<footer class="site-footer"><div class="container">' +
          '<div class="footer-top">' +
            '<div class="footer-brand"><img src="img/logo-light.png" alt="Luma" width="120" height="93">' +
              "<p>A guide to free and low-cost services, programs and places in Forsyth County, Georgia.</p></div>" +
            '<div class="footer-col"><h2>Find help</h2><ul>' +
              '<li><a href="directory.html">Directory</a></li><li><a href="map.html">Map</a></li><li><a href="events.html">Events</a></li><li><a href="directory.html?cat=crisis">Crisis support</a></li></ul></div>' +
            '<div class="footer-col"><h2>Help out</h2><ul>' +
              '<li><a href="get-involved.html">Volunteer</a></li><li><a href="get-involved.html#suggest">Suggest a resource</a></li><li><a href="get-involved.html#report">Report a problem</a></li></ul></div>' +
            '<div class="footer-col"><h2>Info</h2><ul>' +
              '<li><a href="sources.html">Sources</a></li><li><button class="link-btn" style="color:inherit" type="button" data-open-display>Display settings</button></li></ul></div>' +
          "</div>" +
          '<div class="footer-bottom"><p>Listings were checked in October 2026. Hours and services change, so call ahead before you go. In an emergency, call 911.</p>' +
          "<p>&copy; 2026 Luma &middot; FBLA Website Design</p></div>" +
        "</div></footer>" +
        '<div class="toast-region" role="status" aria-live="polite"></div>';
    }
    injectDialogs();
    // pages can drop in icons with <span data-icon="clock"></span>
    $all("[data-icon]").forEach(function (el) { el.outerHTML = icon(el.getAttribute("data-icon"), ("icon--sm " + el.className).trim()); });
    wireShell();
  }

  function injectDialogs() {
    var html =
      '<dialog class="panel" id="display-panel" aria-labelledby="display-title"><div class="panel__inner">' +
        '<div class="panel__head"><h2 id="display-title">Display</h2><button class="icon-btn" type="button" data-close aria-label="Close">' + icon("x") + "</button></div>" +
        '<div class="panel__body">' +
          '<div class="setting"><span class="setting__label" id="lbl-size">Text size</span>' +
            '<div class="segmented" role="group" aria-labelledby="lbl-size" data-pref="scale">' +
              '<button type="button" data-val="1" aria-label="Default text size">A</button><button type="button" data-val="1.15" aria-label="Large text">A+</button><button type="button" data-val="1.3" aria-label="Extra large text">A++</button></div></div>' +
          '<label class="toggle">Higher contrast text<span class="switch"><input type="checkbox" data-pref="contrast"><span></span></span></label>' +
          '<label class="toggle">Underline all links<span class="switch"><input type="checkbox" data-pref="links"><span></span></span></label>' +
          '<label class="toggle">Reduce motion<span class="switch"><input type="checkbox" data-pref="motion"><span></span></span></label>' +
        "</div>" +
        '<div class="panel__foot"><button class="btn btn--ghost btn--sm" type="button" data-reset-prefs>Reset</button></div>' +
      "</div></dialog>" +

      '<dialog class="palette" id="palette" aria-label="Search">' +
        '<div class="palette__input">' + icon("search") +
          '<input type="search" id="palette-input" placeholder="Search resources, events and pages" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="palette-results" aria-autocomplete="list">' +
          '<button class="kbd" type="button" data-close aria-label="Close search">Esc</button></div>' +
        '<div class="palette__results" id="palette-results" role="listbox" aria-label="Results"></div>' +
        '<div class="palette__foot" aria-hidden="true"><span>↑↓ move</span><span>Enter open</span><span>Esc close</span></div>' +
      "</dialog>" +

      '<dialog class="panel" id="mylist" aria-labelledby="mylist-title"><div class="panel__inner">' +
        '<div class="panel__head"><h2 id="mylist-title">My List</h2><button class="icon-btn" type="button" data-close aria-label="Close">' + icon("x") + "</button></div>" +
        '<div class="panel__body" style="gap:0"><p class="muted small" style="margin-bottom:.25rem">Saved on this device. No account needed.</p><div data-mylist-body></div></div>' +
        '<div class="panel__foot"><button class="btn btn--sm" type="button" data-mylist-print>' + icon("printer") + 'Print</button><button class="btn btn--ghost btn--sm" type="button" data-mylist-copy>' + icon("copy") + "Copy</button></div>" +
      "</div></dialog>";
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  // display settings
  var DEFAULT_PREFS = { scale: "1", contrast: false, motion: false, links: false };
  function getPrefs() { return Object.assign({}, DEFAULT_PREFS, store("luma.prefs") || {}); }
  function applyPrefs(p) {
    var r = document.documentElement;
    r.style.setProperty("--text-scale", p.scale);
    if (p.contrast) r.setAttribute("data-contrast", "high"); else r.removeAttribute("data-contrast");
    if (p.motion) r.setAttribute("data-motion", "reduce"); else r.removeAttribute("data-motion");
    if (p.links) r.setAttribute("data-links", "underline"); else r.removeAttribute("data-links");
    syncPrefControls(p);
  }
  function syncPrefControls(p) {
    $all("#display-panel [data-pref]").forEach(function (g) {
      var key = g.getAttribute("data-pref");
      if (g.type === "checkbox") { g.checked = !!p[key]; return; }
      $all("[data-val]", g).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-val") === String(p[key]))); });
    });
  }
  function setPref(key, val) {
    var p = getPrefs(); p[key] = val; store("luma.prefs", p); applyPrefs(p);
    track("display_setting", { setting: key, value: String(val) });
  }

  // My List
  function savedIds() { return store("luma.saved") || []; }
  function isSaved(id) { return savedIds().indexOf(id) > -1; }
  function byId(id) { return RES.filter(function (r) { return r.id === id; })[0]; }
  function toggleSaved(id) {
    var ids = savedIds(), i = ids.indexOf(id);
    if (i > -1) { ids.splice(i, 1); toast("Removed from My List", "bookmark"); }
    else { ids.push(id); toast("Saved to My List", "bookmark-check"); track("resource_save", { resource_id: id }); }
    store("luma.saved", ids);
    refreshSaved();
  }
  function refreshSaved() {
    var ids = savedIds();
    $all("[data-mylist-count]").forEach(function (b) { b.textContent = ids.length; b.hidden = ids.length === 0; });
    $all("[data-save]").forEach(function (b) {
      var on = ids.indexOf(b.getAttribute("data-save")) > -1;
      b.setAttribute("aria-pressed", String(on));
      if (b.closest("[data-mylist-body]")) return;
      b.innerHTML = icon(on ? "bookmark-check" : "bookmark") + (b.classList.contains("btn") ? "<span>" + (on ? "Saved" : "Save") + "</span>" : "");
    });
    var body = $("[data-mylist-body]");
    if (!body) return;
    var items = ids.map(byId).filter(Boolean);
    body.innerHTML = items.length ? items.map(function (r) {
      return '<div class="mylist-item"><h3><a href="resource.html?id=' + r.id + '">' + esc(r.name) + "</a></h3>" +
        '<button class="save-btn" type="button" data-save="' + r.id + '" aria-label="Remove ' + esc(r.name) + '" aria-pressed="true">' + icon("x") + "</button>" +
        "<p>" + esc(fullAddress(r)) + (r.phone ? " &middot; " + esc(r.phone) : "") + "</p></div>";
    }).join("") : '<div class="empty" style="margin-top:1rem"><h3>Nothing saved yet</h3><p>Use the bookmark button on any listing to keep it here.</p></div>';
  }
  function mylistText() {
    return savedIds().map(byId).filter(Boolean).map(function (r) {
      return r.name + "\n  " + fullAddress(r) + (r.phone ? "\n  " + r.phone : "") + (r.web ? "\n  " + r.web : "") + (r.hours ? "\n  " + r.hours : "");
    }).join("\n\n");
  }

  // search palette
  var PAGES = [
    { t: "Home", s: "Start here", href: "index.html", ic: "house" },
    { t: "Directory", s: "Search and filter every listing", href: "directory.html", ic: "list" },
    { t: "Map", s: "See what's near you", href: "map.html", ic: "map" },
    { t: "Events", s: "Community calendar", href: "events.html", ic: "calendar" },
    { t: "Get Involved", s: "Volunteer opportunities", href: "get-involved.html", ic: "hand-helping" },
    { t: "Sources", s: "Where our information comes from", href: "sources.html", ic: "book-open" }
  ];
  var index = [];
  function buildIndex() {
    PAGES.forEach(function (p) { index.push({ group: "Pages", t: p.t, s: p.s, href: p.href, ic: p.ic, hay: (p.t + " " + p.s).toLowerCase() }); });
    CATS.forEach(function (c) { index.push({ group: "Categories", t: c.name, s: "Browse category", href: "directory.html?cat=" + c.id, ic: c.icon, c: c.color, hay: (c.name + " " + c.short).toLowerCase() }); });
    RES.forEach(function (r) {
      var c = CAT[r.cat];
      index.push({ group: "Resources", t: r.name, s: c.name + " · " + (r.address ? r.city : r.scope || ""), href: "resource.html?id=" + r.id, ic: c.icon, c: c.color,
        hay: [r.name, r.blurb, c.name, (r.also || []).map(function (a) { return CAT[a].name; }).join(" "), r.city, r.address].join(" ").toLowerCase() });
    });
    EVENTS.forEach(function (e) {
      index.push({ group: "Events", t: e.title, s: e.place, href: "events.html#" + e.id, ic: "calendar", c: CAT[e.cat].color, hay: (e.title + " " + e.place + " " + e.desc).toLowerCase() });
    });
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return index.filter(function (x) { return x.group !== "Resources" && x.group !== "Events"; }).slice(0, 12);
    var terms = q.split(/\s+/);
    return index.map(function (x) {
      var score = 0, name = x.t.toLowerCase();
      for (var i = 0; i < terms.length; i++) {
        if (x.hay.indexOf(terms[i]) === -1) return null;
        score += name.indexOf(terms[i]) === 0 ? 6 : name.indexOf(terms[i]) > -1 ? 3 : 1;
      }
      return { x: x, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 14).map(function (o) { return o.x; });
  }
  var sel = 0, results = [];
  function renderPalette(q) {
    results = search(q);
    var box = $("#palette-results");
    if (!results.length) { box.innerHTML = '<div class="palette__empty">Nothing found for "' + esc(q) + '". Try "food", "library" or "vote".</div>'; return; }
    var html = "", last = "";
    results.forEach(function (x, i) {
      if (x.group !== last) { html += '<div class="palette__group" role="presentation">' + x.group + "</div>"; last = x.group; }
      html += '<a class="palette__item" role="option" id="pal-' + i + '" href="' + x.href + '" aria-selected="' + (i === sel) + '"' + (x.c ? ' style="--c:' + x.c + '"' : "") + ">" +
        '<span><span class="t">' + esc(x.t) + '</span><span class="s">' + esc(x.s) + "</span></span></a>";
    });
    box.innerHTML = html;
    $("#palette-input").setAttribute("aria-activedescendant", "pal-" + sel);
  }
  function movePal(d) {
    if (!results.length) return;
    sel = (sel + d + results.length) % results.length;
    $all(".palette__item").forEach(function (el, i) { el.setAttribute("aria-selected", String(i === sel)); });
    var el = $("#pal-" + sel); if (el) el.scrollIntoView({ block: "nearest" });
    $("#palette-input").setAttribute("aria-activedescendant", "pal-" + sel);
  }
  function openPalette() {
    var d = $("#palette"); if (!d.open) d.showModal();
    var inp = $("#palette-input"); inp.value = ""; sel = 0; renderPalette(""); inp.focus();
  }

  // wiring
  function openDialog(d) { if (d && !d.open) d.showModal(); }
  function wireShell() {
    buildIndex();

    var nav = $("#site-nav"), scrim = $(".nav-scrim"), opener = $("[data-open-nav]");
    function setNav(open) {
      nav.classList.toggle("is-open", open); scrim.classList.toggle("is-open", open);
      opener.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) $(".nav__link", nav).focus(); else opener.focus();
    }
    $all("[data-open-nav]").forEach(function (b) { b.addEventListener("click", function () { setNav(true); }); });
    $all("[data-close-nav]").forEach(function (b) { b.addEventListener("click", function () { setNav(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false); });

    $all("dialog").forEach(function (d) {
      $all("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
      d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    });
    $all("[data-open-display]").forEach(function (b) { b.addEventListener("click", function () { openDialog($("#display-panel")); }); });
    $all("[data-open-mylist]").forEach(function (b) { b.addEventListener("click", function () { refreshSaved(); openDialog($("#mylist")); }); });
    $all("[data-open-palette]").forEach(function (b) { b.addEventListener("click", openPalette); });

    $all("#display-panel [data-pref]").forEach(function (g) {
      var key = g.getAttribute("data-pref");
      if (g.type === "checkbox") { g.addEventListener("change", function () { setPref(key, g.checked); }); return; }
      $all("[data-val]", g).forEach(function (b) { b.addEventListener("click", function () { setPref(key, b.getAttribute("data-val")); }); });
    });
    $("[data-reset-prefs]").addEventListener("click", function () { store("luma.prefs", DEFAULT_PREFS); applyPrefs(getPrefs()); });
    syncPrefControls(getPrefs());

    var pin = $("#palette-input");
    pin.addEventListener("input", function () { sel = 0; renderPalette(pin.value); });
    pin.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); movePal(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePal(-1); }
      else if (e.key === "Enter" && results[sel]) { track("search", { search_term: pin.value }); location.href = results[sel].href; }
    });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); openPalette(); }
    });

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-save]");
      if (b) { e.preventDefault(); toggleSaved(b.getAttribute("data-save")); }
    });
    $("[data-mylist-print]").addEventListener("click", function () {
      var w = window.open("", "_blank");
      if (!w) { window.print(); return; }
      w.document.write("<title>My List</title><pre style='font:14px/1.5 system-ui;white-space:pre-wrap;padding:24px'>My List (Luma, Forsyth County)\n\n" + esc(mylistText() || "Nothing saved yet.") + "</pre>");
      w.document.close(); w.focus(); w.print();
    });
    $("[data-mylist-copy]").addEventListener("click", function () {
      var txt = mylistText();
      if (!txt) { toast("Nothing saved yet", "info"); return; }
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { toast("Copied", "copy"); }, function () { toast("Couldn't copy here", "info"); });
    });
    refreshSaved();
    reveal(document);
  }

  // fade sections in as they scroll into view
  var io = null;
  function reveal(root) {
    var els = $all(".reveal:not(.is-in)", root || document);
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  // listing card used on the directory, resource and other pages
  function resourceCard(r, opts) {
    opts = opts || {};
    var c = CAT[r.cat], st = openStatus(r.oh);
    var where = r.address ? r.address + ", " + r.city : (r.scope || "");
    return '<article class="rcard" data-id="' + r.id + '">' +
      '<div class="rcard__top"><span class="rcard__cat">' + esc(c.name) + "</span>" +
        (st ? '<span class="badge ' + (st.open ? "badge--open" : "") + '">' + (st.open ? (r.oh === "24/7" ? "24/7" : "Open now") : "Closed now") + "</span>" : "") + "</div>" +
      '<h3 class="rcard__title"><a href="resource.html?id=' + r.id + '">' + esc(r.name) + "</a></h3>" +
      '<p class="rcard__blurb">' + esc(r.blurb) + "</p>" +
      '<ul class="rcard__meta">' +
        (where ? "<li>" + icon(r.lat ? "map-pin" : "globe") + "<span>" + esc(where) + (opts.distance != null ? " (" + opts.distance.toFixed(1) + " mi)" : "") + "</span></li>" : "") +
        (r.phone ? "<li>" + icon("phone") + "<span>" + esc(r.phone) + "</span></li>" : "") +
      "</ul>" +
      '<div class="rcard__foot"><span class="rcard__more">View details</span>' +
        '<div class="rcard__actions">' +
          (r.phone ? '<a class="save-btn" href="' + telHref(r.phone) + '" aria-label="Call ' + esc(r.name) + '">' + icon("phone") + "</a>" : "") +
          '<button class="save-btn" type="button" data-save="' + r.id + '" aria-pressed="' + isSaved(r.id) + '" aria-label="Save ' + esc(r.name) + '">' + icon(isSaved(r.id) ? "bookmark-check" : "bookmark") + "</button>" +
      "</div></div></article>";
  }

  window.Luma = {
    icon: icon, esc: esc, $: $, $all: $all, store: store, track: track, toast: toast,
    CAT: CAT, CATS: CATS, RES: RES, EVENTS: EVENTS, byId: byId,
    openStatus: openStatus, fmtTime: fmtTime, telHref: telHref, directionsHref: directionsHref, fullAddress: fullAddress,
    occurrences: occurrences, parseDate: parseDate, dateKey: dateKey, addDays: addDays, today0: today0,
    DAY_NAMES: DAY_NAMES, DAY_SHORT: DAY_SHORT, MONTHS: MONTHS, MON_SHORT: MON_SHORT,
    reveal: reveal, resourceCard: resourceCard, refreshSaved: refreshSaved, isSaved: isSaved,
    inCat: function (r, cat) { return r.cat === cat || (r.also || []).indexOf(cat) > -1; },
    milesBetween: function (a, b, c, d) {
      var R = 3958.8, k = Math.PI / 180, dLat = (c - a) * k, dLon = (d - b) * k;
      var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a * k) * Math.cos(c * k) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderShell);
  else renderShell();
})();
