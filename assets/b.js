/* Concept B extras */
(function () {
  var ind = document.getElementById("p-ind"), ent = document.getElementById("p-ent");
  document.querySelectorAll(".storyS [data-tab]").forEach(function (b) {
    b.addEventListener("click", function () {
      ind.hidden = b.dataset.tab !== "ind"; ent.hidden = b.dataset.tab !== "ent";
      [ind, ent].forEach(function (r) { r.classList.add("in"); });
    });
  });
  function rail(id) { var r = document.getElementById(id); if (!r) return null; var v = [ind, ent].indexOf(r) > -1 ? (!ind.hidden ? ind : ent) : r; return v; }
  document.querySelectorAll("[data-rail-prev],[data-rail-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      var key = b.dataset.railPrev || b.dataset.railNext, dir = b.dataset.railNext ? 1 : -1;
      var r = key === "stories" ? (!ind.hidden ? ind : ent) : document.getElementById(key);
      var c = r.firstElementChild; if (!c) return;
      r.scrollBy({ left: dir * (c.getBoundingClientRect().width + 22), behavior: "smooth" });
    });
  });
  var gm = document.getElementById("gmap");
  document.querySelectorAll(".loc .lsel").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.closest(".loc");
      document.querySelectorAll(".loc").forEach(function (x) { x.classList.toggle("on", x === l); });
      gm.src = "https://maps.google.com/maps?q=" + l.dataset.map + "&z=16&output=embed";
    });
  });
  var ul = document.querySelector("[data-links]");
  if (ul) ul.addEventListener("click", function () { var on = document.body.classList.toggle("ul"); ul.setAttribute("aria-pressed", on); });
  var cb = document.querySelector(".cb"), cp = document.querySelector(".cp");
  if (cb) cb.addEventListener("click", function () { cp.hidden = !cp.hidden; cb.setAttribute("aria-expanded", !cp.hidden); });
})();
