// Home page: small county map, category tiles and upcoming events.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var L = window.Luma, $ = L.$, $all = L.$all, icon = L.icon, esc = L.esc;
  var RES = L.RES, CATS = L.CATS;

  var isOpen = function (r) { var s = L.openStatus(r.oh); return s && s.open; };
  $("[data-stat=mapped]").textContent = RES.filter(function (r) { return r.lat; }).length;
  $("[data-open-count]").textContent = RES.filter(isOpen).length + " open now";

  // County map drawn as SVG from the boundary file, so it works without internet
  (function drawMap() {
    var host = $("[data-lumamap-svg]");
    if (!host || !window.LUMA_BOUNDARY) return;
    var ring = LUMA_BOUNDARY.geometry.coordinates[0];
    var lons = ring.map(function (p) { return p[0]; }), lats = ring.map(function (p) { return p[1]; });
    var minX = Math.min.apply(null, lons), maxX = Math.max.apply(null, lons), minY = Math.min.apply(null, lats), maxY = Math.max.apply(null, lats);
    var kx = Math.cos((minY + maxY) / 2 * Math.PI / 180);
    var W = 520, pad = 16, scale = (W - pad * 2) / ((maxX - minX) * kx), H = Math.round((maxY - minY) * scale + pad * 2);
    function px(lon, lat) { return [pad + (lon - minX) * kx * scale, pad + (maxY - lat) * scale]; }
    var d = ring.map(function (p, i) { var q = px(p[0], p[1]); return (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); }).join("") + "Z";
    var cumming = px(-84.1402, 34.2073);
    var dots = RES.filter(function (r) { return r.lat; }).map(function (r) {
      var c = L.CAT[r.cat], p = px(r.lng, r.lat), x = p[0].toFixed(1), y = p[1].toFixed(1);
      return '<a class="hotspot" href="resource.html?id=' + r.id + '" data-id="' + r.id + '" aria-label="' + esc(r.name) + '">' +
        '<circle class="halo" cx="' + x + '" cy="' + y + '" r="11" fill="' + c.color + '"/>' +
        '<circle class="ring" cx="' + x + '" cy="' + y + '" r="9" fill="none" stroke="transparent"/>' +
        '<circle class="core" cx="' + x + '" cy="' + y + '" r="5" fill="' + c.color + '"/></a>';
    }).join("");
    host.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="presentation"><path class="county" d="' + d + '"/>' + dots +
      '<text class="city-label" x="' + (cumming[0] + 34).toFixed(0) + '" y="' + (cumming[1] + 4).toFixed(0) + '">Cumming</text></svg>';

    var tip = $("[data-lumamap-tip]"), card = host.parentNode;
    function show(a) {
      var r = L.byId(a.getAttribute("data-id")), st = L.openStatus(r.oh);
      var box = a.querySelector(".core").getBoundingClientRect(), cb = card.getBoundingClientRect();
      tip.innerHTML = "<strong>" + esc(r.name) + "</strong>" + esc(L.CAT[r.cat].name) + (st ? ", " + (st.open ? "open now" : "closed now") : "");
      tip.style.left = (box.left - cb.left + box.width / 2) + "px";
      tip.style.top = (box.top - cb.top) + "px";
      tip.classList.add("is-on");
    }
    function hide() { tip.classList.remove("is-on"); }
    $all(".hotspot", host).forEach(function (a) {
      a.addEventListener("mouseenter", function () { show(a); });
      a.addEventListener("focus", function () { show(a); });
      a.addEventListener("mouseleave", hide);
      a.addEventListener("blur", hide);
    });
  })();

  // Category tiles
  $("[data-cat-grid]").innerHTML = CATS.map(function (c) {
    var n = RES.filter(function (r) { return L.inCat(r, c.id); }).length;
    return '<a class="cat-tile" style="--c:' + c.color + '" href="directory.html?cat=' + c.id + '">' +
      '<span class="cat-tile__icon">' + icon(c.icon) + "</span>" +
      '<span class="cat-tile__text"><span class="cat-tile__name">' + esc(c.name) + '</span><span class="cat-tile__count">' + n + " listings</span></span>" +
      '<span class="cat-tile__arrow">' + icon("arrow-right", "icon--sm") + "</span></a>";
  }).join("");

  // Next few events (each series shows once)
  var seen = {};
  var occ = L.occurrences(L.today0(), L.addDays(L.today0(), 75)).filter(function (o) {
    if (seen[o.ev.id]) return false; seen[o.ev.id] = true; return true;
  }).slice(0, 5);
  $("[data-agenda]").innerHTML = occ.map(function (o) {
    var ev = o.ev, c = L.CAT[ev.cat], d = o.date;
    var time = ev.start ? L.fmtTime(ev.start) + (ev.finish ? " to " + L.fmtTime(ev.finish) : "") : "All day";
    var badge = ev.status === "tentative" ? '<span class="badge badge--warn">Projected</span>' : ev.status === "recurring" ? '<span class="badge">Recurring</span>' : '<span class="badge badge--confirmed">Confirmed</span>';
    return '<li class="agenda__item">' +
      '<div class="datebox" aria-hidden="true"><div class="datebox__m">' + L.MON_SHORT[d.getMonth()].replace(".", "") + '</div><div class="datebox__d">' + d.getDate() + '</div><div class="datebox__w">' + L.DAY_SHORT[d.getDay()] + "</div></div>" +
      '<div><h3 class="agenda__title"><a href="calendar.html#' + ev.id + '"><span class="sr-only">' + L.DAY_NAMES[d.getDay()] + ", " + L.MONTHS[d.getMonth()] + " " + d.getDate() + ": </span>" + esc(ev.title) + "</a></h3>" +
        '<div class="agenda__meta"><span>' + icon("clock") + esc(time) + "</span><span>" + icon("map-pin") + esc(ev.place) + "</span></div></div>" +
      '<div class="agenda__side"><span class="tag">' + esc(c.short) + "</span>" + badge + "</div></li>";
  }).join("");
});
