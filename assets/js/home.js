/* ==========================================================================
   LINUXIFY — home page motion
   Preloader boot log, hero line reveal, terminal typing, showcase tilt.
   Everything has a static fallback: no JS or reduced motion = full content.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var preloader = document.querySelector(".preloader");
  var heroTitle = document.querySelector(".hero__title");

  /* ---------- Hero line reveal ---------- */
  function heroIn() {
    if (!heroTitle) return;
    heroTitle.querySelectorAll(".line").forEach(function (line, i) {
      setTimeout(function () { line.classList.add("is-in"); }, i * 110);
    });
  }

  /* ---------- Preloader ---------- */
  var BOOT = [
    { t: "linuxify bootloader v0.1.0-alpha.15", cls: "" },
    { t: "[ OK ] mounted /data — app-private storage", cls: "ok" },
    { t: "[ OK ] verified ubuntu-base-24.04.5 (arm64) checksum", cls: "ok" },
    { t: "[ OK ] proot 5.1.107.96 — native linker shims ready", cls: "ok" },
    { t: "[ OK ] pty terminal: termux-emulator stack", cls: "ok" },
    { t: "starting userspace …", cls: "ac" }
  ];

  function killPreloader(fast) {
    if (!preloader) return;
    preloader.classList.add("is-done");
    var finish = function () {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      document.body.classList.remove("no-native-scroll");
      heroIn();
    };
    if (reduced || !window.gsap || fast) {
      preloader.style.display = "none";
      finish();
    } else {
      window.gsap.to(preloader, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut", onComplete: finish
      });
    }
  }

  if (preloader && !reduced) {
    document.body.classList.add("no-native-scroll");
    var logEl = preloader.querySelector(".preloader__log");
    var pctEl = preloader.querySelector(".preloader__pct");
    var barEl = preloader.querySelector(".preloader__bar-fill");
    var seen = false;
    try { seen = sessionStorage.getItem("linuxify-booted") === "1"; } catch (e) {}

    if (seen) {
      killPreloader(true);
    } else {
      var lineEls = [];
      BOOT.forEach(function (l) {
        var div = document.createElement("div");
        div.className = l.cls;
        div.textContent = "";
        logEl.appendChild(div);
        lineEls.push(div);
      });

      var D_TOTAL = 1900;             /* ms full boot */
      var t0 = performance.now();
      (function tick(now) {
        var p = Math.min(1, (now - t0) / D_TOTAL);
        var eased = 1 - Math.pow(1 - p, 3);
        var pct = Math.round(eased * 100);
        if (pctEl) pctEl.textContent = String(pct).padStart(3, "0");
        if (barEl) barEl.style.transform = "scaleX(" + eased + ")";

        var shown = Math.floor(eased * BOOT.length);
        for (var i = 0; i < shown; i++) {
          if (lineEls[i].textContent !== BOOT[i].t) lineEls[i].textContent = BOOT[i].t;
        }
        if (p < 1) { requestAnimationFrame(tick); }
        else {
          try { sessionStorage.setItem("linuxify-booted", "1"); } catch (e) {}
          setTimeout(function () { killPreloader(false); }, 220);
        }
      })(t0);

      /* absolute failsafe: never trap the user */
      setTimeout(function () { killPreloader(true); }, 4200);
    }
  } else {
    if (preloader) preloader.style.display = "none";
    if (heroTitle) heroTitle.querySelectorAll(".line").forEach(function (l) { l.classList.add("is-in"); });
  }

  /* ---------- Terminal typing ---------- */
  /* Script format: "P:" typed command, "O:" output line, "E:" end marker.
     Repeats forever with a pause between loops. */
  var SCRIPT_HERO = [
    ["P", "uname -m"],
    ["O", "aarch64"],
    ["P", "cat /etc/os-release | head -1"],
    ["O", "PRETTY_NAME=\"Ubuntu 24.04.5 LTS\""],
    ["P", "apt install -y python3"],
    ["O", "Setting up python3 (3.12.3-1ubuntu0.8) ..."],
    ["P", "python3 -c 'print(\"hello from android\")'"],
    ["O", "hello from android"],
    ["P", ""]
  ];

  var SCRIPT_SHOW = [
    ["P", "git clone https://github.com/you/notes-app"],
    ["O", "Cloning into 'notes-app'... done."],
    ["P", "cd notes-app && npm run dev"],
    ["O", "VITE ready on http://localhost:5173"],
    ["P", "# switch app — session keeps running"],
    ["O", "[background] notes-app: 0 errors, alive"],
    ["P", "# back? history is right where you left it"],
    ["O", "done. 14.2s total, 0 files lost."],
    ["P", ""]
  ];

  function runTerminal(termEl, script) {
    var body = termEl.querySelector(".term__body");
    if (!body) return;
    var caret = document.createElement("span");
    caret.className = "term__caret";

    function staticRender() {
      /* reduced motion: full transcript, no animation */
      body.innerHTML = "";
      script.forEach(function (step) {
        var div = document.createElement("div");
        if (step[0] === "P") {
          div.innerHTML = '<span class="p">$</span> <span class="w"></span>';
          div.querySelector(".w").textContent = step[1];
        } else {
          div.className = "d";
          div.textContent = step[1];
        }
        body.appendChild(div);
      });
      var end = document.createElement("div");
      end.innerHTML = '<span class="p">$</span> ';
      end.appendChild(caret.cloneNode());
      body.appendChild(end);
    }

    if (reduced) { staticRender(); return; }

    var started = false;
    function play() {
      if (started) return;
      started = true;
      var idx = 0, pos = 0;
      var cmdEl = null;

      function nextLine() {
        if (idx >= script.length) {
          setTimeout(function () {
            body.innerHTML = "";
            idx = 0; pos = 0; cmdEl = null;
            started = false;
            play();
          }, 4200);
          return;
        }
        var step = script[idx];
        var div = document.createElement("div");
        if (step[0] === "P") {
          div.innerHTML = '<span class="p">$</span> <span class="w"></span>';
          body.appendChild(div);
          cmdEl = div.querySelector(".w");
          cmdEl.appendChild(caret);
          pos = 0;
          typeCmd(step[1]);
        } else {
          div.className = "d";
          div.textContent = step[1];
          body.appendChild(div);
          idx++;
          setTimeout(nextLine, 140);
        }
        body.scrollTop = body.scrollHeight;
      }

      function typeCmd(cmd) {
        if (pos <= cmd.length) {
          cmdEl.firstChild.nodeValue = cmd.slice(0, pos);
          pos++;
          setTimeout(typeCmd, 26 + Math.random() * 42);
        } else {
          idx++;
          setTimeout(nextLine, 320);
        }
      }

      nextLine();
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { play(); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(termEl);
    } else {
      play();
    }
  }

  var heroTerm = document.getElementById("hero-term");
  if (heroTerm) runTerminal(heroTerm, SCRIPT_HERO);
  var showTerm = document.getElementById("showcase-term");
  if (showTerm) runTerminal(showTerm, SCRIPT_SHOW);

  /* ---------- Showcase tilt (desktop only) ---------- */
  if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (wrap) {
      var inner = wrap.querySelector(".term");
      if (!inner) return;
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = "rotateX(" + (-y * 5).toFixed(2) + "deg) rotateY(" + (x * 7).toFixed(2) + "deg)";
        inner.style.transition = "transform 0.12s linear";
      });
      wrap.addEventListener("mouseleave", function () {
        inner.style.transition = "transform 0.8s cubic-bezier(0.16,1,0.3,1)";
        inner.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  /* ---------- Hero glow parallax ---------- */
  var glow = document.querySelector(".hero__glow");
  if (glow && !reduced && typeof window.gsap !== "undefined" && window.ScrollTrigger) {
    window.gsap.to(glow, {
      yPercent: 22, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }
})();
