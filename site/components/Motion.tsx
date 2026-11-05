"use client";

import { useEffect } from "react";

export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce) {
      reveals.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    reveals.forEach((el) => revealObserver.observe(el));

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("[data-index-link]"),
    );
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );

    if (!links.length || !sections.length) {
      return () => revealObserver.disconnect();
    }

    const setCurrent = (id: string | null) => {
      links.forEach((link) => {
        const active = link.dataset.indexLink === id;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return null;
}
