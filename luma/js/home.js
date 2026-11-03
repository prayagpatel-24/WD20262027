// Home page: small county map, category links and upcoming events.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, icon = site.icon, esc = site.esc;
  var resources = site.resources, categories = site.categories;

  var isOpen = function (r) { var s = site.openStatus(r.oh); return s && s.open; };
  $("[data-stat=mapped]").textContent = resources.filter(function (r) { return r.lat; }).length;
  $("[data-open-count]").textContent = resources.filter(isOpen).length + " open now";

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
    var dots = resources.filter(function (r) { return r.lat; }).map(function (r) {
      var p = px(r.lng, r.lat), x = p[0].toFixed(1), y = p[1].toFixed(1);
      return '<a class="hotspot" href="resource.html?id=' + r.id + '" data-id="' + r.id + '" aria-label="' + esc(r.name) + '">' +
        '<circle class="ring" cx="' + x + '" cy="' + y + '" r="9" fill="none" stroke="transparent"/>' +
        '<circle class="core pin--' + site.pinGroup(r.cat).id + '" cx="' + x + '" cy="' + y + '" r="6.5"/></a>';
    }).join("");
    host.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="presentation"><path class="county" d="' + d + '"/>' + dots +
      '<text class="city-label" x="' + (cumming[0] + 34).toFixed(0) + '" y="' + (cumming[1] + 4).toFixed(0) + '">Cumming</text></svg>';

    $("[data-pin-legend]").innerHTML = site.pinLegend();

    var tip = $("[data-lumamap-tip]"), card = host.parentNode;
    function show(a) {
      var r = site.byId(a.getAttribute("data-id")), status = site.openStatus(r.oh);
      var box = a.querySelector(".core").getBoundingClientRect(), cb = card.getBoundingClientRect();
      tip.innerHTML = "<strong>" + esc(r.name) + "</strong>" + esc(site.catById[r.cat].name) + (status ? ", " + (status.open ? "open now" : "closed now") : "");
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

  // Crisis, food and health first since those are the most urgent
  var first = ["crisis", "food", "health"];
  var ordered = first.map(function (id) { return site.catById[id]; }).concat(categories.filter(function (c) { return first.indexOf(c.id) === -1; }));
  $("[data-cat-row]").innerHTML = ordered.map(function (c) {
    var n = resources.filter(function (r) { return site.inCat(r, c.id); }).length;
    return '<li><a href="directory.html?cat=' + c.id + '">' + icon(c.icon) + '<span class="cat-row__name">' + site.catName(c) + '</span><span class="cat-row__n">' + n + "</span></a></li>";
  }).join("");

  // Next few events (each series shows once)
  var seen = {};
  var upcoming = site.occurrences(site.startOfToday(), site.addDays(site.startOfToday(), 75)).filter(function (o) {
    if (seen[o.ev.id]) return false; seen[o.ev.id] = true; return true;
  }).slice(0, 6);
  $("[data-agenda]").innerHTML = upcoming.map(function (o) {
    var ev = o.ev, d = o.date;
    var time = ev.start ? site.fmtTime(ev.start) + (ev.finish ? " to " + site.fmtTime(ev.finish) : "") : "All day";
    return '<li class="agenda__item">' +
      '<span class="agenda__date">' + site.DAY_SHORT[d.getDay()] + ", " + site.MON_SHORT[d.getMonth()] + " " + d.getDate() + "</span>" +
      '<span class="agenda__what"><a class="agenda__title" href="calendar.html#' + ev.id + '">' + esc(ev.title) + "</a>" +
        (ev.status === "tentative" ? ' <span class="projected">Projected</span>' : "") +
        '<span class="agenda__place">' + esc(ev.place) + "</span></span>" +
      '<span class="agenda__time">' + esc(time) + "</span></li>";
  }).join("");
});
