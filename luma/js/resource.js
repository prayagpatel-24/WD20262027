// Single listing page: resource.html?id=the-place
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var Lu = window.Luma, $ = Lu.$, icon = Lu.icon, esc = Lu.esc, CAT = Lu.CAT;
  var main = $("[data-resource]");
  var r = Lu.byId(new URLSearchParams(location.search).get("id"));

  if (!r) {
    main.innerHTML = '<div class="container notfound"><h1>We couldn\'t find that listing</h1><p class="lede" style="margin-inline:auto">The link might be broken or the listing was removed.</p>' +
      '<p><a class="btn" href="directory.html">Go to the directory</a></p></div>';
    document.title = "Not found | Luma Forsyth County";
    return;
  }

  var c = CAT[r.cat], st = Lu.openStatus(r.oh);
  document.title = r.name + " | Luma Forsyth County";

  var related = Lu.RES.filter(function (x) { return x.id !== r.id && Lu.inCat(x, r.cat); }).slice(0, 3);
  var seen = {};
  var events = Lu.occurrences(Lu.today0(), Lu.addDays(Lu.today0(), 60)).filter(function (o) {
    if (o.ev.resource !== r.id || seen[o.ev.id]) return false;
    seen[o.ev.id] = 1; return true;
  });
  var also = (r.also || []).map(function (a) { return CAT[a]; });
  var checked = r.verified ? Lu.MONTHS[+r.verified.split("-")[1] - 1] + " " + r.verified.split("-")[0] : "";

  main.innerHTML =
    '<section class="detail-head"><div class="container">' +
      '<a class="rcard__cat" href="directory.html?cat=' + c.id + '">' + esc(c.name) + "</a>" +
      "<h1>" + esc(r.name) + "</h1>" +
      '<p class="lede">' + esc(r.blurb) + "</p>" +
      '<div class="detail-actions">' +
        (r.phone ? '<a class="btn" href="' + Lu.telHref(r.phone) + '">' + icon("phone") + "Call " + esc(r.phone) + "</a>" : "") +
        (r.lat ? '<a class="btn btn--ghost" href="' + Lu.directionsHref(r) + '" target="_blank" rel="noopener">' + icon("navigation") + "Directions</a>" : "") +
        (r.web ? '<a class="btn btn--ghost" href="' + esc(r.web) + '" target="_blank" rel="noopener">' + icon("globe") + "Website</a>" : "") +
        '<button class="btn btn--ghost" type="button" data-save="' + r.id + '" aria-pressed="' + Lu.isSaved(r.id) + '">' + icon("bookmark") + "<span>Save</span></button>" +
      "</div>" +
    "</div></section>" +

    '<div class="container detail">' +
      "<div>" +
        "<h2>About</h2><p>" + esc(r.desc) + "</p>" +
        "<h2>Details</h2>" +
        '<dl class="facts">' +
          "<div><dt>Right now</dt><dd>" + (st ? '<span class="status-line ' + (st.open ? "is-open" : "") + '">' + esc(st.label) + "</span>" : "Call or check the website") + "</dd></div>" +
          "<div><dt>Hours</dt><dd>" + esc(r.hours || "Not listed") + "</dd></div>" +
          "<div><dt>Who it serves</dt><dd>" + r.aud.map(function (a) { return esc(window.LUMA_AUDIENCES[a]); }).join(", ") + "</dd></div>" +
          "<div><dt>Languages</dt><dd>" + r.lang.map(esc).join(", ") + "</dd></div>" +
          (also.length ? "<div><dt>Also listed under</dt><dd>" + also.map(function (a) { return '<a href="directory.html?cat=' + a.id + '">' + esc(a.name) + "</a>"; }).join(", ") + "</dd></div>" : "") +
        "</dl>" +
        (events.length ? '<h2>Coming up here</h2><ul class="ev-list">' + events.map(function (o) {
          var d = o.date;
          return '<li class="ev-card" style="grid-template-columns:1fr"><div><h3><a href="events.html#' + o.ev.id + '">' + esc(o.ev.title) + "</a></h3>" +
            '<div class="ev-card__meta"><span>' + icon("calendar") + Lu.DAY_SHORT[d.getDay()] + ", " + Lu.MON_SHORT[d.getMonth()] + " " + d.getDate() + "</span>" +
            (o.ev.start ? "<span>" + icon("clock") + Lu.fmtTime(o.ev.start) + (o.ev.finish ? " to " + Lu.fmtTime(o.ev.finish) : "") + "</span>" : "") + "</div></div></li>";
        }).join("") + "</ul>" : "") +
        '<div class="cite">' + icon("shield-check") + "<div>Checked " + esc(checked) + ' against <a href="' + esc(r.source.url) + '" target="_blank" rel="noopener">' + esc(r.source.label) + "</a>. " +
          'Things change, so call before you go. <a href="get-involved.html?report=' + r.id + '#report">Something wrong?</a></div></div>' +
      "</div>" +

      '<aside class="contact-card" aria-labelledby="contact-title">' +
        '<h2 id="contact-title">Contact</h2>' +
        (r.lat ? '<div class="minimap" id="minimap" role="img" aria-label="Map showing where ' + esc(r.name) + ' is"></div>' : "") +
        '<ul class="contact-list">' +
          "<li>" + icon(r.lat ? "map-pin" : "globe") + "<span>" + esc(Lu.fullAddress(r)) + (r.approx ? '<br><span class="muted small">Pin location is approximate.</span>' : "") + "</span></li>" +
          (r.phone ? "<li>" + icon("phone") + '<a href="' + Lu.telHref(r.phone) + '">' + esc(r.phone) + "</a></li>" : "") +
          (r.web ? "<li>" + icon("globe") + '<a href="' + esc(r.web) + '" target="_blank" rel="noopener">' + esc(r.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + "</a></li>" : "") +
          "<li>" + icon("clock") + "<span>" + esc(r.hours || "Hours not listed") + "</span></li>" +
        "</ul>" +
        (r.lat ? '<a class="btn btn--ghost btn--sm" href="map.html?id=' + r.id + '">' + icon("map") + "See it on the map</a>" : "") +
      "</aside>" +
    "</div>" +

    (related.length ? '<section class="section section--sunken" aria-labelledby="rel-title"><div class="container">' +
      '<div class="section-head"><h2 id="rel-title">More in ' + esc(c.name) + '</h2><p><a class="link-arrow" href="directory.html?cat=' + c.id + '">See all ' + icon("arrow-right") + "</a></p></div>" +
      '<div class="card-grid">' + related.map(function (x) { return Lu.resourceCard(x); }).join("") + "</div></div></section>" : "");

  Lu.refreshSaved();
  Lu.track("resource_view", { resource_id: r.id });

  if (r.lat && window.L) {
    var m = L.map("minimap", { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false })
      .setView([r.lat, r.lng], 14);
    var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
    var errs = 0;
    tiles.on("tileerror", function () { if (++errs > 2) { m.removeLayer(tiles); m.setZoom(10); } });
    L.marker([r.lat, r.lng], { keyboard: false, icon: L.divIcon({ className: "lpin is-active", iconSize: [30, 36], iconAnchor: [15, 36],
      html: '<svg viewBox="150 -890 660 800" width="30" height="36" aria-hidden="true"><path d="M458.5-103.5Q448-107 440-115q-42-38-91-87.5T258-309q-42-57-70-119t-28-124q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 62-28 124t-70 119q-42 57-91 106.5T520-115q-8 8-18.5 11.5T480-100q-11 0-21.5-3.5Z"/><circle cx="480" cy="-560" r="80"/></svg>' }) }).addTo(m);
  }
});
