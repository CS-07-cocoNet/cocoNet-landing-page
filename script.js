/*
  cocoNet INTERACTIONS
  ------------------------------------------------------------
  - Updates the footer year.
  - Opens/closes the responsive mobile navigation.
  - Toggles light/dark theme and remembers the choice if storage is allowed.
  No libraries or build tools are required.
*/
(() => {
  "use strict";

  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  const themeButton = document.querySelector(".theme-toggle");
  const year = document.getElementById("current-year");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  // Automatically keep the copyright year current.
  if (year) year.textContent = String(new Date().getFullYear());

  // Storage can be disabled in some browser modes, so always guard localStorage access.
  const storedTheme = (() => {
    try { return localStorage.getItem("coconet-theme"); }
    catch (_) { return null; }
  })();

  // Use saved choice first; otherwise respect the visitor's operating-system preference.
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : (prefersDark ? "dark" : "light"));

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (themeButton) {
      const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      themeButton.setAttribute("aria-label", nextLabel);
      themeButton.setAttribute("title", nextLabel);
    }
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0d1511" : "#07543d");
  }

  // Theme toggle remains functional even if localStorage is blocked.
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      try { localStorage.setItem("coconet-theme", nextTheme); }
      catch (_) { /* Theme still works for this page view if storage is unavailable. */ }
    });
  }

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const opening = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(opening));
      menuButton.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
      navigation.classList.toggle("is-open", opening);
    });

    // Close the mobile menu after choosing a destination.
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    // Escape closes the menu and returns keyboard focus to the menu button.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });

    // Close the menu if the visitor clicks outside it.
    document.addEventListener("click", (event) => {
      if (navigation.classList.contains("is-open") &&
          !navigation.contains(event.target) &&
          !menuButton.contains(event.target)) {
        closeMenu();
      }
    });

    // If the viewport changes to desktop size, reset the mobile menu state.
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const onBreakpointChange = (event) => { if (event.matches) closeMenu(); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onBreakpointChange);
    else if (desktopQuery.addListener) desktopQuery.addListener(onBreakpointChange);
  }

  // Add a slim reading-progress line below the sticky header.
  const header = document.querySelector(".site-header");
  if (header && !header.querySelector(".nav-progress")) {
    const progress = document.createElement("div");
    progress.className = "nav-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = '<span class="nav-progress-fill"></span>';
    header.appendChild(progress);
  }
  const progressFill = document.querySelector(".nav-progress-fill");

  function updateScrollProgress() {
    if (!progressFill) return;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  // Highlight the navigation link for the section currently in view.
  // This activates automatically when the team adds sections with matching IDs.
  const sectionLinks = Array.from(document.querySelectorAll(
    '.primary-navigation a[href^="#"]:not(.nav-cta)'
  ));
  const linkedSections = sectionLinks
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return { link, section: id ? document.getElementById(id) : null };
    })
    .filter((item) => item.section);

  function setActiveSection(activeSection) {
    sectionLinks.forEach((link) => {
      const active = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
      link.classList.toggle("is-active", Boolean(active));
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && linkedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActiveSection(visible[0].target);
    }, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.15, 0.3, 0.5, 0.75]
    });

    linkedSections.forEach(({ section }) => sectionObserver.observe(section));
  }

  // If a visitor clicks a section link, highlight it immediately while scrolling.
  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) setActiveSection(target);
    });
  });

})();


// Anupama Script 



document.querySelectorAll(".coconet-faq .faq-card").forEach((card) => {
  const question = card.querySelector("h3");

  if (!question) return;

  question.setAttribute("tabindex", "0");
  question.setAttribute("role", "button");
  question.setAttribute("aria-expanded", "false");

  const isMobile = () => window.matchMedia("(hover: none)").matches;

  function setOpen(open) {
    card.classList.toggle("is-open", open);
    question.setAttribute("aria-expanded", String(open));
  }

  // Desktop: hover opens, leaving closes.
  card.addEventListener("mouseenter", () => {
    if (!isMobile()) setOpen(true);
  });

  card.addEventListener("mouseleave", () => {
    if (!isMobile()) setOpen(false);
  });

  // Mobile: tap toggles open/closed.
  question.addEventListener("click", () => {
    if (isMobile()) {
      setOpen(!card.classList.contains("is-open"));
    }
    // Desktop click intentionally does nothing.
  });

  // Keyboard support
  question.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (isMobile()) {
        setOpen(!card.classList.contains("is-open"));
      } else {
        // Desktop keyboard can toggle the answer.
        setOpen(!card.classList.contains("is-open"));
      }
    }
  });
});


// End Anupama Script 





// Isindu Script 

// End Isindu Script 




