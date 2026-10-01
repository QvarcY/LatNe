const header = document.querySelector(".site-header");

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  for (const item of revealItems) {
    revealObserver.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("visible");
  }
}

const setText = (selector, value) => {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = String(value);
  }
};

const applyProgress = (data) => {
  if (!data?.overall) return;

  const { done, total, percent } = data.overall;

  setText("[data-overall-percent]", percent);
  setText("[data-overall-done]", done);
  setText("[data-overall-total]", total);

  const root = document.querySelector("[data-progress-root]");
  const fill = document.querySelector("[data-progress-fill]");

  if (root) {
    root.setAttribute("aria-valuenow", String(percent));
  }

  if (fill) {
    requestAnimationFrame(() => {
      fill.style.width = `${percent}%`;
    });
  }

  for (const phase of data.phases ?? []) {
    const id = CSS.escape(String(phase.id));

    setText(`[data-phase-percent="${id}"]`, `${phase.percent}%`);
    setText(`[data-phase-done="${id}"]`, phase.done);
    setText(`[data-phase-total="${id}"]`, phase.total);

    const phaseFill = document.querySelector(
      `[data-phase-fill="${id}"]`
    );

    if (phaseFill) {
      requestAnimationFrame(() => {
        phaseFill.style.width = `${phase.percent}%`;
      });
    }
  }
};

const applyFallbackProgress = () => {
  requestAnimationFrame(() => {
    const overallFill = document.querySelector("[data-progress-fill]");

    if (overallFill) {
      overallFill.style.width = "30%";
    }

    const fallbacks = {
      "0": 63,
      "1": 50,
      "1A": 0,
      "2": 0
    };

    for (const [id, percent] of Object.entries(fallbacks)) {
      const fill = document.querySelector(
        `[data-phase-fill="${CSS.escape(id)}"]`
      );

      if (fill) {
        fill.style.width = `${percent}%`;
      }
    }
  });
};

fetch("./project-status.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Status request failed: ${response.status}`);
    }

    return response.json();
  })
  .then(applyProgress)
  .catch(() => {
    applyFallbackProgress();
  });
