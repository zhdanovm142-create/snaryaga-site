"use client";

import { useCallback, useSyncExternalStore, useRef, useState } from "react";

interface Props {
  /** Основное изображение (показывается по умолчанию) */
  src: string;
  /** Альтернативный текст */
  alt: string;
  /** Опциональное второе изображение (показывается при наведении внутри preview) */
  hoverSrc?: string;
  /** Дочерний контент — сама карточка/фото, на которую наводят курсор */
  children: React.ReactNode;
}

/**
 * Проверка поддержки hover (мышь, не тач). Через useSyncExternalStore —
 * корректно работает при SSR (getServerSnapshot=false) без hydration mismatch
 * и без setState-in-effect (правило react-hooks).
 */
function subscribeCanHover(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getCanHoverClient(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
function getCanHoverServer(): boolean {
  return false;
}

/**
 * HoverZoom — floating preview, следующий за курсором.
 *
 * При наведении на дочерний контент (children) рядом с курсором появляется
 * увеличенное изображение товара (260×260). Preview следует за курсором,
 * не выходит за пределы viewport. На тач-устройствах не активируется
 * (pointer: coarse → компонент просто не показывает preview).
 *
 * Используется в карточках каталога для быстрого просмотра товара
 * без открытия модалки.
 */
export default function HoverZoom({ src, alt, hoverSrc, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showHover, setShowHover] = useState(false);

  const canHover = useSyncExternalStore(
    subscribeCanHover,
    getCanHoverClient,
    getCanHoverServer
  );

  const onMove = useCallback((e: React.MouseEvent) => {
    const previewW = 260;
    const previewH = 260;
    const margin = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Желаемая позиция — правее и выше курсора.
    let x = e.clientX + margin;
    let y = e.clientY - previewH - margin;

    // Если справа не помещается — слева от курсора.
    if (x + previewW > vw - margin) {
      x = e.clientX - previewW - margin;
    }
    // Если сверху не помещается — ниже курсора.
    if (y < margin) {
      y = e.clientY + margin;
    }
    // Не выходим за правую/нижнюю границу.
    if (x + previewW > vw - margin) x = vw - previewW - margin;
    if (y + previewH > vh - margin) y = vh - previewH - margin;
    if (x < margin) x = margin;

    setPos({ x, y });
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => canHover && setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setShowHover(false);
      }}
      onMouseMove={(e) => {
        if (!canHover) return;
        onMove(e);
        setShowHover(true);
      }}
    >
      {children}

      {/* Floating preview — рендерится через портал в body, чтобы не
          обрезался overflow-контейнерами карточки. */}
      {active && canHover && (
        <div
          className="fixed z-[1500] pointer-events-none"
          style={{
            left: pos.x,
            top: pos.y,
            width: 260,
            height: 260,
            animation: "sn-hover-zoom-in 0.18s ease-out",
          }}
          role="presentation"
          aria-hidden="true"
        >
          <div className="relative w-full h-full bg-[var(--bg2)] border border-[var(--olive-dark)] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Основное фото */}
            <img
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
              style={{ opacity: showHover && hoverSrc ? 0 : 1 }}
            />
            {/* Второе фото (hover) — если есть, проявляется при движении курсора */}
            {hoverSrc && (
              <img
                src={hoverSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                style={{ opacity: showHover ? 1 : 0 }}
              />
            )}
            {/* Подпись-лейбл снизу */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-[rgba(0,0,0,0.9)] to-transparent">
              <div className="font-mono-brand text-[0.5rem] text-[var(--olive-light)] tracking-[1.5px] uppercase flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                </svg>
                {alt.slice(0, 32)}
              </div>
            </div>
            {/* Декоративные углы-«прицелы» */}
            <span className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[var(--olive)]" aria-hidden="true" />
            <span className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[var(--olive)]" aria-hidden="true" />
            <span className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[var(--olive)]" aria-hidden="true" />
            <span className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[var(--olive)]" aria-hidden="true" />
          </div>
        </div>
      )}
    </div>
  );
}
