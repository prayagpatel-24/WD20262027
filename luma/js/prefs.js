// Runs in <head> so saved display settings apply before the page draws.
(function () {
  var p = {};
  try { p = JSON.parse(localStorage.getItem("luma.prefs") || "{}"); } catch (e) {}
  var r = document.documentElement;
  if (p.scale) r.style.setProperty("--text-scale", p.scale);
  if (p.contrast) r.setAttribute("data-contrast", "high");
  if (p.links) r.setAttribute("data-links", "underline");
  if (p.spacing) r.setAttribute("data-spacing", "wide");
  if (p.font) r.setAttribute("data-font", "readable");
  if (p.images) r.setAttribute("data-images", "hide");
  if (p.theme === "dark") r.setAttribute("data-theme", "dark");
})();
