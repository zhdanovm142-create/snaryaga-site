"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ленивое видео для статического экспорта.
 *
 * Проблема: <video autoPlay> в HTML начинает качать файл сразу при парсинге
 * страницы, даже если блок на 10 экранов ниже. Для tech-ir.mp4 (7 МБ) это
 * мегабайты трафика, которые не нужны посетителю, ещё не доскроллившему.
 *
 * Решение (фасад): контейнер с постером рендерится сразу (серверный HTML),
 * а сам <video> монтируется только при приближении блока к вьюпорту
 * (IntersectionObserver, rootMargin 300px — к моменту появления видео уже
 * начнёт играть). Дальше — стандартный цикл: играем, пока виден, пауза,
 * когда ушёл из вида (экономия батареи и CPU).
 *
 * Если IntersectionObserver недоступен (старые браузеры) — монтируем видео
 * сразу: деградация до прежнего поведения.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  ariaLabel,
}: {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // null = ещё не решено; true = можно монтировать <video>
  const [canMount, setCanMount] = useState<boolean | null>(null);

  const startIfVisible = useCallback(() => {
    setCanMount(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || canMount) return;

    if (!("IntersectionObserver" in window)) {
      // Разовый размонтируемый фолбэк: старый браузер без IO — монтируем
      // видео немедленно. setState в effect здесь осознанный (см. доку выше).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startIfVisible();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            startIfVisible();
            observer.disconnect();
          }
        });
      },
      // 300px запас: видео успевает прогрузиться до того, как посетитель
      // докрутит до блока — постер не мигает на экране.
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [canMount, startIfVisible]);

  // Пауза, когда блок ушёл из вьюпорта (после монтирования).
  useEffect(() => {
    if (!canMount) return;
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (v.paused) v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [canMount]);

  return (
    <div ref={wrapRef} className={className}>
      {canMount && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={ariaLabel}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
