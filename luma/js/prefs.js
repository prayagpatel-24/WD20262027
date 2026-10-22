// Runs in <head> so saved display settings apply before the page draws.
(function () {
  var p = {};
  try { p = JSON.parse(localStorage.getItem("luma.prefs") || "{}"); } catch (e) {}
  var r = document.documentElement;
  if (p.scale) r.style.setProperty("--text-scale", p.scale);
  if (p.contrast) r.setAttribute("data-contrast", "high");
  if (p.motion) r.setAttribute("data-motion", "reduce");
  if (p.links) r.setAttribute("data-links", "underline");
})();
