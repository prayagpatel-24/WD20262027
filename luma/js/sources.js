// Sources page: builds the list from the data files, grouped by source.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var L = window.Luma, $ = L.$, esc = L.esc;

  function group(items, getSrc, getName, link) {
    var byUrl = {}, order = [];
    items.forEach(function (it) {
      var s = getSrc(it);
      if (!byUrl[s.url]) { byUrl[s.url] = { s: s, used: [] }; order.push(s.url); }
      byUrl[s.url].used.push(link(it, getName(it)));
    });
    order.sort(function (a, b) { return byUrl[a].s.label.localeCompare(byUrl[b].s.label); });
    return order.map(function (u) {
      var g = byUrl[u];
      return '<li><span><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(g.s.label) + "</a>" +
        '<span class="used">Cited for: ' + g.used.join(", ") + "</span></span></li>";
    }).join("");
  }

  $("[data-n-res]").textContent = L.RES.length;
  $("[data-refs-res]").innerHTML = group(L.RES, function (r) { return r.source; }, function (r) { return r.name; },
    function (r, n) { return '<a href="resource.html?id=' + r.id + '">' + esc(n) + "</a>"; });
  $("[data-refs-ev]").innerHTML = group(L.EVENTS, function (e) { return e.source; }, function (e) { return e.title; },
    function (e, n) { return '<a href="events.html#' + e.id + '">' + esc(n) + "</a>"; });
});
