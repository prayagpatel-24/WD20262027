// Map page. The list on the left and the pins on the map stay in sync.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var Lu = window.Luma, $ = Lu.$, $all = Lu.$all, icon = Lu.icon, esc = Lu.esc;
  var RES = Lu.RES, CATS = Lu.CATS, CAT = Lu.CAT;
  if (!window.L) return;

  var params = new URLSearchParams(location.search);
  var state = { cat: params.get("cat") || "", q: "", open: false, me: null, selected: params.get("id") || null };
  var mapped = RES.filter(function (r) { return r.lat; });
  var countywide = RES.filter(function (r) { return !r.lat; });

  var map = L.map("map", { zoomControl: false, maxZoom: 18, maxBoundsViscosity: 1, zoomSnap: 0.25 }).setView([34.205, -84.14], 11);

  // Lock the map to Forsyth County: you can't pan away or zoom out past the whole county.
  var countyBounds = window.LUMA_BOUNDARY ? L.geoJSON(LUMA_BOUNDARY).getBounds() : L.latLngBounds([34.06, -84.26], [34.33, -84.0]);
  map.setMaxBounds(countyBounds.pad(0.08));

  // Fade out everything outside the county so Forsyth stands out
  if (window.LUMA_BOUNDARY) {
    var world = [[90, -180], [90, 180], [-90, 180], [-90, -180]];
    var county = LUMA_BOUNDARY.geometry.coordinates[0].map(function (p) { return [p[1], p[0]]; });
    L.polygon([world, county], { interactive: false, stroke: false, fillColor: "#FCFAF6", fillOpacity: 0.72 }).addTo(map);
    L.polygon(county, { interactive: false, color: "#C98E3E", weight: 2, opacity: 0.9, fill: false }).addTo(map);
  }
  function lockZoom() {
    map.setMinZoom(0);
    map.fitBounds(countyBounds, { padding: [4, 4], animate: false });
    map.setMinZoom(map.getZoom());
  }
  lockZoom();
  window.addEventListener("resize", function () { clearTimeout(lockZoom.t); lockZoom.t = setTimeout(lockZoom, 200); });
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Same OpenStreetMap tiles Ripple used. If they can't load (no internet) we show the county outline instead.
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
  var PIN = L.divIcon({
    className: "lpin", iconSize: [30, 36], iconAnchor: [15, 36], popupAnchor: [0, -32],
    html: '<svg viewBox="150 -890 660 800" width="30" height="36" aria-hidden="true"><path d="M458.5-103.5Q448-107 440-115q-42-38-91-87.5T258-309q-42-57-70-119t-28-124q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 62-28 124t-70 119q-42 57-91 106.5T520-115q-8 8-18.5 11.5T480-100q-11 0-21.5-3.5Z"/><circle cx="480" cy="-560" r="80"/></svg>'
  });
  var cluster = L.markerClusterGroup({ showCoverageOnHover: false, spiderfyOnMaxZoom: true, zoomToBoundsOnClick: true });
  var markers = {};
  mapped.forEach(function (r) {
    var m = L.marker([r.lat, r.lng], { title: r.name, alt: r.name, riseOnHover: true, icon: PIN });
    m.bindPopup(function () { return popupHTML(r); }, { maxWidth: 280, minWidth: 220, className: "luma-popup" });
    m.on("click", function () { select(r.id, { fromMap: true }); Lu.track("map_pin_click", { resource_id: r.id }); });
    markers[r.id] = m;
  });
  map.addLayer(cluster);

  function popupHTML(r) {
    var c = CAT[r.cat], st = Lu.openStatus(r.oh);
    return '<div class="pop"><span class="rcard__cat">' + esc(c.name) + "</span>" +
      "<h3>" + esc(r.name) + "</h3>" +
      '<p class="pop__addr">' + esc(Lu.fullAddress(r)) + (r.approx ? " (approximate)" : "") + "</p>" +
      (st ? '<p class="pop__status ' + (st.open ? "is-open" : "") + '">' + esc(st.label) + "</p>" : "") +
      '<div class="pop__actions"><a class="btn btn--sm" href="resource.html?id=' + r.id + '">Details</a>' +
        '<a class="btn btn--sm btn--ghost" href="' + Lu.directionsHref(r) + '" target="_blank" rel="noopener">Directions</a>' +
        (r.phone ? '<a class="btn btn--sm btn--ghost" href="' + Lu.telHref(r.phone) + '">Call</a>' : "") + "</div></div>";
  }

  // filters
  var catBox = $("[data-map-cats]");
  catBox.innerHTML = '<button type="button" class="chip" data-cat="">All</button>' + CATS.filter(function (c) {
    return mapped.some(function (r) { return Lu.inCat(r, c.id); });
  }).map(function (c) {
    return '<button type="button" class="chip" data-cat="' + c.id + '">' + esc(c.short) + "</button>";
  }).join("");
  catBox.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.getAttribute("data-cat"); render(true);
  });
  $all("[data-map-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { var k = b.getAttribute("data-map-toggle"); state[k] = !state[k]; render(true); });
  });
  var qTimer;
  $("#map-q").addEventListener("input", function (e) {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { state.q = e.target.value.trim().toLowerCase(); render(true); }, 150);
  });

  function passes(r) {
    if (state.cat && !Lu.inCat(r, state.cat)) return false;
    if (state.open) { var s = Lu.openStatus(r.oh); if (!s || !s.open) return false; }
    if (state.q) {
      var hay = (r.name + " " + r.blurb + " " + r.address + " " + r.city + " " + CAT[r.cat].name).toLowerCase();
      if (state.q.split(/\s+/).some(function (t) { return hay.indexOf(t) === -1; })) return false;
    }
    return true;
  }

  var listEl = $("[data-map-list]");
  function render(refit) {
    $all("[data-cat]", catBox).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === state.cat)); });
    $all("[data-map-toggle]").forEach(function (b) { b.setAttribute("aria-pressed", String(state[b.getAttribute("data-map-toggle")])); });

    var shown = mapped.filter(passes);
    if (state.me) {
      shown.forEach(function (r) { r._d = Lu.milesBetween(state.me[0], state.me[1], r.lat, r.lng); });
      shown.sort(function (a, b) { return a._d - b._d; });
    } else shown.sort(function (a, b) { return a.name.localeCompare(b.name); });

    cluster.clearLayers();
    cluster.addLayers(shown.map(function (r) { return markers[r.id]; }));

    $("[data-map-count]").textContent = "Showing " + shown.length + " of " + mapped.length + " places" + (state.me ? ", closest first" : "");
    listEl.innerHTML = shown.length ? shown.map(function (r) {
      var c = CAT[r.cat], st = Lu.openStatus(r.oh);
      return '<li><button type="button" class="maplist__item' + (r.id === state.selected ? " is-selected" : "") + '" data-id="' + r.id + '">' +
        '<span class="maplist__body"><span class="maplist__name">' + esc(r.name) + "</span>" +
        '<span class="maplist__meta">' + esc(r.address) + (state.me ? " (" + r._d.toFixed(1) + " mi)" : "") + "</span>" +
        (st ? '<span class="maplist__status ' + (st.open ? "is-open" : "") + '">' + (st.open ? "Open now" : "Closed now") + "</span>" : "") +
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
    if (!navigator.geolocation) { Lu.toast("Location isn't available in this browser", "info"); return; }
    navigator.geolocation.getCurrentPosition(function (pos) {
      state.me = [pos.coords.latitude, pos.coords.longitude];
      locBtn.setAttribute("aria-pressed", "true");
      if (meMarker) map.removeLayer(meMarker);
      meMarker = L.marker(state.me, { icon: L.divIcon({ className: "me-wrap", html: '<span class="me"></span>', iconSize: [18, 18] }), title: "You are here", keyboard: false }).addTo(map);
      render(true);
    }, function () { Lu.toast("Couldn't get your location. Check your browser settings.", "info"); }, { timeout: 10000, maximumAge: 300000 });
  });

  $("[data-countywide]").innerHTML = countywide.map(function (r) {
    return '<li><a href="resource.html?id=' + r.id + '"><span>' + esc(r.name) +
      '<span class="muted">' + esc(r.scope || "") + "</span></span></a>" +
      (r.phone ? '<a class="cw-phone" href="' + Lu.telHref(r.phone) + '">' + esc(r.phone) + "</a>" : "") + "</li>";
  }).join("");

  render(false);
  if (state.selected && markers[state.selected]) setTimeout(function () { select(state.selected, { fly: true }); }, 400);
  setTimeout(function () { map.invalidateSize(); }, 200);
});
