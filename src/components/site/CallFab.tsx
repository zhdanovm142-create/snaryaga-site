"use client";

export default function CallFab() {
  return (
    <a
      href="tel:+79003004636"
      className="call-fab group fixed right-6 bottom-6 z-[1500] flex items-center gap-3 no-underline text-white"
      aria-label="Позвонить: +7 (900) 300-46-36"
    >
      <span className="hidden md:inline-block bg-[var(--bg2)] border border-[var(--olive)] py-2 px-[0.9rem] rounded-[3px] whitespace-nowrap text-[0.7rem] font-bold tracking-[1px] uppercase opacity-0 translate-x-[10px] transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0">
        Связаться с нами
        <b className="block text-[var(--olive-light)] font-mono-brand text-[0.8rem] tracking-normal">
          +7 (900) 300-46-36
        </b>
      </span>
      <span
        className="relative w-[60px] h-[60px] flex-shrink-0 bg-[var(--olive)] rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--olive-light)] group-hover:scale-105"
        style={{ animation: "sn-fab-pulse 2.4s ease-out infinite" }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-[26px] h-[26px] fill-white"
          aria-hidden="true"
          style={{ animation: "sn-fab-ring 2.4s ease-in-out infinite" }}
        >
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
        </svg>
        <span
          className="absolute inset-0 rounded-full border-2 border-[var(--olive-light)] opacity-0"
          style={{ animation: "sn-fab-wave 2.4s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full border-2 border-[var(--olive-light)] opacity-0"
          style={{ animation: "sn-fab-wave 2.4s ease-out infinite", animationDelay: "1.2s" }}
        />
      </span>
    </a>
  );
}
