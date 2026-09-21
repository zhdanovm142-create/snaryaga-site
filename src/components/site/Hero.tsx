"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero с видео-фоном, IR-фильтром, scanlines, parallax-эффектом.
 *
 * Parallax: видео и оверлеи слегка смещаются при скролле (transform translateY),
 * создавая ощущение глубины.
 */
export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  // Видео проявляется только после реального старта воспроизведения (событие
  // «playing»): нет файла, медленная сеть или браузер заблокировал автоплей —
  // под видео всегда лежит постер, чёрной дыры не будет ни в каком сценарии.
  const [videoOn, setVideoOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Синхронизация после гидратации: автоплей в статическом HTML может
  // стартовать ДО того, как React повесит обработчик onPlaying (видео в кэше,
  // медленный JS) — нативное «playing» тогда потеряно, и videoOn навсегда
  // остался бы false (видео играет за opacity-0, посетитель видит постер).
  // Если видео уже играет на момент монтирования — проявляем его сразу.
  useEffect(() => {
    const v = videoRef.current;
    if (v && !v.paused && v.readyState >= 2) setVideoOn(true);
  }, []);

  // Parallax на скролле
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-end px-6 sm:px-12 pb-24 overflow-hidden"
      aria-label="Hero"
      style={{
        // Базовый слой: под видео и под постером. Если видео не загрузилось —
        // посетитель видит этот градиент (плюс постер), а не белый фон.
        background: "linear-gradient(135deg, #1a2010 0%, #0d0d0d 60%)",
      }}
    >
      {/* Video background (parallax: slow).

          Архитектура фолбэка: постер и видео лежат в общем контейнере с
          IR-фильтром и parallax-transform. Постер — нижний слой, виден всегда;
          видео — верхний слой с opacity:0 и проявляется только по событию
          «playing». Если /hero.mp4 отдает 404, видео так и останется
          прозрачным — посетитель видит постер, а не чёрный квадрат. */}
      <div
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto z-0"
        style={{
          filter:
            "invert(1) brightness(0.4) contrast(2) hue-rotate(120deg) saturate(3)",
          // БЕЗ mix-blend-mode: multiply — фон под видео почти чёрный (#0d0d0d),
          // multiply умножает каждый пиксель на ~5% яркости и видео превращается
          // в чёрный экран. IR-фильтр выше уже даёт нужную ночную эстетику.
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`,
        }}
      >
        {/* Постер — нижний слой, работает и без видео */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-poster.svg)" }}
          aria-hidden="true"
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoOn ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlaying={() => setVideoOn(true)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Scanlines (parallax: medium) */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.1) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.02), rgba(0,0,255,0.03))",
          backgroundSize: "100% 4px, 3px 100%",
          animation: "sn-scanline 8s linear infinite",
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      />

      {/* Dark gradient overlay (parallax: fast).

          ТОЛЬКО полупрозрачный градиент: нижний непрозрачный слой
          (#1a2010 → #0d0d0d) перенесён на фон самой section. Второй слой здесь
          делал весь оверлей глухим — видео под ним (z-0) было не видно вовсе. */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.1) 40%, rgba(13,13,13,0.95) 100%)",
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(92,107,60,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div
        className="relative z-[3] max-w-[800px] w-full"
        style={{
          transform: `translateY(${scrollY * -0.05}px)`,
          opacity: Math.max(0, 1 - scrollY / 600),
        }}
      >
        <div className="inline-flex items-center gap-2.5 font-mono-brand text-[0.7rem] text-[var(--olive-light)] tracking-[3px] uppercase mb-8 before:content-[''] before:w-10 before:h-px before:bg-[var(--olive)]">
          Маскировка нового поколения
        </div>
        <h1 className="font-display text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-2px] uppercase mb-8">
          Невидимость
          <br />
          <span className="text-[var(--olive-light)]">в ИК-спектре</span>
        </h1>
        <p className="text-[1.05rem] text-[var(--text2)] max-w-[520px] leading-[1.8] mb-8">
          Разрабатываем и производим экипировку из экранирующих тканей, снижающих
          заметность в инфракрасном диапазоне. Защита от тепловизионных средств
          наблюдения.
        </p>

        <div className="flex gap-4 flex-wrap">
          <a
            href="#products"
            className="group relative inline-flex items-center gap-2.5 py-4 px-10 bg-[var(--olive)] text-white border-none rounded-[2px] text-[0.75rem] font-bold tracking-[2px] uppercase cursor-pointer no-underline transition-all duration-300 hover:bg-[var(--olive-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--olive)] overflow-hidden"
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
              aria-hidden="true"
            />
            Каталог
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#tech"
            className="inline-flex items-center gap-2.5 py-4 px-10 bg-transparent text-[var(--text)] border border-[var(--border-brand)] rounded-[2px] text-[0.75rem] font-bold tracking-[2px] uppercase cursor-pointer no-underline transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] hover:-translate-y-0.5"
          >
            Технологии
          </a>
        </div>

        {/* Compact stat strip */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 max-w-[640px]">
          {[
            { v: "−97%", l: "ИК-сигнатура" },
            { v: "3–14", l: "мкм диапазон" },
            { v: "50+", l: "циклов стирки" },
            { v: "12", l: "моделей в каталоге" },
          ].map((s, i) => (
            <div
              key={s.l}
              className={`flex items-baseline gap-2 ${
                i > 0 ? "before:content-[''] before:w-px before:h-6 before:bg-[var(--border-brand)] before:-ml-4" : ""
              }`}
            >
              <span className="font-display text-[1.4rem] font-bold text-[var(--olive-light)] leading-none">
                {s.v}
              </span>
              <span className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 flex flex-col items-center gap-2 text-[0.6rem] tracking-[2px] uppercase text-[var(--text3)] z-[3] hidden md:flex">
        <div className="relative w-px h-[50px] bg-[var(--border-brand)] overflow-hidden">
          <div
            className="absolute top-[-100%] left-0 w-full h-full bg-[var(--olive)]"
            style={{ animation: "sn-scroll-down 2s infinite" }}
          />
        </div>
        Scroll
      </div>

      {/* Bottom fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent z-[2] pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
