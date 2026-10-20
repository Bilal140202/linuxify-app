/* ==========================================================================
   LINUXIFY — shared interactions
   Progressive enhancement: every feature degrades gracefully. If GSAP or
   Lenis fail to load, the page stays fully readable and static.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var hasST = hasGsap && typeof window.ScrollTrigger !== "undefined";
  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---------- Reveal fallback (no GSAP / reduced motion) ---------- */
  function revealAll() {
    document.querySelectorAll("[data-reveal], [data-reveal-line], [data-reveal-group] > *")
      .forEach(function (el) { el.classList.add("is-in"); });
  }
  if (reduced || !hasST) { if (!hasST) revealAll(); }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGsap) {
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }

  function scrollToTarget(target) {
    if (lenis) { lenis.scrollTo(target, { offset: -72 }); }
    else if (typeof target === "string") {
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  });

  /* ---------- Scroll reveals ---------- */
  if (!reduced && hasST) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      window.ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () { el.classList.add("is-in"); }
      });
    });
    document.querySelectorAll("[data-reveal-line]").forEach(function (el) {
      window.ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () { el.classList.add("is-in"); }
      });
    });
    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      kids.forEach(function (kid, i) {
        window.ScrollTrigger.create({
          trigger: group, start: "top 85%", once: true,
          onEnter: function () {
            setTimeout(function () { kid.classList.add("is-in"); }, i * 90);
          }
        });
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduced) {
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = "translate(" + (mx - 3) + "px," + (my - 3) + "px)";
      var half = ring.offsetWidth / 2;
      ring.style.transform = "translate(" + (rx - half) + "px," + (ry - half) + "px)";
      requestAnimationFrame(loop);
    })();

    var hoverSel = "a, button, [data-cursor]";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverSel)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverSel)) ring.classList.remove("is-hover");
    });
    document.addEventListener("mousedown", function () { ring.classList.add("is-press"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("is-press"); });
  }

  /* ---------- Magnetic elements ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = 0.28;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
        el.style.transform = "translate(0,0)";
        setTimeout(function () { el.style.transition = ""; }, 600);
      });
    });
  }

  /* ---------- Nav behaviour ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var lastY = 0;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle("is-scrolled", y > 24);
      if (y > lastY && y > 420 && !document.body.classList.contains("menu-open")) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".nav__burger");
  var menu = document.getElementById("mobile-menu");
  if (burger && menu) {
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (lenis) { open ? lenis.stop() : lenis.start(); }
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Accordions (capabilities + FAQ) ---------- */
  document.querySelectorAll("[data-acc]").forEach(function (group) {
    var single = group.getAttribute("data-acc") === "single";
    var items = group.querySelectorAll("[data-acc-item]");
    items.forEach(function (item) {
      var btn = item.querySelector("[data-acc-toggle]");
      var panel = item.querySelector("[data-acc-panel]");
      if (!btn || !panel) return;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        if (single) {
          items.forEach(function (other) {
            if (other === item) return;
            other.classList.remove("is-open");
            var ob = other.querySelector("[data-acc-toggle]");
            var op = other.querySelector("[data-acc-panel]");
            if (ob) ob.setAttribute("aria-expanded", "false");
            if (op) op.style.height = "0px";
          });
        }
        item.classList.toggle("is-open", !isOpen);
        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.style.height = !isOpen ? panel.scrollHeight + "px" : "0px";
      });
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.classList.add("copied");
        var label = btn.querySelector(".copy-label");
        if (label) { var old = label.textContent; label.textContent = "Copied";
          setTimeout(function () { label.textContent = old; btn.classList.remove("copied"); }, 1600); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* ---------- Marquee: duplicate track for seamless loop ---------- */
  document.querySelectorAll(".marquee__track").forEach(function (track) {
    var clone = track.innerHTML;
    track.insertAdjacentHTML("beforeend", clone);
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
