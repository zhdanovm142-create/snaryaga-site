"use client";

import { useState } from "react";

interface Props {
  /** Выбранный вариант (label + tint) передаётся наружу для заявки и tint-оверлея. */
  onVariantChange?: (variant: { label: string; tint: string }) => void;
  reversible?: boolean;
}

/**
 * Конфигуратор камуфляжа костюма «Бугор».
 *
 * Для односторонних костюмов — 2 варианта расцветки (Олива / Койот).
 * Для двусторонних (reversible) — 2 варианта пары сторон:
 *   Олива↔Койот (лес/поле), Олива↔Чёрный (лес/город).
 *
 * Выбор меняет tint-оверлей на изображении товара (через CSS overlay),
 * давая визуальную обратную связь. Выбранный вариант передаётся наружу
 * через onVariantChange — модалка добавит его в имя заявки.
 *
 * Не использует setState-in-effect: начальное состояние — первый вариант.
 */

interface Variant {
  id: string;
  label: string;
  desc: string;
  /** CSS-цвета для превью-оверлея (rgba для прозрачности). */
  swatch: { primary: string; secondary?: string };
  /** Tint-оверлей для изображения (hex с альфой). */
  tint: string;
}

const SOLID_VARIANTS: Variant[] = [
  {
    id: "olive",
    label: "Олива",
    desc: "Лес, трава, листва",
    swatch: { primary: "#5c6b3c" },
    tint: "rgba(92, 107, 60, 0.35)",
  },
  {
    id: "coyote",
    label: "Койот",
    desc: "Поле, сухостой, песок",
    swatch: { primary: "#8b7355" },
    tint: "rgba(139, 115, 85, 0.38)",
  },
];

const REVERSIBLE_VARIANTS: Variant[] = [
  {
    id: "olive-coyote",
    label: "Олива ↔ Койот",
    desc: "Лес / поле — универсал",
    swatch: { primary: "#5c6b3c", secondary: "#8b7355" },
    tint: "linear-gradient(110deg, rgba(92,107,60,0.35) 0%, rgba(92,107,60,0.35) 48%, rgba(139,115,85,0.38) 52%, rgba(139,115,85,0.38) 100%)",
  },
  {
    id: "olive-black",
    label: "Олива ↔ Чёрный",
    desc: "Лес / город — ночные задачи",
    swatch: { primary: "#5c6b3c", secondary: "#1a1a1a" },
    tint: "linear-gradient(110deg, rgba(92,107,60,0.35) 0%, rgba(92,107,60,0.35) 48%, rgba(26,26,26,0.55) 52%, rgba(26,26,26,0.55) 100%)",
  },
];

export default function SuitConfigurator({ onVariantChange, reversible }: Props) {
  const variants = reversible ? REVERSIBLE_VARIANTS : SOLID_VARIANTS;
  const [active, setActive] = useState(variants[0]);

  const select = (v: Variant) => {
    setActive(v);
    onVariantChange?.({ label: v.label, tint: v.tint });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[2px] uppercase">
          {reversible ? "Стороны костюма" : "Расцветка"}
        </div>
        <span className="text-[0.6rem] text-[var(--text3)] font-mono-brand tracking-[1px]">
          {active.desc}
        </span>
      </div>
      <div
        className="flex gap-2"
        role="radiogroup"
        aria-label="Выбор расцветки костюма"
      >
        {variants.map((v) => {
          const selected = active.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => select(v)}
              className={`group flex-1 flex items-center gap-3 p-3 border cursor-pointer transition-all duration-300 ${
                selected
                  ? "border-[var(--olive)] bg-[rgba(92,107,60,0.12)]"
                  : "border-[var(--border-brand)] bg-[var(--bg3)] hover:border-[var(--olive-dark)]"
              }`}
            >
              {/* Swatch */}
              <span
                className="relative w-8 h-8 flex-shrink-0 overflow-hidden border-2 transition-all duration-300"
                style={{
                  borderColor: selected ? "var(--olive-light)" : "var(--border-brand)",
                }}
              >
                <span
                  className="absolute inset-0"
                  style={{ backgroundColor: v.swatch.primary }}
                  aria-hidden="true"
                />
                {v.swatch.secondary && (
                  <span
                    className="absolute inset-y-0 right-0 w-1/2"
                    style={{ backgroundColor: v.swatch.secondary }}
                    aria-hidden="true"
                  />
                )}
              </span>
              {/* Label */}
              <span className="text-left min-w-0">
                <span
                  className={`block font-display text-[0.72rem] font-bold uppercase tracking-[0.3px] leading-tight ${
                    selected ? "text-[var(--olive-light)]" : "text-[var(--text2)]"
                  }`}
                >
                  {v.label}
                </span>
              </span>
              {selected && (
                <svg
                  className="flex-shrink-0 ml-auto text-[var(--olive-light)]"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Возвращает tint первого варианта — для инициализации в модалке. */
export function getInitialTint(reversible?: boolean): string {
  const variants = reversible ? REVERSIBLE_VARIANTS : SOLID_VARIANTS;
  return variants[0].tint;
}

export { SOLID_VARIANTS, REVERSIBLE_VARIANTS };
export type { Variant };
