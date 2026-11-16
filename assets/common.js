/* Tamkeen homepage concepts: shared behaviour */
(function () {
  var MOD = "M51.05,648.34l410.05-316.28c57.89-43.42,92.26-112.76,92.26-185.13V48.34L143.32,364.62c-57.89,43.42-92.26,112.76-92.26,185.13v98.59Z";
  var W = 502.31, H = 600;

  /* ---------- GrowthMark pattern (37deg grid, outline modules, one red module) ---------- */
  document.querySelectorAll(".pat").forEach(function (el) {
    var cols = +el.dataset.cols || 2, rows = +el.dataset.rows || 2;
    var stroke = el.dataset.stroke || "#fff", sw = el.dataset.sw || 2;
    var skip = (el.dataset.skip || "").split(";").filter(Boolean);
    var red = (el.dataset.red || "").split(","), fill = el.dataset.fill, stair = el.dataset.stair;
    var step = H * 0.975, out = "";
    function mod(c, r, st) {
      var x = c * W - 51.05, y = r * step - 48.34, t = 'transform="translate(' + x + ' ' + y + ')"';
      if (st === "r") return '<path d="' + MOD + '" ' + t + ' fill="#EF434D"/>';
      if (st === "f") return '<path d="' + MOD + '" ' + t + ' fill="' + (el.dataset.fill || "#fff") + '"/>';
      if (st === "g") return '<path d="' + MOD + '" ' + t + ' fill="' + (el.dataset.fill2 || "#fff") + '"/>';
      var col = st === "s" ? (el.dataset.stroke2 || "#6AA9DD") : stroke;
      return '<path d="' + MOD + '" ' + t + ' fill="none" stroke="' + col + '" stroke-width="' + sw + '" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>';
    }
    if (el.dataset.cells) {
      el.dataset.cells.split(";").forEach(function (s) { var p = s.split(":"), rc = p[0].split(","); out += mod(+rc[0], +rc[1], p[1] || "o"); });
    } else {
      for (var c = 0; c < cols; c++) for (var r = 0; r < rows; r++) {
        if (skip.indexOf(c + "," + r) > -1) continue;
        if (stair && c < cols - 1 - r) continue;
        out += mod(c, r, fill ? "f" : "o");
      }
      if (red.length === 2) out += mod(+red[0], +red[1], "r");
    }
    el.innerHTML = '<svg ' + (el.dataset.slice ? 'preserveAspectRatio="xMidYMid slice" ' : '') + 'viewBox="0 0 ' + cols * W + ' ' + ((rows - 1) * step + H) + '" aria-hidden="true" focusable="false">' + out + '</svg>';
  });

  /* ---------- Hero carousel ---------- */
  var hero = document.querySelector("[data-carousel]");
  if (hero) {
    var slides = [].slice.call(hero.querySelectorAll(".slide"));
    var dots = [].slice.call(hero.querySelectorAll("[data-go]"));
    var idx = 0, timer = null, paused = false, DUR = 7000;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pauseBtn = hero.querySelector("[data-pause]");
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("on", i === idx); s.setAttribute("aria-hidden", i !== idx); });
      dots.forEach(function (d, i) {
        d.classList.toggle("on", i === idx);
        d.setAttribute("aria-current", i === idx ? "true" : "false");
        var bar = d.querySelector("i"); if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
      });
      hero.style.setProperty("--dur", DUR + "ms");
    }
    function loop() { clearTimeout(timer); if (!paused && !reduce) timer = setTimeout(function () { show(idx + 1); loop(); }, DUR); }
    function setPaused(p) {
      paused = p; hero.classList.toggle("paused", p);
      if (pauseBtn) { pauseBtn.setAttribute("aria-pressed", p); pauseBtn.querySelector("span").textContent = p ? "Play" : "Pause"; }
      loop();
    }
    dots.forEach(function (d) { d.addEventListener("click", function () { show(+d.dataset.go); loop(); }); });
    var pv = hero.querySelector("[data-prev]"), nx = hero.querySelector("[data-next]");
    if (pv) pv.addEventListener("click", function () { show(idx - 1); loop(); });
    if (nx) nx.addEventListener("click", function () { show(idx + 1); loop(); });
    if (pauseBtn) pauseBtn.addEventListener("click", function () { setPaused(!paused); });
    hero.addEventListener("mouseenter", function () { clearTimeout(timer); hero.classList.add("hover"); });
    hero.addEventListener("mouseleave", function () { hero.classList.remove("hover"); loop(); });
    if (reduce) { paused = true; hero.classList.add("paused"); }
    show(0); loop();
  }

  /* ---------- Interactive Program Finder (placeholder logic) ---------- */
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
    var aud = "ind", need = "job";
    var chips = finder.querySelector("[data-chips]"), out = finder.querySelector("[data-results]");
    var audBtns = [].slice.call(finder.querySelectorAll("[data-aud]"));
    function render() {
      chips.innerHTML = Object.keys(D[aud]).map(function (k) {
        return '<button type="button" class="chip' + (k === need ? " on" : "") + '" data-need="' + k + '" aria-pressed="' + (k === need) + '">' + D[aud][k][0] + "</button>";
      }).join("");
      out.innerHTML = D[aud][need][1].map(function (p) {
        return '<a class="res" href="#"><small>' + p[1] + "</small><b>" + p[0] + '</b><span>View program <i aria-hidden="true">→</i></span></a>';
      }).join("");
      audBtns.forEach(function (b) { b.classList.toggle("on", b.dataset.aud === aud); b.setAttribute("aria-pressed", b.dataset.aud === aud); });
    }
    audBtns.forEach(function (b) { b.addEventListener("click", function () { aud = b.dataset.aud; need = Object.keys(D[aud])[0]; render(); }); });
    chips.addEventListener("click", function (e) { var t = e.target.closest("[data-need]"); if (t) { need = t.dataset.need; render(); } });
    render();
  }

  /* ---------- Generic tabs (success stories) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (g) {
    var btns = [].slice.call(g.querySelectorAll("[data-tab]"));
    var panes = [].slice.call(g.querySelectorAll("[data-pane]"));
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
        panes.forEach(function (p) { p.hidden = p.dataset.pane !== b.dataset.tab; });
      });
    });
  });

  /* ---------- Count-up + reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; io.unobserve(el); el.classList.add("in");
      el.querySelectorAll("[data-count]").forEach(function (n) {
        var to = parseFloat(n.dataset.count), dec = (n.dataset.count.split(".")[1] || "").length, t0 = null;
        function f(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1400, 1), v = to * (1 - Math.pow(1 - p, 3)); n.textContent = v.toFixed(dec); if (p < 1) requestAnimationFrame(f); }
        requestAnimationFrame(f);
      });
    });
  }, { threshold: 0.18 }) : null;
  document.querySelectorAll(".rv").forEach(function (el) { if (io) io.observe(el); else el.classList.add("in"); });

  /* ---------- Accessibility tools in header ---------- */
  var size = 100, root = document.documentElement;
  document.querySelectorAll("[data-fs]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = b.dataset.fs; size = d === "0" ? 100 : Math.max(85, Math.min(130, size + (+d)));
      root.style.fontSize = size + "%";
    });
  });
  var hc = document.querySelector("[data-contrast]");
  if (hc) hc.addEventListener("click", function () { var on = document.body.classList.toggle("hc"); hc.setAttribute("aria-pressed", on); });

  /* ---------- Poll, rating, newsletter ---------- */
  var poll = document.querySelector("[data-poll]");
  if (poll) poll.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = poll.querySelector("input:checked"); if (!v) return;
    var res = { "Career programs": 46, "Enterprise support": 31, "Training & upskilling": 23 };
    poll.innerHTML = '<p class="thanks">Thank you for voting.</p>' + Object.keys(res).map(function (k) {
      return '<div class="bar' + (k === v.value ? " me" : "") + '"><span>' + k + '</span><em style="--w:' + res[k] + '%"></em><b>' + res[k] + "%</b></div>";
    }).join("") + '<small class="mute">Sample results for the concept.</small>';
  });
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
  document.querySelectorAll("a[href='#']").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });
})();
