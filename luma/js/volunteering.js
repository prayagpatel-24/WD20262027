// Volunteering page: volunteer list with interest filters.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, esc = site.esc;
  var TYPES = window.LUMA_VOLUNTEER_TYPES, OPPS = window.LUMA_VOLUNTEER;
  var picked = "";

  $("[data-vol-types]").innerHTML = '<button type="button" data-type="" aria-pressed="true">All</button>' +
    TYPES.map(function (t) { return '<button type="button" data-type="' + t.id + '" aria-pressed="false">' + esc(t.label) + "</button>"; }).join("");

  function renderVol() {
    var list = OPPS.filter(function (o) { return !picked || o.type === picked; });
    $all("[data-type]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-type") === picked)); });
    $("[data-vol-count]").innerHTML = "<strong>" + list.length + "</strong> " + (list.length === 1 ? "place" : "places") + " to help";
    $("[data-vol-list]").innerHTML = list.map(function (o) {
      var r = site.byId(o.resource);
      var name = r.web ? '<a href="' + esc(r.web) + '" target="_blank" rel="noopener">' + esc(r.name) + "</a>" : '<a href="resource.html?id=' + r.id + '">' + esc(r.name) + "</a>";
      return '<li class="vol">' +
        "<h3>" + name + "</h3><p>" + esc(o.task) + "</p>" +
        '<p class="vol__meta">' + o.tags.map(esc).join(" &middot; ") + (r.phone ? ' &middot; <span class="vol__phone">' + esc(r.phone) + "</span>" : "") +
          ' &middot; <a href="resource.html?id=' + r.id + '">Listing</a></p>' +
      "</li>";
    }).join("");
  }
  $("[data-vol-types]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-type]"); if (!b) return;
    picked = b.getAttribute("data-type"); renderVol();
  });
  renderVol();
});
