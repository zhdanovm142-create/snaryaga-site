"use client";

import { useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";

/**
 * Сравнение товаров: до 3 одновременно.
 * Пользователь выбирает товары чекбоксами, ниже строится таблица
 * со всеми характеристиками side-by-side.
 *
 * Используем только spec-данные из product.specs, чтобы быть устойчивым
 * к расширению каталога.
 */
export default function CompareTable() {
  const [selected, setSelected] = useState<string[]>([
    PRODUCTS[0]?.id ?? "",
    PRODUCTS[1]?.id ?? "",
    PRODUCTS[2]?.id ?? "",
  ].filter(Boolean));

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev; // лимит 3
      return [...prev, id];
    });
  };

  const selectedProducts: Product[] = PRODUCTS.filter((p) =>
    selected.includes(p.id)
  );

  // Собираем уникальные метки характеристик из всех выбранных товаров
  const specLabels: string[] = [];
  for (const p of selectedProducts) {
    for (const s of p.specs ?? []) {
      if (!specLabels.includes(s.label)) specLabels.push(s.label);
    }
  }

  const getSpecValue = (p: Product, label: string): string => {
    const found = p.specs?.find((s) => s.label === label);
    return found?.value ?? "—";
  };

  /** Извлекает первое число из строки («1,6 кг» → 1.6, «5–7 дней» → 5). */
  const numCompare = (s: string): number => {
    const m = s.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : Number.MAX_SAFE_INTEGER;
  };

  return (
    <section id="compare-products" className="sn-section">
      <header className="reveal mb-12">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Сравнение
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Сравните
            <br />
            характеристики
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Выберите до 3 товаров, чтобы сравнить их характеристики side-by-side.
            Поможет выбрать подходящий объём и комплектацию.
          </p>
        </div>
      </header>

      {/* Product picker */}
      <div className="reveal flex flex-wrap gap-2 mb-8">
        {PRODUCTS.map((p) => {
          const isSel = selected.includes(p.id);
          const disabled = !isSel && selected.length >= 3;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              disabled={disabled}
              aria-pressed={isSel}
              className={`flex items-center gap-2.5 px-4 py-2.5 border text-[0.72rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 ${
                isSel
                  ? "border-[var(--olive)] bg-[rgba(92,107,60,0.12)] text-[var(--olive-light)]"
                  : disabled
                    ? "border-[var(--border-brand)] text-[var(--text3)] cursor-not-allowed opacity-50"
                    : "border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive-dark)] hover:text-[var(--text)]"
              }`}
            >
              <span
                className={`w-4 h-4 border flex items-center justify-center text-[0.6rem] ${
                  isSel
                    ? "border-[var(--olive)] bg-[var(--olive)] text-white"
                    : "border-[var(--border-brand)]"
                }`}
              >
                {isSel ? "✓" : ""}
              </span>
              {p.name}
              {p.tag && (
                <span className="font-mono-brand text-[0.6rem] text-[var(--text3)] normal-case tracking-[0.5px]">
                  {p.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      {selectedProducts.length === 0 ? (
        <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-12 text-center">
          <div className="text-3xl mb-3 opacity-50">⇄</div>
          <div className="font-display text-[1.1rem] uppercase mb-2">
            Выберите товары для сравнения
          </div>
          <p className="text-[0.85rem] text-[var(--text3)]">
            Нажмите на карточки выше, чтобы добавить их в сравнение.
          </p>
        </div>
      ) : (
        <div className="reveal overflow-x-auto border border-[var(--border-brand)] bg-[var(--bg2)]">
          <table className="sn-compare-table w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-[var(--border-brand)]">
                <th className="text-left p-4 font-mono-brand text-[0.62rem] uppercase tracking-[2px] text-[var(--text3)] w-[160px] align-bottom">
                  Характеристика
                </th>
                {selectedProducts.map((p) => (
                  <th
                    key={p.id}
                    className="text-left p-4 align-bottom border-l border-[var(--border-brand)]"
                  >
                    <div className="font-mono-brand text-[0.6rem] text-[var(--olive)] tracking-[2px] uppercase mb-1">
                      {p.category}
                    </div>
                    <div className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px] leading-tight">
                      {p.name}
                    </div>
                    {p.tag && (
                      <span className="inline-block mt-2 px-2 py-[0.2rem] bg-[var(--olive)] text-white text-[0.55rem] font-bold tracking-[1px] uppercase">
                        {p.tag}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Цена */}
              <tr className="border-b border-[var(--border-brand)] hover:bg-[var(--bg3)] transition-colors">
                <td className="p-4 font-mono-brand text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] border-l-2 border-l-[var(--olive)]">
                  Цена
                </td>
                {selectedProducts.map((p) => (
                  <td
                    key={p.id}
                    className="p-4 border-l border-[var(--border-brand)] font-mono-brand text-[0.88rem] font-bold text-[var(--olive-light)]"
                  >
                    {p.price}
                  </td>
                ))}
              </tr>
              {/* Срок изготовления */}
              <tr className="border-b border-[var(--border-brand)] hover:bg-[var(--bg3)] transition-colors">
                <td className="p-4 font-mono-brand text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] border-l-2 border-l-[var(--olive)]">
                  Срок изготовления
                </td>
                {selectedProducts.map((p) => (
                  <td
                    key={p.id}
                    className="p-4 border-l border-[var(--border-brand)] text-[0.85rem]"
                  >
                    {p.leadTime ?? "—"}
                  </td>
                ))}
              </tr>
              {/* Все spec-строки */}
              {specLabels.map((label, sIdx) => (
                <tr
                  key={label}
                  className="border-b border-[var(--border-brand)] last:border-b-0 hover:bg-[rgba(138,162,92,0.12)] transition-colors"
                >
                  <td className="p-4 font-mono-brand text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] border-l-2 border-l-[var(--olive-dark)]">
                    {label}
                  </td>
                  {selectedProducts.map((p) => {
                    const val = getSpecValue(p, label);
                    const isBest =
                      val !== "—" &&
                      (label === "Вес" || label === "Срок изготовления") &&
                      selectedProducts.every((o) => {
                        const ov = getSpecValue(o, label);
                        if (ov === "—") return true;
                        return numCompare(val) <= numCompare(ov);
                      }) &&
                      selectedProducts.some(
                        (o) => getSpecValue(o, label) !== val
                      );
                    return (
                      <td
                        key={p.id}
                        className={`p-4 border-l border-[var(--border-brand)] text-[0.85rem] ${
                          isBest
                            ? "font-bold text-[var(--olive-light)] bg-[rgba(92,107,60,0.10)]"
                            : ""
                        }`}
                      >
                        {val}
                        {isBest && (
                          <span
                            className="ml-1.5 text-[0.55rem] uppercase tracking-[1px] text-[var(--olive)] font-mono-brand"
                            title="Лучший показатель"
                          >
                            ▼
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected.length === 3 && (
        <p className="text-[0.7rem] text-[var(--text3)] mt-3">
          * Достигнут максимум 3 товара в сравнении. Уберите один, чтобы добавить
          другой.
        </p>
      )}
    </section>
  );
}
