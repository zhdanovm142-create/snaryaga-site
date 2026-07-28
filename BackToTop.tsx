"use client";

import { useEffect, useState } from "react";

/**
 * Кнопка «Наверх» — появляется после 600px прокрутки, плавно скроллит наверх.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Наверх"
      className={`fixed left-6 bottom-6 z-[1500] w-11 h-11 bg-[var(--bg2)] border border-[var(--olive)] text-[var(--olive-light)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[var(--olive)] hover:text-white ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
      title="Наверх"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
