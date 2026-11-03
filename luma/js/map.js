// Map page. The list on the left and the pins on the map stay in sync.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, esc = site.esc;
  var resources = site.resources, categories = site.categories, catById = site.catById;
  if (!window.L) return;

  var params = new URLSearchParams(location.search);
  var state = { cat: params.get("cat") || "", q: "", open: false, me: null, selected: params.get("id") || null };
  var mapped = resources.filter(function (r) { return r.lat; });
  var countywide = resources.filter(function (r) { return !r.lat; });

  var map = L.map("map", { zoomControl: false, maxZoom: 18, maxBoundsViscosity: 1, zoomSnap: 0.25 }).setView([34.205, -84.14], 11);

  // Lock the map to Forsyth County: you can't pan away or zoom out past the whole county.
  var countyBounds = window.LUMA_BOUNDARY ? L.geoJSON(LUMA_BOUNDARY).getBounds() : L.latLngBounds([34.06, -84.26], [34.33, -84.0]);
  map.setMaxBounds(countyBounds.pad(0.08));

  // Fade out everything outside the county so Forsyth stands out
  if (window.LUMA_BOUNDARY) {
    var world = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
    var county = LUMA_BOUNDARY.geometry.coordinates[0].map(function (p) { return [p[1], p[0]]; });
    L.polygon([world, county], { interactive: false, stroke: false, className: "county-fade", fillColor: "#FFFFFF", fillOpacity: 0.6 }).addTo(map);
    L.polygon(county, { interactive: false, color: "#85561A", weight: 2, opacity: 0.9, fill: false }).addTo(map);
  }
  // The min zoom has to be a whole number. The cluster plugin only works with whole zoom
  // levels, and a min zoom like 11.5 made far-apart pins (like the 5 libraries) vanish.
  function lockZoom() {
    map.setMinZoom(0);
    map.fitBounds(countyBounds, { padding: [4, 4], animate: false });
    map.setMinZoom(Math.floor(map.getZoom()));
  }
  lockZoom();
  window.addEventListener("resize", function () { clearTimeout(lockZoom.t); lockZoom.t = setTimeout(lockZoom, 200); });
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // If the OpenStreetMap tiles can't load (no internet) we show the county outline instead.
  var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
  });
  var tileErrors = 0, offline = false;
  function goOffline() {
    if (offline) return;
    offline = true;
    map.removeLayer(tiles);
    $(".mappage__map").classList.add("is-offline");
    $("[data-offline-banner]").hidden = false;
  }
  tiles.on("tileerror", function () { if (++tileErrors >= 4) goOffline(); });
  if (navigator.onLine === false) goOffline(); else tiles.addTo(map);

  // the standard map pin shape (Material Symbols "location_on"), in the site colors
  var PINS = {};
  function pinIcon(cat) {
    var g = site.pinGroup(cat).id;
    return PINS[g] || (PINS[g] = L.divIcon({
      className: "lpin pin--" + g, iconSize: [30, 36], iconAnchor: [15, 36], popupAnchor: [0, -32],
      html: '<svg viewBox="150 -890 660 800" width="30" height="36" aria-hidden="true"><path d="M458.5-103.5Q448-107 440-115q-42-38-91-87.5T258-309q-42-57-70-119t-28-124q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 62-28 124t-70 119q-42 57-91 106.5T520-115q-8 8-18.5 11.5T480-100q-11 0-21.5-3.5Z"/><circle cx="480" cy="-560" r="80"/></svg>'
    }));
  }
  // The pins (and the cluster layer that groups them) are rebuilt from scratch every time
  // the filters change. Changing the same cluster layer while the map is still animating
  // from the last search made every pin disappear, so we never reuse it.
  var cluster = null;
  var markers = {};
  function newClusterLayer() {
    return L.markerClusterGroup({
      showCoverageOnHover: false, spiderfyOnMaxZoom: true, zoomToBoundsOnClick: true,
      iconCreateFunction: function (c) {
        return L.divIcon({ className: "lcluster", iconSize: [36, 36], html: "<span>" + c.getChildCount() + "</span>" });
      }
    });
  }
  function makeMarker(r) {
    var m = L.marker([r.lat, r.lng], { title: r.name, alt: r.name, riseOnHover: true, icon: pinIcon(r.cat) });
    m.bindPopup(function () { return popupHTML(r); }, { maxWidth: 280, minWidth: 220, className: "luma-popup" });
    m.on("click", function () { select(r.id, { fromMap: true }); });
    return m;
  }

  function popupHTML(r) {
    var c = catById[r.cat], status = site.openStatus(r.oh);
    return '<div class="pop"><span class="cat-label">' + esc(c.name) + "</span>" +
      "<h3>" + esc(r.name) + "</h3>" +
      '<p class="pop__addr">' + esc(site.fullAddress(r)) + (r.approx ? " (approximate)" : "") + "</p>" +
      (status ? '<p class="pop__status ' + (status.open ? "is-open" : "") + '">' + esc(status.label) + "</p>" : "") +
      '<p class="pop__actions"><a href="resource.html?id=' + r.id + '">Details</a>' +
        '<a href="' + site.directionsHref(r) + '" target="_blank" rel="noopener">Directions</a>' +
        (r.phone ? '<a href="' + site.telHref(r.phone) + '">' + esc(r.phone) + "</a>" : "") + "</p></div>";
  }

  var catBox = $("[data-map-cats]");
  catBox.innerHTML = '<li><button type="button" data-cat="">All places <span>' + mapped.length + "</span></button></li>" + categories.map(function (c) {
    var n = mapped.filter(function (r) { return site.inCat(r, c.id); }).length;
    return n ? '<li><button type="button" data-cat="' + c.id + '">' + site.catName(c) + " <span>" + n + "</span></button></li>" : "";
  }).join("");
  catBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.getAttribute("data-cat"); render(true);
  });
  $("[data-map-open]").addEventListener("change", function (e) { state.open = e.target.checked; render(true); });
  var qTimer;
  $("#map-q").addEventListener("input", function (e) {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { state.q = e.target.value.trim().toLowerCase(); render(true); }, 150);
  });

  function passes(r) {
    if (state.cat && !site.inCat(r, state.cat)) return false;
    if (state.open) { var s = site.openStatus(r.oh); if (!s || !s.open) return false; }
    if (state.q) {
      var hay = (r.name + " " + r.blurb + " " + r.address + " " + r.city + " " + catById[r.cat].name).toLowerCase();
      if (state.q.split(/\s+/).some(function (t) { return hay.indexOf(t) === -1; })) return false;
    }
    return true;
  }

  var listEl = $("[data-map-list]");
  function render(refit) {
    $all("[data-cat]", catBox).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === state.cat)); });
    $("[data-map-open]").checked = state.open;

    var shown = mapped.filter(passes);
    if (state.me) {
      shown.forEach(function (r) { r._d = site.milesBetween(state.me[0], state.me[1], r.lat, r.lng); });
      shown.sort(function (a, b) { return a._d - b._d; });
    } else shown.sort(function (a, b) { return a.name.localeCompare(b.name); });

    map.closePopup();
    if (cluster) map.removeLayer(cluster);
    cluster = newClusterLayer();
    markers = {};
    cluster.addLayers(shown.map(function (r) { return (markers[r.id] = makeMarker(r)); }));
    map.addLayer(cluster);

    $("[data-map-count]").textContent = "Showing " + shown.length + " of " + mapped.length + " places" + (state.me ? ", closest first" : "");
    listEl.innerHTML = shown.length ? shown.map(function (r) {
      var c = catById[r.cat], status = site.openStatus(r.oh);
      return '<li><button type="button" class="maplist__item' + (r.id === state.selected ? " is-selected" : "") + '" data-id="' + r.id + '">' +
        '<span class="maplist__body"><span class="maplist__cat"><span class="maplist__dot pin--' + site.pinGroup(r.cat).id + '" aria-hidden="true"></span>' + esc(c.name) + "</span>" +
        '<span class="maplist__name">' + esc(r.name) + "</span>" +
        '<span class="maplist__meta">' + esc(r.address) + (state.me ? " (" + r._d.toFixed(1) + " mi)" : "") + "</span>" +
        (status ? '<span class="status' + (status.open ? " status--open" : "") + '">' + (status.open ? "Open now" : "Closed now") + "</span>" : "") +
        "</span></button></li>";
    }).join("") : '<li class="empty" style="margin:1rem 0">Nothing matches. <button type="button" class="link-btn" data-clear>Clear filters</button></li>';

    var bounds = shown.map(function (r) { return [r.lat, r.lng]; });
    if (state.me) bounds.push(state.me);
    if (refit && bounds.length) map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: .5 });
  }
  listEl.addEventListener("click", function (e) {
    if (e.target.closest("[data-clear]")) {
      Object.assign(state, { cat: "", q: "", open: false }); $("#map-q").value = ""; render(true); return;
    }
    var b = e.target.closest(".maplist__item");
    if (b) select(b.getAttribute("data-id"), { fly: true });
  });

  function select(id, opts) {
    state.selected = id;
    $all(".maplist__item").forEach(function (b) { b.classList.toggle("is-selected", b.getAttribute("data-id") === id); });
    var m = markers[id]; if (!m) return;
    if (opts.fly) {
      cluster.zoomToShowLayer(m, function () {
        map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 15), { duration: .5 });
        setTimeout(function () { m.openPopup(); }, 550);
      });
    }
    $all(".lpin.is-active").forEach(function (p) { p.classList.remove("is-active"); });
    setTimeout(function () { var el = m.getElement(); if (el) el.classList.add("is-active"); }, opts.fly ? 600 : 0);
    if (opts.fromMap) {
      var li = $('.maplist__item[data-id="' + id + '"]');
      if (li) li.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  map.on("popupclose", function () { $all(".lpin.is-active").forEach(function (p) { p.classList.remove("is-active"); }); });

  var meMarker = null, locBtn = $("[data-locate]");
  locBtn.addEventListener("click", function () {
    if (!navigator.geolocation) { site.toast("Location isn't available in this browser", "info"); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      state.me = [pos.coords.latitude, pos.coords.longitude];
      locBtn.setAttribute("aria-pressed", "true");
      if (meMarker) map.removeLayer(meMarker);
      meMarker = L.marker(state.me, { icon: L.divIcon({ className: "me-wrap", html: '<span class="me"></span>', iconSize: [18, 18] }), title: "You are here", keyboard: false }).addTo(map);
      render(true);
    }, function () { site.toast("Couldn't get your location. Check your browser settings.", "info"); }, { timeout: 10000, maximumAge: 300000 });
  });

  $("[data-countywide]").innerHTML = countywide.map(function (r) {
    return '<li><a href="resource.html?id=' + r.id + '"><span>' + esc(r.name) +
      '<span class="muted">' + esc(r.scope || "") + "</span></span></a>" +
      (r.phone ? '<a class="cw-phone" href="' + site.telHref(r.phone) + '">' + esc(r.phone) + "</a>" : "") + "</li>";
  }).join("");

  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "map-legend");
    var wide = window.matchMedia("(min-width: 960px)").matches;
    div.innerHTML = "<details" + (wide ? " open" : "") + '><summary>Pin colors</summary><ul class="pin-legend">' + site.pinLegend() + "</ul></details>";
    return div;
  };
  legend.addTo(map);

  // phones show the list or the map, not both
  var page = $(".mappage");
  $all("[data-view-btn]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-view-btn");
      page.setAttribute("data-view", v);
      $all("[data-view-btn]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      if (v === "map") setTimeout(function () { map.invalidateSize(); }, 50);
    });
  });
  listEl.addEventListener("click", function (e) {
    if (e.target.closest(".maplist__item") && window.matchMedia("(max-width: 959px)").matches) $('[data-view-btn="map"]').click();
  }, true);

  render(false);
  if (state.selected && markers[state.selected]) setTimeout(function () { select(state.selected, { fly: true }); }, 400);
  setTimeout(function () { map.invalidateSize(); }, 200);
});
