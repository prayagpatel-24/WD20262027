// Sources page: builds the list from the data files, grouped by source.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, esc = site.esc;

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

  // one line per photographer or organization, then the listings whose photos came from them
  var byCredit = {}, credits = [];
  site.resources.forEach(function (r) {
    var p = window.LUMA_IMAGES[r.id];
    if (!p) return;
    var key = p.credit + (p.license ? " (" + p.license + ")" : "");
    if (!byCredit[key]) { byCredit[key] = []; credits.push(key); }
    byCredit[key].push('<a href="' + esc(p.page) + '" target="_blank" rel="noopener">' + esc(r.name) + "</a>");
  });
  credits.sort();
  $("[data-photo-credits]").innerHTML = credits.map(function (k) {
    return "<li><strong>" + esc(k) + "</strong>: " + byCredit[k].join("; ") + "</li>";
  }).join("");

  $("[data-n-res]").textContent = site.resources.length;
  $("[data-refs-res]").innerHTML = group(site.resources, function (r) { return r.source; }, function (r) { return r.name; },
    function (r, n) { return '<a href="resource.html?id=' + r.id + '">' + esc(n) + "</a>"; });
  $("[data-refs-ev]").innerHTML = group(site.events, function (e) { return e.source; }, function (e) { return e.title; },
    function (e, n) { return '<a href="calendar.html#' + e.id + '">' + esc(n) + "</a>"; });
});
