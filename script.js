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

// End Sudil Script 




// Janani Script

// End Janani Script