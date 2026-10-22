// Events page: month grid, list view, category filter and "add to calendar" (.ics) downloads.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var L = window.Luma, $ = L.$, $all = L.$all, icon = L.icon, esc = L.esc;
  var EVENTS = L.EVENTS, CAT = L.CAT, CATS = L.CATS;
  var DAY_PLURAL = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
  var ORD = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", "-1": "last" };

  var today = L.today0();
  var state = { view: "month", cat: "", y: today.getFullYear(), m: today.getMonth(), day: L.dateKey(today) };
  var hash = location.hash.replace("#", "");
  if (hash && EVENTS.some(function (e) { return e.id === hash; })) state.view = "list";

  function fmtDate(d, withYear) { return L.DAY_SHORT[d.getDay()] + ", " + L.MON_SHORT[d.getMonth()] + " " + d.getDate() + (withYear ? ", " + d.getFullYear() : ""); }
  function timeText(ev) { return ev.start ? L.fmtTime(ev.start) + (ev.finish ? " to " + L.fmtTime(ev.finish) : "") : "All day"; }
  function schedule(ev) {
    if (ev.weekly) {
      var days = ev.weekly.days.join(",") === "1,2,3,4,5" ? "Weekdays" : "Every " + ev.weekly.days.map(function (d) { return L.DAY_NAMES[d]; }).join(" and ");
      var s = days + ", " + fmtDate(L.parseDate(ev.weekly.from)).replace(/^\w+, /, "") + " to " + fmtDate(L.parseDate(ev.weekly.until), true).replace(/^\w+, /, "");
      if (ev.extra) s += ", plus " + ev.extra.map(function (x) { return fmtDate(L.parseDate(x)); }).join(", ");
      return s;
    }
    if (ev.monthly) return "The " + ev.monthly.nth.map(function (n) { return ORD[n]; }).join(" and ") + " " + L.DAY_NAMES[ev.monthly.day] + " of each month";
    if (ev.end) return fmtDate(L.parseDate(ev.date), true).replace(/^\w+, /, "") + " to " + fmtDate(L.parseDate(ev.end), true).replace(/^\w+, /, "");
    return fmtDate(L.parseDate(ev.date), true);
  }
  function statusBadge(ev) {
    return ev.status === "tentative" ? '<span class="badge badge--warn">Projected date</span>' :
      ev.status === "recurring" ? '<span class="badge">Recurring</span>' : '<span class="badge badge--confirmed">Confirmed</span>';
  }
  function visible(ev) { return !state.cat || ev.cat === state.cat; }

  // calendar file (.ics) that Google, Apple and Outlook can all import
  function icsDate(s) { return s.replace(/-/g, ""); }
  function icsDT(dateStr, hhmm) { return icsDate(dateStr) + "T" + hhmm.replace(":", "") + "00"; }
  function icsEscape(s) { return String(s).replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }
  function buildICS(ev) {
    var first = ev.date || (ev.weekly && L.occurrences(L.parseDate(ev.weekly.from), L.parseDate(ev.weekly.until)).filter(function (o) { return o.ev.id === ev.id; })[0].key) ||
      L.occurrences(L.parseDate(ev.monthly.from), L.parseDate(ev.monthly.until)).filter(function (o) { return o.ev.id === ev.id; })[0].key;
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Luma Forsyth//Community Calendar//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + ev.id + "@luma-forsyth", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z", "SUMMARY:" + icsEscape(ev.title)];
    if (ev.start) {
      lines.push("DTSTART;TZID=America/New_York:" + icsDT(first, ev.start));
      lines.push("DTEND;TZID=America/New_York:" + icsDT(first, ev.finish || ev.start));
    } else {
      var endD = L.addDays(L.parseDate(ev.end || ev.date), 1);
      lines.push("DTSTART;VALUE=DATE:" + icsDate(first));
      lines.push("DTEND;VALUE=DATE:" + icsDate(L.dateKey(endD)));
    }
    var codes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    if (ev.weekly) lines.push("RRULE:FREQ=WEEKLY;BYDAY=" + ev.weekly.days.map(function (d) { return codes[d]; }).join(",") + ";UNTIL=" + icsDate(ev.weekly.until) + "T235959Z");
    if (ev.monthly) lines.push("RRULE:FREQ=MONTHLY;BYDAY=" + ev.monthly.nth.map(function (n) { return n + codes[ev.monthly.day]; }).join(",") + ";UNTIL=" + icsDate(ev.monthly.until) + "T235959Z");
    if (ev.extra) lines.push("RDATE;TZID=America/New_York:" + ev.extra.map(function (x) { return icsDT(x, ev.start); }).join(","));
    lines.push("LOCATION:" + icsEscape(ev.place), "DESCRIPTION:" + icsEscape(ev.desc + " Source: " + ev.source.url), "URL:" + ev.source.url, "END:VEVENT", "END:VCALENDAR");
    return lines.join("\r\n");
  }
  function downloadICS(ev) {
    var blob = new Blob([buildICS(ev)], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = ev.id + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    L.toast("Calendar file downloaded", "calendar-plus");
    L.track("ics_download", { event_id: ev.id });
  }

  // d is the date shown in the box. In the list view we also show the full schedule.
  function card(ev, d, listView) {
    var c = CAT[ev.cat];
    var res = ev.resource && L.byId(ev.resource);
    return '<li class="ev-card"' + (listView ? ' id="' + ev.id + '"' : "") + ' data-ev="' + ev.id + '">' +
      '<div class="datebox" aria-hidden="true"><div class="datebox__m">' + L.MON_SHORT[d.getMonth()].replace(".", "") + '</div><div class="datebox__d">' + d.getDate() + '</div><div class="datebox__w">' + L.DAY_SHORT[d.getDay()] + "</div></div>" +
      "<div><h3>" + esc(ev.title) + "</h3>" +
        '<div class="ev-card__meta"><span>' + icon("calendar") + esc(listView ? schedule(ev) : fmtDate(d, true)) + "</span><span>" + icon("clock") + esc(timeText(ev)) + "</span>" +
        "<span>" + icon("map-pin") + (res ? '<a href="resource.html?id=' + res.id + '">' + esc(ev.place) + "</a>" : esc(ev.place)) + "</span></div>" +
        "<p>" + esc(ev.desc) + "</p>" +
        '<div class="ev-card__foot"><span class="tag">' + esc(c.name) + "</span>" + statusBadge(ev) +
          '<button type="button" class="btn btn--sm btn--ghost" data-ics="' + ev.id + '">' + icon("calendar-plus") + "Add to calendar</button>" +
          '<span class="ev-card__src">Source: <a href="' + esc(ev.source.url) + '" target="_blank" rel="noopener">' + esc(ev.source.label) + "</a></span></div>" +
      "</div></li>";
  }

  var used = CATS.filter(function (c) { return EVENTS.some(function (e) { return e.cat === c.id; }); });
  $("[data-ev-cats]").innerHTML = '<button type="button" class="chip" data-cat="">All</button>' + used.map(function (c) {
    return '<button type="button" class="chip" data-cat="' + c.id + '">' + esc(c.short) + "</button>";
  }).join("");

  // month grid
  function renderMonth() {
    var first = new Date(state.y, state.m, 1), start = L.addDays(first, -first.getDay());
    var last = new Date(state.y, state.m + 1, 0), end = L.addDays(last, 6 - last.getDay());
    var occ = L.occurrences(start, end).filter(function (o) { return visible(o.ev); });
    var byDay = {};
    occ.forEach(function (o) { (byDay[o.key] = byDay[o.key] || []).push(o); });
    $("[data-month-label]").textContent = L.MONTHS[state.m] + " " + state.y;
    var html = '<div class="cal__head" aria-hidden="true">' + L.DAY_SHORT.map(function (d) { return "<div>" + d + "</div>"; }).join("") + '</div><div class="cal__grid">';
    for (var d = new Date(start); d <= end; d = L.addDays(d, 1)) {
      var k = L.dateKey(d), list = byDay[k] || [];
      var label = L.DAY_NAMES[d.getDay()] + ", " + L.MONTHS[d.getMonth()] + " " + d.getDate() + ": " + (list.length ? list.length + " event" + (list.length > 1 ? "s" : "") : "no events");
      html += '<button type="button" class="cal__day' + (d.getMonth() !== state.m ? " is-out" : "") + (+d === +today ? " is-today" : "") + '" data-day="' + k + '" aria-pressed="' + (k === state.day) + '" aria-label="' + label + '">' +
        '<span class="cal__num" aria-hidden="true">' + d.getDate() + '</span><span class="cal__evs" aria-hidden="true">' +
        list.slice(0, 3).map(function (o) { return '<span class="cal__ev" style="--c:' + CAT[o.ev.cat].color + '">' + (o.ev.start ? L.fmtTime(o.ev.start).replace(" ", "") + " " : "") + esc(o.ev.title) + "</span>"; }).join("") +
        (list.length > 3 ? '<span class="cal__more">+' + (list.length - 3) + " more</span>" : "") + "</span></button>";
    }
    $("[data-cal]").innerHTML = html + "</div>";
    renderDay();
  }
  function renderDay() {
    var d = L.parseDate(state.day);
    var occ = L.occurrences(d, d).filter(function (o) { return visible(o.ev); });
    $("[data-day-panel]").innerHTML = "<h3>" + L.DAY_NAMES[d.getDay()] + ", " + L.MONTHS[d.getMonth()] + " " + d.getDate() + "</h3>" +
      (occ.length ? '<ul class="ev-list">' + occ.map(function (o) { return card(o.ev, o.date); }).join("") + "</ul>" :
        '<p class="muted">Nothing on this day' + (state.cat ? " in this category" : "") + ". Try another date or the list view.</p>");
  }

  // list view shows each event once, sorted by its next date
  function renderList() {
    var horizon = L.addDays(today, 365);
    var next = {};
    L.occurrences(today, horizon).forEach(function (o) { if (!next[o.ev.id]) next[o.ev.id] = o.date; });
    var list = EVENTS.filter(visible).filter(function (e) { return next[e.id]; }).sort(function (a, b) { return next[a.id] - next[b.id]; });
    $("[data-list]").innerHTML = list.length ? '<ul class="ev-list">' + list.map(function (ev) {
      return card(ev, next[ev.id], true);
    }).join("") + "</ul>" : '<p class="muted">No upcoming events in this category.</p>';
    if (hash) {
      var el = document.getElementById(hash);
      if (el) { el.classList.add("is-target"); setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100); }
      hash = "";
    }
  }

  function render() {
    $all("[data-cat]", $("[data-ev-cats]")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === state.cat)); });
    $all("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === state.view)); });
    $("[data-month-view]").hidden = state.view !== "month";
    $("[data-list-view]").hidden = state.view !== "list";
    if (state.view === "month") renderMonth(); else renderList();
  }

  $all("[data-view]").forEach(function (b) { b.addEventListener("click", function () { state.view = b.getAttribute("data-view"); render(); }); });
  $("[data-ev-cats]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.getAttribute("data-cat"); render(); L.track("filter_apply", { filter: "category", value: state.cat || "all", surface: "events" });
  });
  $all("[data-month]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.m += +b.getAttribute("data-month");
      if (state.m < 0) { state.m = 11; state.y--; } if (state.m > 11) { state.m = 0; state.y++; }
      state.day = L.dateKey(new Date(state.y, state.m, 1)); renderMonth();
    });
  });
  $("[data-today]").addEventListener("click", function () { state.y = today.getFullYear(); state.m = today.getMonth(); state.day = L.dateKey(today); renderMonth(); });
  $("[data-cal]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-day]"); if (!b) return;
    state.day = b.getAttribute("data-day");
    var d = L.parseDate(state.day);
    if (d.getMonth() !== state.m) { state.y = d.getFullYear(); state.m = d.getMonth(); renderMonth(); }
    else { $all(".cal__day").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); renderDay(); }

    // jump down to that day's events
    var panel = $("[data-day-panel]");
    var reduce = document.documentElement.getAttribute("data-motion") === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.setAttribute("tabindex", "-1");
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ics]"); if (!b) return;
    var ev = EVENTS.filter(function (x) { return x.id === b.getAttribute("data-ics"); })[0];
    if (ev) downloadICS(ev);
  });

  // links like events.html#farmers-market on this same page
  window.addEventListener("hashchange", function () {
    var h = location.hash.replace("#", "");
    if (!EVENTS.some(function (e) { return e.id === h; })) return;
    hash = h; state.view = "list"; state.cat = ""; render();
  });

  render();
});
