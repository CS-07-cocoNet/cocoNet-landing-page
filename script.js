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

// End Anupama Script 





// Isindu Script 

// End Isindu Script 




// Janith Script 

// End Janith Script 





// Sudil Script 

/* ===== SUDIL: Farmer Stories slider =====
   1. Side-by-side slider: arrow buttons, mouse drag, touch swipe, counter.
   2. Cursor-proximity motion: cards drift sideways away from a NEAR cursor
      (no hover needed) with a soft green glow, then ease back to rest.
   Only touches markup inside #farmer-stories. No libraries. */
(() => {
  "use strict";

  const slider = document.querySelector("#farmer-stories [data-fs-slider]");
  if (!slider) return;

  const viewport = slider.querySelector("[data-fs-viewport]");
  const track = slider.querySelector("[data-fs-track]");
  const cards = Array.from(track ? track.children : []);
  const prevBtn = slider.querySelector(".fs-arrow--prev");
  const nextBtn = slider.querySelector(".fs-arrow--next");
  const counterCurrent = slider.querySelector(".fs-counter-current");
  const counterTotal = slider.querySelector(".fs-counter-total");
  if (!viewport || !track || cards.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (counterTotal) counterTotal.textContent = " / " + String(cards.length).padStart(2, "0");

  /* ---- 1. Entrance reveal (kept safe: cards stay visible without JS) ---- */
  slider.classList.add("fs-armed");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        slider.classList.add("fs-in");
        revealObserver.disconnect();
      }
    }, { threshold: 0.12 });
    revealObserver.observe(slider);
  } else {
    slider.classList.add("fs-in");
  }

  /* ---- 2. Slider: counter + arrows + drag-to-scroll ---- */
  let step = 0;
  let dragging = false;

  function measure() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    step = cards[0].getBoundingClientRect().width + gap;
  }

  function maxScroll() { return viewport.scrollWidth - viewport.clientWidth; }

  function currentIndex() {
    if (step <= 0) return 0;
    return Math.max(0, Math.min(Math.round(viewport.scrollLeft / step), Math.round(maxScroll() / step)));
  }

  function updateUI() {
    if (counterCurrent) counterCurrent.textContent = String(currentIndex() + 1).padStart(2, "0");
    if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= maxScroll() - 2;
  }

  function goTo(index) {
    const left = Math.max(0, Math.min(index * step, maxScroll()));
    viewport.scrollTo({ left, behavior: reduceMotion.matches ? "auto" : "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex() - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex() + 1));
  viewport.addEventListener("scroll", updateUI, { passive: true });
  window.addEventListener("resize", () => { measure(); updateUI(); });
  measure();
  updateUI();

  // Mouse drag-to-scroll (touch already scrolls natively).
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragMoved = false;

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" || maxScroll() <= 0) return;
    dragging = true;
    dragMoved = false;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 5) dragMoved = true;
    viewport.scrollLeft = dragStartScroll - delta;
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    goTo(currentIndex()); // settle on the nearest card
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("pointerleave", endDrag);
  viewport.addEventListener("click", (event) => {
    if (dragMoved) { event.preventDefault(); dragMoved = false; }
  }, true);

  /* ---- 3. Cursor-proximity sideways motion ----
     Within ~210px of a card's edge the card is gently pushed AWAY from the
     cursor (sideways), lifts a few pixels and tilts in 3D. Strength follows
     a smoothstep curve and everything is lerped in one rAF loop. */
  const PROXIMITY_RADIUS = 210;
  const MAX_SHIFT_X = 16;
  const MAX_LIFT = 5;
  const MAX_TILT = 2.4;
  const EASE = 0.14;

  const pointer = { x: 0, y: 0, active: false };
  let rafId = null;
  const cardState = cards.map(() => ({ x: 0, y: 0, ry: 0, glow: 0 }));

  function magnetFrame() {
    rafId = null;
    let settled = true;

    cards.forEach((card, i) => {
      const state = cardState[i];
      let tx = 0, ty = 0, tilt = 0, glow = 0;

      if (pointer.active && finePointer.matches && !reduceMotion.matches && !dragging) {
        const rect = card.getBoundingClientRect();
        if (rect.bottom > -PROXIMITY_RADIUS && rect.top < window.innerHeight + PROXIMITY_RADIUS) {
          const nx = Math.max(rect.left, Math.min(pointer.x, rect.right));
          const ny = Math.max(rect.top, Math.min(pointer.y, rect.bottom));
          const dist = Math.hypot(pointer.x - nx, pointer.y - ny);
          if (dist < PROXIMITY_RADIUS) {
            const t = 1 - dist / PROXIMITY_RADIUS;
            const force = t * t * (3 - 2 * t); // smoothstep ease-in-out
            const dir = pointer.x < rect.left + rect.width / 2 ? 1 : -1;
            tx = dir * force * MAX_SHIFT_X;
            ty = -force * MAX_LIFT;
            tilt = dir * force * MAX_TILT;
            glow = force;
          }
        }
      }

      state.x += (tx - state.x) * EASE;
      state.y += (ty - state.y) * EASE;
      state.ry += (tilt - state.ry) * EASE;
      state.glow += (glow - state.glow) * EASE;

      if (Math.abs(state.x) > 0.05 || Math.abs(state.y) > 0.05 ||
          Math.abs(state.ry) > 0.03 || Math.abs(state.glow) > 0.01) {
        settled = false;
      } else {
        state.x = state.y = state.ry = state.glow = 0;
      }

      card.style.setProperty("--fs-tx", state.x.toFixed(2) + "px");
      card.style.setProperty("--fs-ty", state.y.toFixed(2) + "px");
      card.style.setProperty("--fs-ry", state.ry.toFixed(3) + "deg");
      card.style.setProperty("--fs-glow", state.glow.toFixed(3));
    });

    if (!settled) rafId = requestAnimationFrame(magnetFrame);
  }

  const section = document.getElementById("farmer-stories");
  if (section) {
    section.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      if (rafId === null) rafId = requestAnimationFrame(magnetFrame);
    }, { passive: true });

    section.addEventListener("pointerleave", () => {
      pointer.active = false;
      if (rafId === null) rafId = requestAnimationFrame(magnetFrame);
    }, { passive: true });
  }
})();
// End Sudil Script 






// Janani Script

// End Janani Script