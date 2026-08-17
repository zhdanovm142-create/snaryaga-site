"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Целевое значение (для чисел) или строка-суффикс */
  value: string;
  label: string;
  /** Длительность анимации в мс */
  durationMs?: number;
  /** Иконка-эмодзи для отображения над числом */
  icon?: string;
}

/**
 * Анимированный счётчик-заглушка, который «набегает» от 0 до value при попадании
 * в зону видимости. Поддерживает числовые значения с опциональными префиксом/суффиксом
 * (напр. «-97%», «3-14», «30+», «IP67»).
 *
 * Для нечисловых значений (IP67) просто появляется с fade-in.
 */
export default function AnimatedStat({ value, label, durationMs = 1600, icon }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (started) return;
      setStarted(true);

      // Парсим: ищем числовую часть. Поддерживаем "-97", "3-14", "50", "IP67"
      const match = value.match(/^(-?[\d.]+)(.*)$/);
      if (!match) {
        // Не числовое (например, IP67) — просто показываем
        setDisplay(value);
        return;
      }

      const target = parseFloat(match[1]);
      const rest = match[2]; // суффикс (%, +, и т.д.)

      // Для диапазона «3-14» — анимируем только первую часть, потом добавляем остальное
      const rangeMatch = value.match(/^(-?[\d.]+)-(-?[\d.]+)(.*)$/);
      if (rangeMatch) {
        const a = parseFloat(rangeMatch[1]);
        const b = parseFloat(rangeMatch[2]);
        const suffix = rangeMatch[3];
        const startT = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - startT) / durationMs);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          const current = Math.round(a + (b - a) * eased);
          setDisplay(`${current}${suffix ? "" : ""}`);
          // Чтобы показывать диапазон в конце — добавляем вторую часть на финальном кадре
          if (p >= 1) {
            setDisplay(`${a}-${b}${suffix}`);
          } else {
            setDisplay(`${current}`);
          }
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        return;
      }

      const startT = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - startT) / durationMs);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        const current = Math.round(target * eased);
        setDisplay(`${current}${rest}`);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, durationMs, started]);

  return (
    <div ref={ref} className="reveal text-center group">
      {icon && (
        <div className="inline-flex items-center justify-center w-11 h-11 mb-3 bg-[rgba(92,107,60,0.1)] border border-[var(--olive-dark)] rounded-full text-xl transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:scale-110">
          {icon}
        </div>
      )}
      <div className="font-display text-[2.8rem] sm:text-[3.2rem] font-bold text-[var(--olive-light)] leading-none tabular-nums drop-shadow-[0_0_20px_rgba(92,107,60,0.3)]">
        {display}
      </div>
      <div className="text-[0.7rem] text-[var(--text3)] uppercase tracking-[2px] mt-2">
        {label}
      </div>
    </div>
  );
}