// Janith Script 
(() => {
  "use strict";

  /* 1. Procedural coconut-frond SVG generator */
  const scanEl = document.getElementById("scan");
  if (scanEl) {
    let seed = 7;
    // Scoped deterministic PRNG (does not override window.Math.random)
    const prng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const n = (a, b) => a + prng() * (b - a);

    const W = 304, H = 580;
    const greens = ["#4f7d2f", "#5f8f38", "#3f6b2a", "#6f9b42", "#7aa84a", "#35591f"];
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'
      + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fb25a"/><stop offset=".5" stop-color="#4a7a2e"/><stop offset="1" stop-color="#2b4a1c"/></linearGradient></defs>'
      + '<rect width="' + W + '" height="' + H + '" fill="url(#g)"/>';
    const x0 = -10, y0 = -20, x1 = 330, y1 = 640;

    for (let i = 0; i < 26; i++) {
      const t = i / 25, px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
      [-1, 1].forEach((d) => {
        const len = n(150, 230);
        const base = Math.atan2(y1 - y0, x1 - x0);
        const a = base + d * n(0.95, 1.25);
        const ex = px + Math.cos(a) * len, ey = py + Math.sin(a) * len;
        const mx = (px + ex) / 2 + n(-8, 8), my = (py + ey) / 2 + n(-8, 8), w = n(7, 11);
        s += '<path d="M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="' + greens[(i * 2 + (d > 0 ? 1 : 0)) % greens.length] + '" stroke-width="' + w.toFixed(1) + '" stroke-linecap="round" fill="none" opacity=".95"/>';
        s += '<path d="M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="#a9c97a" stroke-width="1" stroke-linecap="round" fill="none" opacity=".55"/>';
      });
    }
    s += '<path d="M' + x0 + ' ' + y0 + ' L' + x1 + ' ' + y1 + '" stroke="#c9d89a" stroke-width="5" opacity=".6"/>';
    [[118, 236, 9, 20, -28], [162, 254, 8, 22, -20], [132, 288, 7, 17, -30], [186, 300, 9, 18, -24], [104, 330, 6, 15, -26], [210, 238, 7, 16, -22]].forEach((l) => {
      s += '<g transform="translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[4] + ')"><ellipse rx="' + l[2] + '" ry="' + l[3] + '" fill="#b7b49f" stroke="#6b5a3c" stroke-width="2.5"/><ellipse rx="' + (l[2] - 3) + '" ry="' + (l[3] - 4) + '" fill="#d1ceb9" opacity=".7"/></g>';
    });
    s += '<rect width="' + W + '" height="' + H + '" fill="#0e2a14" opacity=".08"/></svg>';
    scanEl.innerHTML = s;
  }

  /* 2. Animated SVG flow connectors: 01 → 02 → 03 → 04 */
  const section = document.getElementById("how-it-works");
  if (!section) return;

  const sc = section.querySelector(".showcase");
  const svg = document.getElementById("flow");
  const phone = section.querySelector(".phone");
  const steps = Array.from(section.querySelectorAll(".step"));

  if (!sc || !svg || !phone || steps.length < 4) return;

  const NS = "http://www.w3.org/2000/svg";
  const mq = matchMedia("(max-width:1180px)");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)");
  let anims = [], raf = 0;
  const SPEED = 240, PAUSE = 1.2;

  function R(el) {
    const a = el.getBoundingClientRect(), b = sc.getBoundingClientRect();
    return {
      l: a.left - b.left,
      r: a.right - b.left,
      t: a.top - b.top,
      b: a.bottom - b.top,
      cx: (a.left + a.right) / 2 - b.left,
      cy: (a.top + a.bottom) / 2 - b.top
    };
  }

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function rounded(pts, r) {
    let d = "M" + pts[0][0] + " " + pts[0][1];
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1],
        v1 = [p0[0] - p1[0], p0[1] - p1[1]], v2 = [p2[0] - p1[0], p2[1] - p1[1]],
        l1 = Math.hypot(v1[0], v1[1]), l2 = Math.hypot(v2[0], v2[1]), rr = Math.min(r, l1 / 2, l2 / 2);
      d += " L" + (p1[0] + v1[0] / l1 * rr) + " " + (p1[1] + v1[1] / l1 * rr) + " Q" + p1[0] + " " + p1[1] + " " + (p1[0] + v2[0] / l2 * rr) + " " + (p1[1] + v2[1] / l2 * rr);
    }
    const e = pts[pts.length - 1];
    return d + " L" + e[0] + " " + e[1];
  }

  function draw() {
    anims.forEach((a) => a.cancel());
    anims = [];
    const old = svg.querySelector(".g");
    if (old) old.remove();
    const w = sc.offsetWidth, h = sc.offsetHeight;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);

    const c = steps.map(R), stacked = mq.matches;
    let starts = [], ends = [], paths = [];

    if (stacked) {
      for (let i = 0; i < 3; i++) {
        paths.push("M" + c[i].cx + " " + c[i].b + " L" + c[i + 1].cx + " " + c[i + 1].t);
        starts.push([c[i].cx, c[i].b]);
        ends.push([c[i + 1].cx, c[i + 1].t]);
      }
    } else {
      const off = 24, r = 14, ph = R(phone),
        x1 = (c[1].r + ph.l) / 2,
        x2 = (ph.r + c[2].l) / 2,
        yt = Math.max(8, Math.min(ph.t, c[2].t) - 16);
      /* 1 → 2: loop out of left edge and back in */
      paths.push(rounded([[c[0].l, c[0].cy], [c[0].l - off, c[0].cy], [c[1].l - off, c[1].cy], [c[1].l, c[1].cy]], r));
      /* 2 → 3: pass OVER the phone and drop into step 3 */
      paths.push(rounded([[c[1].r, c[1].cy], [x1, c[1].cy], [x1, yt], [x2, yt], [x2, c[2].cy], [c[2].l, c[2].cy]], r));
      /* 3 → 4: loop out of right edge and back in */
      paths.push(rounded([[c[2].r, c[2].cy], [c[2].r + off, c[2].cy], [c[3].r + off, c[3].cy], [c[3].r, c[3].cy]], r));
      starts = [[c[0].l, c[0].cy], [c[1].r, c[1].cy], [c[2].r, c[2].cy]];
      ends = [[c[1].l, c[1].cy], [c[2].l, c[2].cy], [c[3].r, c[3].cy]];
    }

    const g = el("g", { "class": "g" }), segs = [];
    paths.forEach((d) => g.appendChild(el("path", { d: d, "class": "track" })));
    paths.forEach((d) => g.appendChild(el("path", { d: d, "class": "base" })));
    paths.forEach((d) => {
      const glow = el("path", { d: d, "class": "glow" });
      const core = el("path", { d: d, "class": "core" });
      g.appendChild(glow);
      g.appendChild(core);
      segs.push([glow, core]);
    });
    starts.forEach((p) => g.appendChild(el("circle", { cx: p[0], cy: p[1], r: 5, "class": "node" })));
    svg.appendChild(g);

    /* Arrowheads aligned to end directions */
    const lens = segs.map((s) => s[1].getTotalLength());
    segs.forEach((s, i) => {
      const L = lens[i], p = s[1].getPointAtLength(L), q = s[1].getPointAtLength(L - 2),
        ang = Math.atan2(p.y - q.y, p.x - q.x) * 180 / Math.PI;
      g.appendChild(el("path", { d: "M-12 -7 L0 0 L-12 7 Z", "class": "arrow", transform: "translate(" + p.x + " " + p.y + ") rotate(" + ang + ")" }));
    });

    if (reduce.matches || !svg.animate) return;
    const total = lens.reduce((a, b) => a + b, 0) / SPEED + PAUSE;
    let t = 0;
    const C = stacked ? 50 : 90, arrivals = [0];

    segs.forEach((s, i) => {
      const L = lens[i], st = t / total;
      t += L / SPEED;
      const en = t / total;
      arrivals.push(en);
      const k = [];
      if (st > 0) {
        k.push({ offset: 0, opacity: 0, strokeDashoffset: C + "px" }, { offset: Math.max(st - .0005, 0), opacity: 0, strokeDashoffset: C + "px" });
      }
      k.push({ offset: st, opacity: 1, strokeDashoffset: C + "px" }, { offset: en, opacity: 1, strokeDashoffset: -L + "px" }, { offset: Math.min(en + .0005, 1), opacity: 0, strokeDashoffset: -L + "px" });
      if (en + .0005 < 1) k.push({ offset: 1, opacity: 0, strokeDashoffset: -L + "px" });
      s.forEach((path) => {
        path.style.strokeDasharray = C + "px " + (L + C) + "px";
        path.style.strokeDashoffset = C + "px";
        anims.push(path.animate(k, { duration: total * 1000, iterations: Infinity, easing: "linear" }));
      });
    });

    /* Badge pulse when the flow arrives at step */
    steps.forEach((stp, i) => {
      const nEl = stp.querySelector(".num");
      if (!nEl) return;
      const a = Math.min(arrivals[i] >= 1 ? 0 : arrivals[i], .9),
        on = "0 0 0 0 rgba(47,227,155,.85)", off_ = "0 0 0 14px rgba(47,227,155,0)", k = [];
      if (a > 0) k.push({ offset: 0, boxShadow: off_ }, { offset: Math.max(a - .0005, 0), boxShadow: off_ });
      k.push({ offset: a, boxShadow: on }, { offset: Math.min(a + .07, 1), boxShadow: off_ });
      if (a + .07 < 1) k.push({ offset: 1, boxShadow: off_ });
      anims.push(nEl.animate(k, { duration: total * 1000, iterations: Infinity, easing: "ease-out" }));
    });
  }

  function schedule() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener("resize", schedule);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(sc);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
})();
// End Janith Script





// Sudil Script 

// End Sudil Script 




// Janani Script

// End Janani Script