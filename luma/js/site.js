// Shared code for every page: header, footer,
// display settings and a few helpers the page scripts use.
(function () {
  "use strict";

  var ICONS = window.LUMA_ICONS || {};
  var categories = window.LUMA_CATEGORIES || [];
  var resources = window.LUMA_RESOURCES || [];
  var events = window.LUMA_EVENTS || [];
  var catById = {};
  categories.forEach(function (c) { catById[c.id] = c; });

  function icon(name, cls) {
    var ic = ICONS[name] || { v: "0 0 512 512", b: "" };
    return '<svg class="icon ' + (cls || "") + '" viewBox="' + ic.v + '" aria-hidden="true" focusable="false">' + ic.b + "</svg>";
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
  // long category names are set a bit smaller so they don't make their row taller than the rest
  function catName(c) { return c.name.length > 26 ? '<span class="long-name">' + esc(c.name) + "</span>" : esc(c.name); }
  function domain(url) { return String(url).replace(/^https?:\/\/(www\.)?/, "").split("/")[0]; }

  // "families, adults, seniors" -> "Families, adults and older adults (60+)"
  function audPhrase(aud) {
    var names = aud.filter(function (a) { return a !== "all" && a !== "volunteers"; }).map(function (a) {
      return window.LUMA_AUDIENCES[a].toLowerCase();
    });
    var list = names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names[0] || "";
    var out;
    if (aud.indexOf("all") > -1) out = "Everyone" + (list ? ", especially " + list : "");
    else out = list.charAt(0).toUpperCase() + list.slice(1);
    if (aud.indexOf("volunteers") > -1) out = (out || "Everyone") + ". Volunteers welcome";
    return out;
  }

  // logos have a lot of white space, so they're zoomed in to fill a small box next to the name
  var logos = { "nami-fdl": 1.25, "family-haven": 2, "united-way": 1.9, "kfcb": 1.8 };
  function logoBox(id, cls) {
    var img = window.LUMA_IMAGES[id];
    return '<span class="logo-box ' + cls + '" style="--zoom:' + logos[id] + '"><img src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '" loading="lazy"></span>';
  }

  // Map pins and dots use four colors from the logo palette instead of one color per category
  var PIN_GROUPS = [
    { id: "ink", label: "Health and mental health", cats: ["health", "crisis"] },
    { id: "brown", label: "Food, housing, jobs, family and seniors", cats: ["food", "housing", "jobs", "youth", "seniors"] },
    { id: "olive", label: "Education and government", cats: ["learn", "civic"] },
    { id: "gold", label: "Parks and volunteering", cats: ["rec", "volunteer"] }
  ];
  function pinLegend() {
    return PIN_GROUPS.map(function (g) { return '<li class="pin--' + g.id + '">' + g.label + "</li>"; }).join("");
  }
  function pinGroup(cat) { return PIN_GROUPS.filter(function (g) { return g.cats.indexOf(cat) > -1; })[0] || PIN_GROUPS[0]; }

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
    events.forEach(function (ev) {
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
  function startOfToday() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }

  function toast(msg, ic) {
    var region = $(".toast-region");
    if (!region) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = icon(ic || "check") + "<span>" + esc(msg) + "</span>";
    region.appendChild(el);
    setTimeout(function () { el.remove(); }, 2800);
  }

  var NAV = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "directory.html", label: "Directory", page: "directory" },
    { href: "map.html", label: "Map", page: "map" },
    { href: "calendar.html", label: "Calendar", page: "calendar" },
    { href: "volunteering.html", label: "Volunteering", page: "volunteering" }
  ];

  function renderShell() {
    var page = document.body.getAttribute("data-page");
    var head = $("[data-site-header]");
    if (head) {
      head.outerHTML =
        '<a class="skip-link" href="#main">Skip to main content</a>' +
        '<header class="site-header"><div class="container">' +
          '<a class="brand" href="index.html"><img src="img/' + (document.documentElement.getAttribute("data-theme") === "dark" ? "logo-horizontal-light.png" : "logo-horizontal.png") + '" alt="Luma home" width="193" height="44"></a>' +
          '<nav class="nav" id="site-nav" aria-label="Main">' +
            '<button class="icon-btn nav__close" type="button" data-close-nav aria-label="Close menu">' + icon("x") + "</button>" +
            '<ul class="nav__list">' + NAV.map(function (n) {
              return '<li><a class="nav__link" href="' + n.href + '"' + (n.page === page ? ' aria-current="page"' : "") + ">" + n.label + "</a></li>";
            }).join("") + "</ul></nav>" +
          '<div class="header-actions">' +
            '<button class="icon-btn" type="button" data-open-display aria-label="Display settings">' + icon("accessibility") + "</button>" +
            '<button class="icon-btn menu-toggle" type="button" data-open-nav aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">' + icon("menu") + "</button>" +
          "</div>" +
        '</div></header><div class="nav-scrim" data-close-nav></div>';
    }
    var foot = $("[data-site-footer]");
    if (foot) {
      var links = NAV.slice(1).concat([{ href: "submit.html#add", label: "Suggest a resource" }, { href: "submit.html#report", label: "Report a problem" }, { href: "sources.html", label: "Sources" }]);
      foot.outerHTML =
        '<footer class="site-footer"><div class="container">' +
          '<div class="footer-row"><img src="img/logo-light.png" alt="Luma" width="64" height="50">' +
            '<ul class="footer-links">' + links.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }).join("") + "</ul></div>" +
          '<p class="footer-crisis">Need help now? Call or text <a href="tel:988">988</a> &middot; Georgia Crisis &amp; Access Line <a href="tel:18007154225">800-715-4225</a> &middot; Family Haven <a href="tel:7708871121">770-887-1121</a> &middot; Emergency <a href="tel:911">911</a></p>' +
          '<p class="footer-note">&copy; 2026 Luma &middot; FBLA Website Design</p>' +
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
          '<div class="setting" data-listen hidden><span class="setting__label">Listen</span>' +
            '<button class="btn btn--ghost" type="button" data-read-aloud aria-pressed="false">Read this page aloud</button></div>' +
          '<div class="setting"><span class="setting__label" id="lbl-size">Text size</span>' +
            '<div class="segmented" role="group" aria-labelledby="lbl-size" data-pref="scale">' +
              '<button type="button" data-val="1" aria-label="Text size 100 percent">100%</button><button type="button" data-val="1.15" aria-label="Text size 115 percent">115%</button><button type="button" data-val="1.3" aria-label="Text size 130 percent">130%</button><button type="button" data-val="1.5" aria-label="Text size 150 percent">150%</button></div></div>' +
          '<div class="setting"><span class="setting__label" id="lbl-theme">Colors</span>' +
            '<div class="segmented" role="group" aria-labelledby="lbl-theme" data-pref="theme">' +
              '<button type="button" data-val="light">Light</button><button type="button" data-val="dark">Dark</button></div></div>' +
          '<label class="toggle">Higher contrast<span class="switch"><input type="checkbox" data-pref="contrast"><span></span></span></label>' +
          '<label class="toggle">Underline all links<span class="switch"><input type="checkbox" data-pref="links"><span></span></span></label>' +
          '<label class="toggle">Wider text spacing<span class="switch"><input type="checkbox" data-pref="spacing"><span></span></span></label>' +
          '<label class="toggle">Easier-to-read font<span class="switch"><input type="checkbox" data-pref="font"><span></span></span></label>' +
          '<label class="toggle">Hide photos<span class="switch"><input type="checkbox" data-pref="images"><span></span></span></label>' +
        "</div>" +
        '<div class="panel__foot"><button class="btn btn--ghost btn--sm" type="button" data-reset-prefs>Reset</button></div>' +
      "</div></dialog>";
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  var DEFAULT_PREFS = { scale: "1", theme: "light", contrast: false, links: false, spacing: false, font: false, images: false };
  function getPrefs() { return Object.assign({}, DEFAULT_PREFS, store("luma.prefs") || {}); }
  function applyPrefs(p) {
    var r = document.documentElement;
    r.style.setProperty("--text-scale", p.scale);
    if (p.contrast) r.setAttribute("data-contrast", "high"); else r.removeAttribute("data-contrast");
    if (p.links) r.setAttribute("data-links", "underline"); else r.removeAttribute("data-links");
    if (p.spacing) r.setAttribute("data-spacing", "wide"); else r.removeAttribute("data-spacing");
    if (p.font) r.setAttribute("data-font", "readable"); else r.removeAttribute("data-font");
    if (p.images) r.setAttribute("data-images", "hide"); else r.removeAttribute("data-images");
    if (p.theme === "dark") r.setAttribute("data-theme", "dark"); else r.removeAttribute("data-theme");
    var logo = $(".brand img");
    if (logo) logo.src = "img/" + (p.theme === "dark" ? "logo-horizontal-light.png" : "logo-horizontal.png");
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
  }

  // reads the main part of the page with the browser's own voice. Chrome stops long
  // utterances after about 15 seconds, so the text is spoken in short pieces.
  function wireReadAloud() {
    var btn = $("[data-read-aloud]");
    if (!btn || !("speechSynthesis" in window)) return;
    $("[data-listen]").hidden = false;
    function setState(on) {
      btn.setAttribute("aria-pressed", String(on));
      btn.textContent = on ? "Stop reading" : "Read this page aloud";
    }
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-pressed") === "true") { speechSynthesis.cancel(); setState(false); return; }
      var text = $("main").innerText.replace(/\s+/g, " ").trim();
      var pieces = [], cur = "";
      (text.match(/[^.!?]+[.!?]*\s*/g) || [text]).forEach(function (sentence) {
        if ((cur + sentence).length > 200 && cur) { pieces.push(cur); cur = ""; }
        cur += sentence;
      });
      if (cur) pieces.push(cur);
      // a run of text with no full stops (like a list of links) can still be too long
      pieces = pieces.reduce(function (all, piece) {
        while (piece.length > 220) {
          var cut = piece.lastIndexOf(" ", 220);
          all.push(piece.slice(0, cut)); piece = piece.slice(cut + 1);
        }
        return all.concat(piece);
      }, []);
      speechSynthesis.cancel();
      pieces.forEach(function (piece, i) {
        var u = new SpeechSynthesisUtterance(piece);
        u.lang = document.documentElement.lang || "en-US";
        if (i === pieces.length - 1) u.onend = function () { setState(false); };
        speechSynthesis.speak(u);
      });
      setState(true);
    });
    window.addEventListener("pagehide", function () { speechSynthesis.cancel(); });
  }

  function byId(id) { return resources.filter(function (r) { return r.id === id; })[0]; }

  function openDialog(d) { if (d && !d.open) d.showModal(); }
  function wireShell() {
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

    $all("#display-panel [data-pref]").forEach(function (g) {
      var key = g.getAttribute("data-pref");
      if (g.type === "checkbox") { g.addEventListener("change", function () { setPref(key, g.checked); }); return; }
      $all("[data-val]", g).forEach(function (b) { b.addEventListener("click", function () { setPref(key, b.getAttribute("data-val")); }); });
    });
    $("[data-reset-prefs]").addEventListener("click", function () { store("luma.prefs", DEFAULT_PREFS); applyPrefs(getPrefs()); });
    wireReadAloud();
    syncPrefControls(getPrefs());

  }

  function listingCard(r, distance) {
    var c = catById[r.cat], status = openStatus(r.oh), img = window.LUMA_IMAGES[r.id], logo = logos[r.id];
    var where = r.address ? r.address + ", " + r.city : (r.scope || "");
    return '<li class="card">' +
      (img && !logo ? '<img class="card__img" src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '" loading="lazy">' : "") +
      '<div class="card__body">' +
        '<span class="cat-label">' + esc(c.name) + "</span>" +
        '<div class="card__title">' + (logo ? logoBox(r.id, "card__logo") : "") +
          '<h3><a href="resource.html?id=' + r.id + '">' + esc(r.name) + "</a></h3></div>" +
        "<p>" + esc(r.blurb) + "</p>" +
        '<ul class="card__meta">' +
          (status ? '<li class="status' + (status.open ? " status--open" : "") + '">' + (status.open ? (r.oh === "24/7" ? "Open 24/7" : "Open now") : "Closed now") + "</li>" : "") +
          (where ? "<li>" + esc(where) + (distance != null ? " (" + distance.toFixed(1) + " mi)" : "") + "</li>" : "") +
          (r.phone ? '<li><a href="' + telHref(r.phone) + '" aria-label="Call ' + esc(r.name) + " at " + esc(r.phone) + '">' + esc(r.phone) + "</a></li>" : "") +
        "</ul></div></li>";
  }

  window.Luma = {
    icon: icon, esc: esc, $: $, $all: $all, store: store, toast: toast,
    catById: catById, categories: categories, resources: resources, events: events, byId: byId,
    openStatus: openStatus, fmtTime: fmtTime, telHref: telHref, directionsHref: directionsHref, fullAddress: fullAddress,
    catName: catName, domain: domain, audPhrase: audPhrase, logos: logos, logoBox: logoBox, pinGroup: pinGroup, pinLegend: pinLegend,
    occurrences: occurrences, parseDate: parseDate, dateKey: dateKey, addDays: addDays, startOfToday: startOfToday,
    DAY_NAMES: DAY_NAMES, DAY_SHORT: DAY_SHORT, MONTHS: MONTHS, MON_SHORT: MON_SHORT,
    listingCard: listingCard,
    inCat: function (r, cat) { return r.cat === cat || (r.also || []).indexOf(cat) > -1; },
    // straight-line distance in miles (haversine formula)
    milesBetween: function (lat1, lng1, lat2, lng2) {
      var R = 3958.8, rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderShell);
  else renderShell();
})();
