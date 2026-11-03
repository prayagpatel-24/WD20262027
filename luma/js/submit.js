// Submit page: the "Add a missing place" and "Report wrong info" forms.
// The forms don't have a server yet, so for now entries are saved in the browser.
document.addEventListener("DOMContentLoaded", function () {
  "use strict";
  var site = window.Luma, $ = site.$, $all = site.$all, esc = site.esc;

  $("#s-cat").insertAdjacentHTML("beforeend", site.categories.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + "</option>"; }).join(""));
  $("#r-res").insertAdjacentHTML("beforeend", site.resources.slice().sort(function (a, b) { return a.name.localeCompare(b.name); })
    .map(function (r) { return '<option value="' + r.id + '">' + esc(r.name) + "</option>"; }).join(""));

  // opened from a listing's "Something wrong?" link
  var pre = new URLSearchParams(location.search).get("report");
  if (pre && site.byId(pre)) $("#r-res").value = pre;

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
      var all = site.store("luma.submissions") || [];
      all.push({ kind: kind, data: data, at: new Date().toISOString() });
      site.store("luma.submissions", all);

      var wrap = form.closest("[data-form-wrap]");
      wrap.innerHTML = '<div class="success" tabindex="-1"><h3>Thanks, we got it.</h3><p class="muted">' +
        (kind === "suggest" ? "We'll look into " + esc(data.name) + " and add it once we've checked it." : "We'll double-check that listing and fix it if needed.") + "</p></div>";
      wrap.querySelector(".success").focus();
    });
  });
});
