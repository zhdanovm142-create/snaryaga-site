"use client";

import { useEffect, useState } from "react";

/**
 * Тонкая полоса прогресса чтения в самом верху страницы.
 * Высота 3px, цвет — оливковый с лёгким свечением.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1100] h-[4px] bg-[rgba(13,13,13,0.4)] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--olive)] via-[var(--olive-light)] to-[var(--olive-light)] transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 12px rgba(122, 143, 82, 0.9), 0 0 4px rgba(122, 143, 82, 1)",
        }}
      />
    </div>
  );
}
