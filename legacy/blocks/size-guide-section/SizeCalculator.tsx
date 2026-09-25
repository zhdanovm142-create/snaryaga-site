"use client";

import { useMemo, useState } from "react";

/**
 * Интерактивный калькулятор размера костюма «Бугор».
 *
 * Пользователь вводит рост и обхват груди — компонент подбирает подходящий
 * размер по сетке. Логика: берём БОЛЬШИЙ размер из двух замеров (костюм
 * надевается поверх разгрузки — нужна свобода). Если показатель между
 * размерами — тоже больший.
 *
 * Встраивается в серверную секцию SizeGuide (через children/соседство).
 */

interface SizeRow {
  size: string;
  hMin: number;
  hMax: number;
  cMin: number;
  cMax: number;
}

// Та же сетка, что в SizeGuide.tsx, но в числовом виде для расчёта.
const SIZES: SizeRow[] = [
  { size: "S", hMin: 164, hMax: 170, cMin: 84, cMax: 90 },
  { size: "M", hMin: 170, hMax: 176, cMin: 90, cMax: 96 },
  { size: "L", hMin: 176, hMax: 182, cMin: 96, cMax: 104 },
  { size: "XL", hMin: 182, hMax: 188, cMin: 104, cMax: 112 },
  { size: "XXL", hMin: 188, hMax: 196, cMin: 112, cMax: 120 },
];

/** Найти размер по одному замеру: берём первый размер, чей верх >= значения. */
function sizeForMetric(value: number, key: "h" | "c"): string | null {
  if (!value || value <= 0) return null;
  for (const s of SIZES) {
    const max = key === "h" ? s.hMax : s.cMax;
    if (value <= max) return s.size;
  }
  // Выше сетки — XXL (индпошив по согласовании).
  return "XXL";
}

export default function SizeCalculator() {
  const [height, setHeight] = useState("");
  const [chest, setChest] = useState("");

  const result = useMemo(() => {
    const h = parseInt(height, 10);
    const c = parseInt(chest, 10);
    if (!h && !c) return null;

    const hSize = sizeForMetric(h, "h");
    const cSize = sizeForMetric(c, "c");

    // Берём больший из двух (для свободы поверх разгрузки).
    const order = ["S", "M", "L", "XL", "XXL"];
    const idx = Math.max(
      hSize ? order.indexOf(hSize) : -1,
      cSize ? order.indexOf(cSize) : -1
    );
    if (idx < 0) return null;
    return order[idx];
  }, [height, chest]);

  const rowOf = (size: string) => SIZES.find((s) => s.size === size);

  return (
    <div className="reveal border border-[var(--border-brand)] bg-[var(--bg2)] p-6 sm:p-8 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 flex items-center justify-center bg-[var(--olive)] text-white font-mono-brand text-[0.7rem] font-bold">
          ⟲
        </div>
        <div>
          <div className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px]">
            Калькулятор размера
          </div>
          <div className="text-[0.72rem] text-[var(--text3)]">
            Введите рост и обхват груди — подберём размер автоматически
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)]">
            Рост, см
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={150}
            max={210}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="напр. 178"
            aria-label="Рост в сантиметрах"
            className="bg-[var(--bg3)] border border-[var(--border-brand)] text-[var(--text)] text-[0.95rem] font-mono-brand px-4 py-3 focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--text3)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)]">
            Обхват груди, см
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={80}
            max={130}
            value={chest}
            onChange={(e) => setChest(e.target.value)}
            placeholder="напр. 100"
            aria-label="Обхват груди в сантиметрах"
            className="bg-[var(--bg3)] border border-[var(--border-brand)] text-[var(--text)] text-[0.95rem] font-mono-brand px-4 py-3 focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--text3)]"
          />
        </label>
      </div>

      {/* Результат */}
      <div
        className={`flex items-center gap-4 p-4 border transition-all duration-300 ${
          result
            ? "border-[var(--olive)] bg-[rgba(92,107,60,0.12)]"
            : "border-[var(--border-brand)] bg-[var(--bg3)]"
        }`}
        aria-live="polite"
      >
        <div
          className={`w-14 h-14 flex-shrink-0 flex items-center justify-center font-mono-brand text-[1.3rem] font-bold border-2 transition-all duration-300 ${
            result
              ? "bg-[var(--olive)] border-[var(--olive)] text-white scale-100"
              : "bg-transparent border-[var(--border-brand)] text-[var(--text3)]"
          }`}
        >
          {result ?? "?"}
        </div>
        <div className="min-w-0">
          {result ? (
            <>
              <div className="font-display text-[1rem] font-bold uppercase tracking-[0.5px] text-[var(--olive-light)]">
                Рекомендуем: размер {result}
              </div>
              <div className="text-[0.78rem] text-[var(--text2)] leading-tight">
                {(() => {
                  const r = rowOf(result);
                  return r
                    ? `Рост ${r.hMin}–${r.hMax} см · Грудь ${r.cMin}–${r.cMax} см`
                    : "";
                })()}
                <br />
                <span className="text-[var(--text3)]">
                  * При пограничных замерах берём больший — костюм надевается поверх разгрузки.
                </span>
              </div>
            </>
          ) : (
            <div className="text-[0.82rem] text-[var(--text3)]">
              Заполните хотя бы одно поле — размер подберётся автоматически.
            </div>
          )}
        </div>
      </div>

      {(height || chest) && (
        <button
          type="button"
          onClick={() => {
            setHeight("");
            setChest("");
          }}
          className="mt-3 text-[0.65rem] uppercase tracking-[1px] text-[var(--text3)] hover:text-[var(--olive-light)] transition-colors bg-transparent border-none cursor-pointer"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
