"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface Props {
  onOpenCart: () => void;
}

/**
 * Sticky мини-корзина: кнопка-иконка с бейджем + выпадающее превью при hover.
 *
 * Превью показывает до 3 товаров корзины (миниатюра, имя, цена, qty),
 * счётчик «Всего N товаров» и кнопку «Перейти в корзину». Появляется при
 * наведении на кнопку (desktop), с задержкой скрытия 250мс, чтобы пользователь
 * успел переместить курсор в dropdown.
 *
 * Если корзина пуста — превью не показывается (только кнопка).
 */
function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function MiniCartPreview({ onOpenCart }: Props) {
  const { lines, count, hydrated } = useCart();
  const [hovered, setHovered] = useState(false);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const cartBadge = hydrated ? count : 0;
  const hasItems = cartBadge > 0;
  const previewLines = lines.slice(0, 3);
  const moreCount = Math.max(0, count - previewLines.reduce((s, l) => s + l.qty, 0));

  const onEnter = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
    setHovered(true);
  };
  const onLeave = () => {
    const t = setTimeout(() => setHovered(false), 250);
    setHideTimer(t);
  };

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`Корзина${cartBadge > 0 ? `, ${cartBadge} товаров` : ""}`}
        className={`relative w-10 h-10 flex items-center justify-center bg-[var(--bg2)] border cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] ${
          hovered && hasItems
            ? "border-[var(--olive)] text-[var(--olive-light)]"
            : "border-[var(--border-brand)] text-[var(--text2)]"
        }`}
      >
        <CartIcon />
        {cartBadge > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 text-white text-[0.6rem] font-bold flex items-center justify-center rounded-full font-mono-brand"
            style={{ background: "var(--coyote)" }}
          >
            {cartBadge}
          </span>
        )}
      </button>

      {/* Dropdown превью */}
      {hovered && hasItems && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[320px] bg-[var(--bg2)] border border-[var(--olive-dark)] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] z-[1100]"
          style={{ animation: "sn-slide-down 0.2s ease-out" }}
          role="tooltip"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-brand)] bg-[rgba(92,107,60,0.08)]">
            <span className="font-mono-brand text-[0.62rem] uppercase tracking-[2px] text-[var(--olive-light)]">
              В корзине
            </span>
            <span className="font-mono-brand text-[0.7rem] font-bold text-[var(--text)]">
              {count} {pluralize(count, ["товар", "товара", "товаров"])}
            </span>
          </div>

          {/* Items */}
          <div className="max-h-[280px] overflow-y-auto">
            {previewLines.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-brand)] last:border-b-0 transition-colors hover:bg-[var(--bg3)]"
              >
                <div
                  className="relative w-12 h-12 flex-shrink-0 overflow-hidden bg-[var(--bg3)]"
                >
                  <img
                    src={l.image}
                    alt={l.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[var(--olive)] text-white text-[0.58rem] font-bold flex items-center justify-center rounded-full font-mono-brand">
                    {l.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[0.78rem] font-bold uppercase tracking-[0.3px] leading-tight truncate">
                    {l.name}
                  </div>
                  <div className="font-mono-brand text-[0.68rem] text-[var(--text3)] mt-0.5">
                    {l.price}
                    {l.qty > 1 && ` × ${l.qty}`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          {moreCount > 0 && (
            <div className="px-4 py-2 text-center text-[0.65rem] uppercase tracking-[1px] text-[var(--text3)] border-b border-[var(--border-brand)] bg-[var(--bg3)]">
              …и ещё {moreCount} {pluralize(moreCount, ["товар", "товара", "товаров"])}
            </div>
          )}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full py-3 bg-[var(--olive)] text-white border-none text-[0.7rem] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] flex items-center justify-center gap-2"
          >
            Перейти в корзину
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function pluralize(n: number, forms: [string, string, string]) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}
