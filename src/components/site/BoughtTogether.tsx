"use client";

import { useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";

interface Props {
  product: Product;
  onOrder: (name: string) => void;
  onSelectRelated?: (product: Product) => void;
}

/**
 * Блок «С этим товаром покупают» (cross-sell).
 *
 * Показывает текущий товар + до 2 сопутствующих (из product.boughtTogether)
 * в виде горизонтальной цепочки со знаком «+». Пользователь может отметить
 * чекбоксами, какие товары добавить, и заказать комплект одной кнопкой.
 *
 * Если у товара нет boughtTogether — компонент не рендерится.
 */

export default function BoughtTogether({ product, onOrder, onSelectRelated }: Props) {
  const relatedIds = product.boughtTogether ?? [];
  const related = relatedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  // Чекбоксы: текущий товар всегда выбран, сопутствующие — по умолчанию все.
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = { [product.id]: true };
    related.forEach((r) => {
      init[r.id] = true;
    });
    return init;
  });

  if (related.length === 0) return null;

  const allItems = [product, ...related];
  const selectedItems = allItems.filter((p) => checked[p.id]);

  const handleBundleOrder = () => {
    const names = selectedItems.map((p) => p.name);
    onOrder(`Комплект: ${names.join(" + ")}`);
  };

  const toggle = (id: string) => {
    if (id === product.id) return; // текущий товар нельзя убрать
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="border-t border-[var(--border-brand)] p-6 sm:p-8 bg-[var(--bg2)]">
      <div className="font-mono-brand text-[0.62rem] text-[var(--olive)] tracking-[2px] uppercase mb-4 flex items-center gap-3">
        <span className="w-[24px] h-px bg-[var(--olive)]" />
        С этим товаром покупают
        <span className="ml-auto text-[var(--text3)] text-[0.55rem] normal-case tracking-[1px]">
          соберите комплект и закажите одной кнопкой
        </span>
      </div>

      {/* Цепочка товаров */}
      <div className="flex items-stretch gap-2 flex-wrap sm:flex-nowrap">
        {allItems.map((p, idx) => {
          const isCurrent = p.id === product.id;
          const isChecked = checked[p.id];
          return (
            <div key={p.id} className="flex items-center gap-2 flex-1 min-w-[140px]">
              <div
                className={`relative flex-1 border p-3 cursor-pointer transition-all duration-300 ${
                  isChecked
                    ? "border-[var(--olive)] bg-[rgba(92,107,60,0.08)]"
                    : "border-[var(--border-brand)] bg-[var(--bg3)] opacity-50 hover:opacity-80"
                }`}
                onClick={() => toggle(p.id)}
                role="checkbox"
                aria-checked={isChecked}
                aria-label={`${isChecked ? "Включить в" : "Исключить из"} комплект: ${p.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(p.id);
                  }
                }}
              >
                {/* Чекбокс-индикатор */}
                <div
                  className={`absolute top-2 right-2 w-5 h-5 flex items-center justify-center border-2 text-[0.6rem] transition-all duration-300 ${
                    isChecked
                      ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                      : "bg-transparent border-[var(--border-brand)]"
                  }`}
                  aria-hidden="true"
                >
                  {isChecked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>

                {/* Миниатюра */}
                <div
                  className="relative w-full aspect-square mb-2 overflow-hidden bg-[var(--bg3)]"
                >
                  <img
                    src={p.images.main}
                    alt={p.alt.main}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>

                {/* Название */}
                <div className="font-mono-brand text-[0.5rem] text-[var(--olive)] tracking-[1.5px] uppercase mb-0.5 truncate">
                  {isCurrent ? "Основной" : "Сопутствующий"}
                </div>
                <div className="font-display text-[0.72rem] font-bold uppercase tracking-[0.3px] leading-tight mb-1 truncate">
                  {p.name.replace("Костюм ", "").replace("Рюкзак ", "")}
                </div>
                <div className="font-mono-brand text-[0.62rem] font-bold text-[var(--text2)]">
                  {p.price}
                </div>
              </div>

              {/* Знак «+» между товарами */}
              {idx < allItems.length - 1 && (
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[var(--olive-light)] font-mono-brand text-lg font-bold">
                  +
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Итоговая строка заказа комплекта */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 p-4 border border-[var(--olive-dark)] bg-[rgba(92,107,60,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[var(--olive)] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div>
            <div className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
              Выбрано товаров: <span className="text-[var(--olive-light)] font-bold">{selectedItems.length}</span>
            </div>
            <div className="text-[0.78rem] text-[var(--text2)] leading-tight">
              {selectedItems.length === allItems.length
                ? "Полный комплект"
                : selectedItems.length === 1
                  ? "Только основной товар"
                  : `${selectedItems.length} из ${allItems.length} товаров`}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBundleOrder}
          disabled={selectedItems.length === 0}
          className="py-2.5 px-6 bg-[var(--olive)] text-white border border-[var(--olive)] text-[0.65rem] font-bold tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Заказать комплект
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Подсказка: клик по сопутствующему товару открывает его детали */}
      {onSelectRelated && (
        <p className="mt-3 text-[0.6rem] text-[var(--text3)] text-center">
          * Кликните на миниатюру сопутствующего товара, чтобы посмотреть его детали.
          Чекбоксом отметьте, что включить в комплект.
        </p>
      )}
    </div>
  );
}
