// Calendar page: month grid, category filter and "add to calendar" (.ics) downloads.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, icon = site.icon, esc = site.esc;
  var events = site.events, catById = site.catById, categories = site.categories;

  var today = site.startOfToday();
  var state = { cat: "", y: today.getFullYear(), m: today.getMonth(), day: site.dateKey(today) };

  function timeText(ev) { return ev.start ? site.fmtTime(ev.start) + (ev.finish ? " to " + site.fmtTime(ev.finish) : "") : "All day"; }
  function visible(ev) { return !state.cat || ev.cat === state.cat; }

  // calendar file (.ics) that Google, Apple and Outlook can all import
  function icsDate(s) { return s.replace(/-/g, ""); }
  function icsDT(dateStr, hhmm) { return icsDate(dateStr) + "T" + hhmm.replace(":", "") + "00"; }
  function icsEscape(s) { return String(s).replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }
  function buildICS(ev) {
    var first = ev.date || (ev.weekly && site.occurrences(site.parseDate(ev.weekly.from), site.parseDate(ev.weekly.until)).filter(function (o) { return o.ev.id === ev.id; })[0].key) ||
      site.occurrences(site.parseDate(ev.monthly.from), site.parseDate(ev.monthly.until)).filter(function (o) { return o.ev.id === ev.id; })[0].key;
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Luma Forsyth//Community Calendar//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + ev.id + "@luma-forsyth", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z", "SUMMARY:" + icsEscape(ev.title)];
    if (ev.start) {
      lines.push("DTSTART;TZID=America/New_York:" + icsDT(first, ev.start));
      lines.push("DTEND;TZID=America/New_York:" + icsDT(first, ev.finish || ev.start));
    } else {
      var endD = site.addDays(site.parseDate(ev.end || ev.date), 1);
      lines.push("DTSTART;VALUE=DATE:" + icsDate(first));
      lines.push("DTEND;VALUE=DATE:" + icsDate(site.dateKey(endD)));
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
    site.toast("Calendar file downloaded", "calendar-plus");
  }

  // weekly and monthly events get a dashed style in the grid
  function isRegular(ev) { return ev.status === "recurring"; }
  function repeatTag(ev) { return ev.weekly ? "Weekly" : "Monthly"; }
  var ORD = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", "-1": "last" };
  function schedule(ev) {
    if (ev.weekly) return "Every " + ev.weekly.days.map(function (d) { return site.DAY_NAMES[d]; }).join(" and ") + " through " + site.MON_SHORT[site.parseDate(ev.weekly.until).getMonth()] + " " + site.parseDate(ev.weekly.until).getDate();
    return "The " + ev.monthly.nth.map(function (n) { return ORD[n]; }).join(" and ") + " " + site.DAY_NAMES[ev.monthly.day] + " of each month";
  }

  function item(ev) {
    var c = catById[ev.cat];
    var res = ev.resource && site.byId(ev.resource);
    var rep = isRegular(ev);
    return '<li class="ev' + (rep ? " ev--repeat" : "") + '" data-ev="' + ev.id + '">' +
      '<p class="ev__when">' + esc(timeText(ev)) + (rep ? ' <span class="repeat-tag">' + repeatTag(ev) + "</span>" : "") + "</p>" +
      "<h3>" + esc(ev.title) + (ev.status === "tentative" ? ' <span class="projected">Projected</span>' : "") + "</h3>" +
      (rep ? '<p class="ev__place">' + esc(schedule(ev)) + "</p>" : "") +
      '<p class="ev__place">' + (res ? '<a href="resource.html?id=' + res.id + '">' + esc(ev.place) + "</a>" : esc(ev.place)) + " &middot; " + esc(c.name) + "</p>" +
      '<p class="ev__desc">' + esc(ev.desc) + "</p>" +
      '<p class="ev__foot"><button type="button" class="link-btn" data-ics="' + ev.id + '">' + icon("calendar-plus", "icon--sm") + "Add to calendar</button>" +
        '<span class="ev__src">Source: <a href="' + esc(ev.source.url) + '" target="_blank" rel="noopener">' + esc(ev.source.label) + "</a></span></p>" +
    "</li>";
  }

  var used = categories.filter(function (c) { return events.some(function (e) { return e.cat === c.id; }); });
  $("[data-ev-cats]").innerHTML = '<button type="button" data-cat="">All</button>' + used.map(function (c) {
    return '<button type="button" data-cat="' + c.id + '">' + esc(c.short) + "</button>";
  }).join("");

  function dayOrder(a, b) { return isRegular(a.ev) - isRegular(b.ev); }

  function renderMonth() {
    var first = new Date(state.y, state.m, 1), start = site.addDays(first, -first.getDay());
    var last = new Date(state.y, state.m + 1, 0), end = site.addDays(last, 6 - last.getDay());
    var found = site.occurrences(start, end).filter(function (o) { return visible(o.ev); });
    var byDay = {};
    found.forEach(function (o) { (byDay[o.key] = byDay[o.key] || []).push(o); });
    $("[data-month-label]").textContent = site.MONTHS[state.m] + " " + state.y;
    var html = '<div class="cal__head" aria-hidden="true">' + site.DAY_SHORT.map(function (d) { return "<div>" + d + "</div>"; }).join("") + '</div><div class="cal__grid">';
    for (var d = new Date(start); d <= end; d = site.addDays(d, 1)) {
      var k = site.dateKey(d), list = (byDay[k] || []).sort(dayOrder);
      var label = site.DAY_NAMES[d.getDay()] + ", " + site.MONTHS[d.getMonth()] + " " + d.getDate() + (+d === +today ? ", today" : "") + ": " + (list.length ? list.length + " event" + (list.length > 1 ? "s" : "") : "no events");
      html += '<button type="button" class="cal__day' + (d.getMonth() !== state.m ? " is-out" : "") + (+d === +today ? " is-today" : "") + '" data-day="' + k + '" aria-pressed="' + (k === state.day) + '" aria-label="' + label + '">' +
        '<span class="cal__num" aria-hidden="true">' + d.getDate() + "</span>" +
        (list.length ? '<span class="cal__evs" aria-hidden="true">' + list.slice(0, 3).map(function (o) {
          var rep = isRegular(o.ev);
          return '<span class="cal__ev' + (rep ? " cal__ev--repeat" : "") + '">' + (o.ev.start ? '<span class="cal__time">' + site.fmtTime(o.ev.start) + "</span> " : "") + esc(o.ev.title) +
            (rep ? ' <span class="repeat-tag">' + repeatTag(o.ev) + "</span>" : "") + "</span>";
        }).join("") + (list.length > 3 ? '<span class="cal__more">' + (list.length - 3) + " more</span>" : "") + "</span>" : "") + "</button>";
    }
    $("[data-cal]").innerHTML = html + "</div>";
    renderDay();
  }
  function renderDay() {
    var d = site.parseDate(state.day);
    var found = site.occurrences(d, d).filter(function (o) { return visible(o.ev); }).sort(dayOrder);
    $("[data-day-panel]").innerHTML = "<h2>" + site.DAY_NAMES[d.getDay()] + ", " + site.MONTHS[d.getMonth()] + " " + d.getDate() + "</h2>" +
      (found.length ? '<ul class="ev-list">' + found.map(function (o) { return item(o.ev); }).join("") + "</ul>" :
        '<p class="muted">Nothing on this day' + (state.cat ? " in this category" : "") + ". Try another date.</p>");
  }

  function render() {
    $all("[data-cat]", $("[data-ev-cats]")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === state.cat)); });
    renderMonth();
  }

  function jumpTo(el) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    if (el.getBoundingClientRect().top > window.innerHeight * .6 || el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  $("[data-ev-cats]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.getAttribute("data-cat"); render();
  });
  $all("[data-month]").forEach(function (b) {
    b.addEventListener("click", function () {
      state.m += +b.getAttribute("data-month");
      if (state.m < 0) { state.m = 11; state.y--; } if (state.m > 11) { state.m = 0; state.y++; }
      state.day = site.dateKey(new Date(state.y, state.m, 1)); renderMonth();
    });
  });
  $("[data-today]").addEventListener("click", function () { state.y = today.getFullYear(); state.m = today.getMonth(); state.day = site.dateKey(today); renderMonth(); });
  $("[data-cal]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-day]"); if (!b) return;
    state.day = b.getAttribute("data-day");
    var d = site.parseDate(state.day);
    if (d.getMonth() !== state.m) { state.y = d.getFullYear(); state.m = d.getMonth(); renderMonth(); }
    else { $all(".cal__day").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); renderDay(); }
    jumpTo($("[data-day-panel]"));
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ics]"); if (!b) return;
    var ev = events.filter(function (x) { return x.id === b.getAttribute("data-ics"); })[0];
    if (ev) downloadICS(ev);
  });

  // Links like calendar.html#election-day open that event's next date.
  // If it has already ended, they open its last date.
  function openFromHash() {
    var id = location.hash.replace("#", "");
    var ev = events.filter(function (e) { return e.id === id; })[0];
    if (!ev) return;
    $all(".ev.is-target").forEach(function (x) { x.classList.remove("is-target"); });
    var mine = function (o) { return o.ev.id === id; };
    var o = site.occurrences(today, site.addDays(today, 730)).filter(mine)[0] || site.occurrences(site.addDays(today, -730), today).filter(mine).pop();
    if (!o) return;
    state.cat = ""; state.day = o.key; state.y = o.date.getFullYear(); state.m = o.date.getMonth();
    render();
    var el = $('.ev[data-ev="' + id + '"]');
    if (el) { el.classList.add("is-target"); jumpTo(el); }
  }
  window.addEventListener("hashchange", openFromHash);

  render();
  openFromHash();
});
