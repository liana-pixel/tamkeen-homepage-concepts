/* Facelift behaviour: hero carousel, Program Finder (placeholder logic), stories rail, feedback, newsletter */
(function () {
  /* Hero carousel: 7s, pauses on hover/focus, dots + arrows (no separate pause button) */
  var hero = document.querySelector("[data-carousel]");
  if (hero) {
    var slides = [].slice.call(hero.querySelectorAll(".slide")), dots = [].slice.call(hero.querySelectorAll("[data-go]"));
    var idx = 0, timer = null, DUR = 7000, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("on", i === idx); s.setAttribute("aria-hidden", i !== idx); });
      dots.forEach(function (d, i) {
        d.classList.toggle("on", i === idx); d.setAttribute("aria-current", i === idx ? "true" : "false");
        var bar = d.querySelector("i"); if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
      });
      hero.style.setProperty("--dur", DUR + "ms");
    }
    function loop() { clearTimeout(timer); if (!reduce) timer = setTimeout(function () { show(idx + 1); loop(); }, DUR); }
    dots.forEach(function (d) { d.addEventListener("click", function () { show(+d.dataset.go); loop(); }); });
    hero.querySelector("[data-prev]").addEventListener("click", function () { show(idx - 1); loop(); });
    hero.querySelector("[data-next]").addEventListener("click", function () { show(idx + 1); loop(); });
    hero.addEventListener("mouseenter", function () { clearTimeout(timer); hero.classList.add("hover"); });
    hero.addEventListener("mouseleave", function () { hero.classList.remove("hover"); loop(); });
    show(0); loop();
  }

  /* Program Finder: placeholder content, logic to be refined after audience research */
  var finder = document.querySelector("[data-finder]");
  if (finder) {
    var D = {
      ind: {
        job: ["Find a job", [["National Employment Program", "Employment support"], ["Wage Increment Program", "Employment support"], ["Furas Program", "Employment support"]]],
        skill: ["Build new skills", [["Tamakkan Professional Development Program", "Career development"], ["AI Training Program", "Career development"], ["Specialized Training Program", "Career development"]]],
        lead: ["Grow as a leader", [["Qiyada Leadership Program", "Career development"], ["Apprenticeship Program", "Career development"]]],
        health: ["Work in healthcare", [["Medical Fellowship Program", "Career development"], ["Nursing Specializations", "Career development"], ["Nursing Bachelor’s Degree", "Career development"]]],
        own: ["Start on my own", [["Freelancers Support Initiative", "Enterprise support"], ["Riyada Business Accelerator Program", "Enterprise support"]]]
      },
      ent: {
        hire: ["Hire Bahrainis", [["Wage Increment Program", "Employment support"], ["Manpower Agencies Program", "Employment support"], ["National Employment Program", "Employment support"]]],
        fund: ["Finance my growth", [["SME Fund", "Enterprise support"], ["Financing Support Program", "Enterprise support"]]],
        digital: ["Go digital & AI", [["Digital Enablement & AI Program", "Enterprise support"], ["Digital Tools Program", "Enterprise support"]]],
        advice: ["Get expert advice", [["Advisory Program", "Enterprise support"], ["Specialized Training Program", "Enterprise support"]]],
        expo: ["Reach new markets", [["Events & Exhibitions", "Enterprise support"], ["Musanada", "Enterprise support"]]]
      }
    };
    var aud = "ind", need = "job", chips = finder.querySelector("[data-chips]"), out = finder.querySelector("[data-results]");
    var audBtns = [].slice.call(finder.querySelectorAll("[data-aud]"));
    function render() {
      chips.innerHTML = Object.keys(D[aud]).map(function (k) {
        return '<button type="button" class="chip' + (k === need ? " on" : "") + '" data-need="' + k + '" aria-pressed="' + (k === need) + '">' + D[aud][k][0] + "</button>";
      }).join("");
      out.innerHTML = D[aud][need][1].map(function (p) {
        return '<a class="res" href="#"><small>' + p[1] + "</small><b>" + p[0] + '</b><span>View program <i aria-hidden="true">→</i></span></a>';
      }).join("");
      audBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.aud === aud); });
    }
    audBtns.forEach(function (b) { b.addEventListener("click", function () { aud = b.dataset.aud; need = Object.keys(D[aud])[0]; render(); }); });
    chips.addEventListener("click", function (e) { var t = e.target.closest("[data-need]"); if (t) { need = t.dataset.need; render(); } });
    render();
  }

  /* Success stories rail arrows */
  var rail = document.getElementById("rail");
  document.querySelectorAll("[data-rail-prev],[data-rail-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      var c = rail.firstElementChild, dir = b.hasAttribute("data-rail-next") ? 1 : -1;
      rail.scrollBy({ left: dir * (c.getBoundingClientRect().width + 22), behavior: "smooth" });
    });
  });
  /* drag to scroll on desktop */
  if (rail) {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener("pointermove", function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 4) { moved = true; rail.style.scrollSnapType = "none"; rail.style.scrollBehavior = "auto"; } rail.scrollLeft = sl - d; });
    window.addEventListener("pointerup", function () { if (!down) return; down = false; rail.style.scrollSnapType = ""; rail.style.scrollBehavior = ""; });
    rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  /* Feedback */
  var rate = document.querySelector("[data-rate]");
  if (rate) {
    rate.querySelectorAll("[data-yn]").forEach(function (b) {
      b.addEventListener("click", function () {
        rate.querySelectorAll("[data-yn]").forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
        rate.querySelector(".more").hidden = false;
      });
    });
    rate.addEventListener("submit", function (e) { e.preventDefault(); rate.innerHTML = '<p class="thanks">Thank you. Your feedback helps us improve this website.</p>'; });
  }
  document.querySelectorAll("[data-news]").forEach(function (f) {
    f.addEventListener("submit", function (e) { e.preventDefault(); f.innerHTML = '<p class="thanks">You are subscribed. Welcome aboard.</p>'; });
  });

  /* Reveal */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".rv").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });
  document.querySelectorAll("a[href='#']").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });
})();
