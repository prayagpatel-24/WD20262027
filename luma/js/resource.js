// Single listing page: resource.html?id=the-place
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, icon = site.icon, esc = site.esc, catById = site.catById;
  var main = $("[data-resource]");
  var r = site.byId(new URLSearchParams(location.search).get("id"));

  if (!r) {
    main.innerHTML = '<div class="container notfound"><h1>We couldn\'t find that listing</h1><p class="lede" style="margin-inline:auto">The link might be broken or the listing was removed.</p>' +
      '<p><a class="btn" href="directory.html">Go to the directory</a></p></div>';
    document.title = "Not found | Luma Forsyth County";
    return;
  }

  var c = catById[r.cat], status = site.openStatus(r.oh);
  document.title = r.name + " | Luma Forsyth County";

  var related = site.resources.filter(function (x) { return x.id !== r.id && site.inCat(x, r.cat); }).slice(0, 6);
  var seen = {};
  var upcoming = site.occurrences(site.startOfToday(), site.addDays(site.startOfToday(), 60)).filter(function (o) {
    if (o.ev.resource !== r.id || seen[o.ev.id]) return false;
    seen[o.ev.id] = 1; return true;
  });
  var also = (r.also || []).map(function (a) { return catById[a]; });
  var logo = site.logos[r.id];
  var img = logo ? null : window.LUMA_IMAGES[r.id];

  main.innerHTML =
    '<section class="detail-head"><div class="container">' +
      '<a class="cat-label" href="directory.html?cat=' + c.id + '">' + esc(c.name) + "</a>" +
      '<div class="detail-title">' + (logo ? site.logoBox(r.id, "detail-logo") : "") +
        "<h1>" + esc(r.name) + "</h1></div>" +
      (status ? '<p class="status' + (status.open ? " status--open" : "") + '">' + esc(status.label) + "</p>" : "") +
    "</div></section>" +

    '<div class="container detail">' +
      "<div>" +
        (img ? '<figure class="detail-photo"><img src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '"><figcaption>Photo: <a href="' + esc(img.page) + '" target="_blank" rel="noopener">' + esc(img.credit) + "</a></figcaption></figure>" : "") +
        '<p class="detail-desc">' + esc(r.desc) + "</p>" +
        '<dl class="facts">' +
          "<div><dt>Who it serves</dt><dd>" + esc(site.audPhrase(r.aud)) + "</dd></div>" +
          "<div><dt>Languages</dt><dd>" + r.lang.map(esc).join(", ") + "</dd></div>" +
          (also.length ? "<div><dt>Also listed under</dt><dd>" + also.map(function (a) { return '<a href="directory.html?cat=' + a.id + '">' + esc(a.name) + "</a>"; }).join(", ") + "</dd></div>" : "") +
        "</dl>" +
        (upcoming.length ? '<h2>Coming up here</h2><ul class="plain-list">' + upcoming.map(function (o) {
          var d = o.date;
          return '<li><a href="calendar.html#' + o.ev.id + '">' + esc(o.ev.title) + "</a> &middot; " + site.DAY_SHORT[d.getDay()] + ", " + site.MON_SHORT[d.getMonth()] + " " + d.getDate() +
            (o.ev.start ? ", " + site.fmtTime(o.ev.start) + (o.ev.finish ? " to " + site.fmtTime(o.ev.finish) : "") : "") + "</li>";
        }).join("") + "</ul>" : "") +
        '<p class="cite">Source: <a href="' + esc(r.source.url) + '" target="_blank" rel="noopener">' + esc(r.source.label) + "</a>. " +
          '<a href="submit.html?report=' + r.id + '#report">Something wrong?</a></p>' +
      "</div>" +

      '<aside class="contact-card" aria-labelledby="contact-title">' +
        '<h2 id="contact-title">Contact and hours</h2>' +
        (r.lat ? '<div class="minimap" id="minimap" role="img" aria-label="Map showing where ' + esc(r.name) + ' is"></div>' : "") +
        '<dl class="contact-list">' +
          "<div><dt>" + (r.lat ? "Address" : "Area") + "</dt><dd>" + esc(site.fullAddress(r)) + (r.approx ? '<br><span class="muted small">Pin location is approximate.</span>' : "") +
            (r.lat ? '<br><a href="' + site.directionsHref(r) + '" target="_blank" rel="noopener">Directions</a> &middot; <a href="map.html?id=' + r.id + '">See it on the map</a>' : "") + "</dd></div>" +
          (r.phone ? '<div><dt>Phone</dt><dd><a href="' + site.telHref(r.phone) + '">' + esc(r.phone) + "</a></dd></div>" : "") +
          (r.web ? '<div><dt>Website</dt><dd><a href="' + esc(r.web) + '" target="_blank" rel="noopener">' + esc(site.domain(r.web)) + "</a></dd></div>" : "") +
          "<div><dt>Hours</dt><dd>" + esc(r.hours || "Hours not listed") + "</dd></div>" +
        "</dl>" +
      "</aside>" +
    "</div>" +

    (related.length ? '<section class="section--tight related" aria-labelledby="rel-title"><div class="container">' +
      '<h2 id="rel-title">More in ' + esc(c.name) + "</h2>" +
      '<ul class="plain-list">' + related.map(function (x) {
        return '<li><a href="resource.html?id=' + x.id + '">' + esc(x.name) + "</a>" + (x.city ? " &middot; " + esc(x.city) : "") + "</li>";
      }).join("") + "</ul>" +
      '<p><a class="link-arrow" href="directory.html?cat=' + c.id + '">All ' + esc(c.name) + " listings " + icon("arrow-right") + "</a></p></div></section>" : "");


  if (r.lat && window.L) {
    var m = L.map("minimap", { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false })
      .setView([r.lat, r.lng], 14);
    var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(m);
    var errs = 0;
    tiles.on("tileerror", function () { if (++errs > 2) { m.removeLayer(tiles); m.setZoom(10); } });
    L.marker([r.lat, r.lng], { keyboard: false, icon: L.divIcon({ className: "lpin is-active pin--" + site.pinGroup(r.cat).id, iconSize: [30, 36], iconAnchor: [15, 36],
      html: '<svg viewBox="150 -890 660 800" width="30" height="36" aria-hidden="true"><path d="M458.5-103.5Q448-107 440-115q-42-38-91-87.5T258-309q-42-57-70-119t-28-124q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 62-28 124t-70 119q-42 57-91 106.5T520-115q-8 8-18.5 11.5T480-100q-11 0-21.5-3.5Z"/><circle cx="480" cy="-560" r="80"/></svg>' }) }).addTo(m);
  }
});
