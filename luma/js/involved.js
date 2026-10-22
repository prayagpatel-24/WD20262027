// Get Involved page: volunteer list with interest filters, plus the two small forms.
// The forms don't have a server yet, so for now entries are saved in the browser.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var L = window.Luma, $ = L.$, $all = L.$all, icon = L.icon, esc = L.esc;
  var TYPES = window.LUMA_VOLUNTEER_TYPES, OPPS = window.LUMA_VOLUNTEER;
  var picked = "";

  $("[data-vol-types]").innerHTML = '<button type="button" class="chip" data-type="" aria-pressed="true">All</button>' +
    TYPES.map(function (t) { return '<button type="button" class="chip" data-type="' + t.id + '" aria-pressed="false">' + esc(t.label) + "</button>"; }).join("");

  function renderVol() {
    var list = OPPS.filter(function (o) { return !picked || o.type === picked; });
    $all("[data-type]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-type") === picked)); });
    $("[data-vol-count]").innerHTML = "<strong>" + list.length + "</strong> " + (list.length === 1 ? "place" : "places") + " to help";
    $("[data-vol-list]").innerHTML = list.map(function (o) {
      var r = L.byId(o.resource);
      return '<article class="vol">' +
        '<div><h3><a href="resource.html?id=' + r.id + '">' + esc(r.name) + "</a></h3><p>" + esc(o.task) + "</p>" +
          '<div class="vol__tags">' + o.tags.map(function (g) { return '<span class="badge">' + esc(g) + "</span>"; }).join("") + "</div></div>" +
        '<div class="vol__actions">' +
          (r.web ? '<a class="btn btn--sm" href="' + esc(r.web) + '" target="_blank" rel="noopener">Website</a>' : "") +
          (r.phone ? '<a class="btn btn--sm btn--ghost" href="' + L.telHref(r.phone) + '">' + esc(r.phone) + "</a>" : "") +
        "</div></article>";
    }).join("");
  }
  $("[data-vol-types]").addEventListener("click", function (e) {
    var b = e.target.closest("[data-type]"); if (!b) return;
    picked = b.getAttribute("data-type"); renderVol();
  });
  renderVol();

  // fill the dropdowns
  $("#s-cat").insertAdjacentHTML("beforeend", L.CATS.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + "</option>"; }).join(""));
  $("#r-res").insertAdjacentHTML("beforeend", L.RES.slice().sort(function (a, b) { return a.name.localeCompare(b.name); })
    .map(function (r) { return '<option value="' + r.id + '">' + esc(r.name) + "</option>"; }).join(""));

  // opening this page from a listing's "Something wrong?" link
  var pre = new URLSearchParams(location.search).get("report");
  if (pre && L.byId(pre)) $("#r-res").value = pre;
  function openFromHash() {
    var box = location.hash && document.getElementById(location.hash.slice(1));
    if (box && box.tagName === "DETAILS") { box.open = true; box.scrollIntoView({ block: "start" }); }
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  function validContact(v) {
    v = v.trim();
    return /^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v) || v.replace(/\D/g, "").length === 10;
  }
  function check(field) {
    var input = $("input, select, textarea", field), v = input.value.trim(), ok = true;
    if (input.required && !v) ok = false;
    else if (input.name === "contact" && v) ok = validContact(v);
    else if (input.type === "email" && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    else if (input.minLength > 0 && v && v.length < input.minLength) ok = false;
    field.classList.toggle("has-error", !ok);
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  $all("[data-form]").forEach(function (form) {
    var fields = $all(".field", form).filter(function (f) { return f.querySelector(".error"); });
    fields.forEach(function (f) {
      var input = $("input, select, textarea", f);
      input.addEventListener("blur", function () { if (input.value) check(f); });
      input.addEventListener("input", function () { if (f.classList.contains("has-error")) check(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { $("input, select, textarea", bad[0]).focus(); return; }

      var kind = form.getAttribute("data-form"), data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      var all = L.store("luma.submissions") || [];
      all.push({ kind: kind, data: data, at: new Date().toISOString() });
      L.store("luma.submissions", all);
      L.track("form_submit", { form: kind });

      var wrap = form.closest("[data-form-wrap]");
      wrap.innerHTML = '<div class="success" tabindex="-1"><h3>Thanks, we got it.</h3><p class="muted">' +
        (kind === "suggest" ? "We'll look into " + esc(data.name) + " and add it once we've checked it." : "We'll double-check that listing and fix it if needed.") + "</p></div>";
      wrap.querySelector(".success").focus();
    });
  });
});
