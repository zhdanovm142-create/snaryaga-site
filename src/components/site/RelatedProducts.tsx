"use client";

import { PRODUCTS, type Product } from "@/data/products";

interface Props {
  currentId: string;
  onSelect: (product: Product) => void;
}

/**
 * Блок «С этим товаром смотрят» — показывает до 3 других товаров из каталога
 * (исключая текущий). Используется в ProductDetailModal.
 *
 * Простая логика: берём все товары, кроме текущего, если их больше 3 —
 * берём первые 3. В будущем можно улучшить: по той же категории, по тегам и т.д.
 */
export default function RelatedProducts({ currentId, onSelect }: Props) {
  const related = PRODUCTS.filter((p) => p.id !== currentId).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="border-t border-[var(--border-brand)] p-6 sm:p-8 bg-[var(--bg2)]">
      <div className="font-mono-brand text-[0.62rem] text-[var(--olive)] tracking-[2px] uppercase mb-4 flex items-center gap-3">
        <span className="w-[24px] h-px bg-[var(--olive)]" />
        С этим товаром смотрят
      </div>
      <div className="grid grid-cols-3 gap-3">
        {related.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className="group text-left bg-[var(--bg3)] border border-[var(--border-brand)] p-3 cursor-pointer transition-all duration-300 hover:border-[var(--olive-dark)] hover:bg-[var(--bg2)]"
            aria-label={`Открыть ${p.name}`}
          >
            <div
              className="relative w-full aspect-[2/3] mb-2 overflow-hidden flex items-center justify-center bg-[var(--bg3)]"
            >
              <img
                src={p.images.main}
                alt={p.alt.main}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              {p.tag && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[var(--olive)] text-white text-[0.5rem] font-bold tracking-[0.5px] uppercase">
                  {p.tag}
                </span>
              )}
            </div>
            <div className="font-mono-brand text-[0.5rem] text-[var(--olive)] tracking-[1.5px] uppercase mb-0.5 truncate">
              {p.category}
            </div>
            <div className="font-display text-[0.75rem] font-bold uppercase tracking-[0.3px] leading-tight mb-1 truncate">
              {p.name}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono-brand text-[0.65rem] font-bold text-[var(--text2)]">
                {p.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
