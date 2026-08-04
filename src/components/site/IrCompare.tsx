"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Интерактивный слайдер «До / После» ИК-визуализации.
 *
 * Показывает два тепловизионных снимка (без защиты — яркий силуэт,
 * с защитой «Бугор» — силуэт невидим). Перетаскивая разделитель,
 * пользователь наглядно видит разницу.
 *
 * Управление: pointer-drag по дорожке, клик по дорожке, клавиши
 * ←/→ когда слайдер в фокусе, тач-жесты на мобильных.
 *
 * Изображения: /public/products/ir-before.png (яркий силуэт),
 * /public/products/ir-after.png (силуэт скрыт).
 */
export default function IrCompare() {
  const [pos, setPos] = useState(50); // 0..100 — позиция разделителя
  const wrapRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  // Pointer events (мышь + тач в одном API)
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  // Клавиатура: ←/→ сдвигают на 5%
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 5));
    }
  };

  // Сброс drag при уходе указителя за пределы окна
  useEffect(() => {
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  // Глобальный listener ←/→ — работает, когда слайдер в зоне видимости.
  // Не срабатывает, если фокус в input/textarea/select (как и шорткаты «?»).
  useEffect(() => {
    let inView = false;
    const el = wrapRef.current;
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                inView = e.isIntersecting;
              });
            },
            { threshold: 0.4 }
          )
        : null;
    if (el && observer) observer.observe(el);

    const onKey = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      e.preventDefault();
      setPos((p) =>
        e.key === "ArrowLeft" ? Math.max(0, p - 5) : Math.min(100, p + 5)
      );
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (el && observer) observer.unobserve(el);
    };
  }, []);

  return (
    <section id="ir-compare" className="sn-section !pt-0">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Демонстрация
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            До / после
            <br />
            в ИК-спектре
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Перетащите разделитель, чтобы увидеть, как костюм «Бугор»
            подавляет тепловую сигнатуру тела. Слева — без защиты (яркий
            силуэт на тепловизоре), справа — в экранирующем костюме (объект
            сливается с фоном).
          </p>
        </div>
      </header>

      <div
        ref={wrapRef}
        className="reveal relative w-full aspect-[16/9] overflow-hidden border border-[var(--border-brand)] bg-black select-none cursor-ew-resize touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Сравнение ИК-снимков до и после"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% — виден ${pos > 50 ? "левый край (без защиты)" : "правый край (с защитой)"}`}
      >
        {/* After (с защитой) — нижний слой, виден справа от разделителя */}
        <img
          src="/products/ir-after.png"
          alt="Тепловизор: объект в ИК-костюме Бугор — силуэт скрыт, сливается с фоном"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* HUD-подпись справа */}
        <div className="absolute top-4 right-4 z-[2] px-2.5 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive-dark)] font-mono-brand text-[0.58rem] text-[var(--olive-light)] tracking-[1.5px] uppercase pointer-events-none">
          ✓ С защитой «Бугор»
        </div>

        {/* Before (без защиты) — верхний слой, обрезается слева по разделителю */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src="/products/ir-before.png"
            alt="Тепловизор: объект без защиты — яркий тепловой силуэт чётко виден"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[#a85a3c] font-mono-brand text-[0.58rem] text-[#e8a07a] tracking-[1.5px] uppercase">
            ✗ Без защиты
          </div>
        </div>

        {/* Разделитель */}
        <div
          className="absolute top-0 bottom-0 z-[3] pointer-events-none"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          {/* Линия */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[var(--olive-light)] shadow-[0_0_12px_var(--olive)]" />
          {/* Рукоятка */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[rgba(13,13,13,0.85)] border-2 border-[var(--olive-light)] rounded-full backdrop-blur-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--olive-light)]">
              <path d="M15 18l-6-6 6-6" />
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {/* Подсказка снизу */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] pointer-events-none px-3 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--border-brand)] font-mono-brand text-[0.55rem] text-[var(--text3)] tracking-[1.5px] uppercase whitespace-nowrap">
          ← перетащите →
        </div>
      </div>

      {/* Метрики под слайдером */}
      <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)] mt-6">
        {[
          { v: "−97%", l: "Сигнатура тела" },
          { v: "3–14 мкм", l: "Диапазон блокировки" },
          { v: "0%", l: "Заметность на тепловизоре" },
          { v: "∞", l: "Время эффекта" },
        ].map((m) => (
          <div key={m.l} className="bg-[var(--bg2)] p-4 text-center">
            <div className="font-display text-[1.5rem] font-bold text-[var(--olive-light)] leading-none mb-1">
              {m.v}
            </div>
            <div className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
              {m.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
