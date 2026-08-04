"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { useFavorites } from "@/hooks/use-favorites";
import { trackRecentlyViewed } from "./RecentlyViewed";
import RelatedProducts from "./RelatedProducts";
import BoughtTogether from "./BoughtTogether";

interface Props {
  product: Product | null;
  onClose: () => void;
  onOrder: (productName: string) => void;
  /** Клик по сопутствующему товару — переключает модалку на него. */
  onSelectRelated?: (product: Product) => void;
}

/** Размерный ряд для подбора. */
const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type Size = (typeof SIZES)[number];

/** Категории, для которых предлагается выбор размера. */
const SIZABLE_CATEGORIES = new Set(["IR Suit", "Reversible Suit", "Full Kit"]);

function isLocalImage(src: string): boolean {
  return src.startsWith("/products/") || src.startsWith("/hero");
}

export default function ProductDetailModal({
  product,
  onClose,
  onOrder,
  onSelectRelated,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  // Scroll-lock + Esc only when modal is open
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  // Track scroll progress внутри модалки (для progress bar + scroll-to-top).
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0;
    setProgress(pct);
    setShowTop(el.scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Track recently viewed (side-effect only, no setState)
  useEffect(() => {
    if (product) {
      trackRecentlyViewed(product.id);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.88)] backdrop-blur-[8px] z-[2000] flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Детали: ${product.name}`}
    >
      <div
        className="bg-[var(--bg2)] border border-[var(--border-brand)] rounded-[4px] max-w-[920px] w-full max-h-[92vh] overflow-y-auto relative"
        style={{ animation: "sn-modal-in 0.3s ease" }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        {/* Scroll progress bar — индикатор чтения сверху модалки */}
        <div
          className="sticky top-0 left-0 right-0 h-[3px] z-20 bg-[var(--border-brand)]"
          aria-hidden="true"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--olive-dark)] to-[var(--olive-light)] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-7 right-4 z-10 w-9 h-9 bg-[var(--bg)] border border-[var(--border-brand)] flex items-center justify-center cursor-pointer text-[var(--text2)] text-[1.1rem] transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--text)]"
        >
          ×
        </button>

        {/* Scroll-to-top — появляется при прокрутке >400px */}
        {showTop && (
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Наверх"
            title="Наверх"
            className="sticky bottom-4 left-[calc(100%-3rem)] z-10 w-10 h-10 flex items-center justify-center bg-[var(--olive)] text-white border border-[var(--olive)] cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] float-right mr-4"
            style={{ animation: "sn-hover-zoom-in 0.2s ease-out" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        )}

        {/* key={product.id} — при смене товара внутренний компонент перемонтируется,
            что сбрасывает useState без setState в effect. */}
        <ProductDetailContent
          key={product.id}
          product={product}
          onOrder={onOrder}
          onSelectRelated={onSelectRelated}
        />
      </div>
    </div>
  );
}

function ProductDetailContent({
  product,
  onOrder,
  onSelectRelated,
}: {
  product: Product;
  onOrder: (productName: string) => void;
  onSelectRelated?: (product: Product) => void;
}) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const [activeImg, setActiveImg] = useState<"main" | "hover">("main");
  const [size, setSize] = useState<Size | null>(null);
  const [copied, setCopied] = useState(false);
  const fav = hydrated && isFavorite(product.id);

  const localImg = isLocalImage(product.images.main);
  const sizable = SIZABLE_CATEGORIES.has(product.category);

  const handleOrder = () => {
    // Собираем детали заказа: размер (для размерных категорий).
    const details: string[] = [];
    if (size) details.push(`размер ${size}`);
    const detailStr = details.length > 0 ? ` (${details.join(", ")})` : "";
    onOrder(`${product.name}${detailStr}`);
  };

  // Поделиться товаром — копирует ссылку с hash-якором на товар в буфер обмена.
  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#product-${product.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Фоллбек для старых браузеров
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Контейнер одинаковый для всех фото — тёмный фон, без оливковой сетки.
  // Фильтры (grayscale/multiply) убраны — пользователь видит оригинальное фото.
  const imgWrapStyle: React.CSSProperties = { backgroundColor: "var(--bg3)" };
  const mainImgClass = "absolute inset-0 w-full h-full object-contain";
  const thumbImgClass = "w-full h-full object-contain";

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image side */}
        <div className="relative bg-[var(--bg3)] p-6 sm:p-8">
          <div
            className="relative w-full aspect-square overflow-hidden flex items-center justify-center"
            style={imgWrapStyle}
          >
            <img
              src={activeImg === "main" ? product.images.main : product.images.hover}
              alt={activeImg === "main" ? product.alt.main : product.alt.hover}
              className={`${mainImgClass} transition-opacity duration-300`}
            />
            {localImg && (
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[rgba(0,0,0,0.45)] via-transparent to-transparent"
                aria-hidden="true"
              />
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => setActiveImg("main")}
              aria-label="Вид 1"
              className={`relative w-16 h-16 overflow-hidden border-2 cursor-pointer transition-colors ${
                activeImg === "main"
                  ? "border-[var(--olive)]"
                  : "border-[var(--border-brand)] hover:border-[var(--olive-dark)]"
              }`}
            >
              <img
                src={product.images.main}
                alt={product.alt.main}
                className={thumbImgClass}
              />
            </button>
            <button
              type="button"
              onClick={() => setActiveImg("hover")}
              aria-label="Вид 2"
              className={`relative w-16 h-16 overflow-hidden border-2 cursor-pointer transition-colors ${
                activeImg === "hover"
                  ? "border-[var(--olive)]"
                  : "border-[var(--border-brand)] hover:border-[var(--olive-dark)]"
              }`}
            >
              <img
                src={product.images.hover}
                alt={product.alt.hover}
                className={thumbImgClass}
              />
            </button>
          </div>
        </div>

        {/* Info side */}
        <div className="p-6 sm:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="font-mono-brand text-[0.62rem] text-[var(--olive)] tracking-[2px] uppercase">
              {product.category}
            </div>
            {product.tag && (
              <span
                className={`px-2 py-[0.2rem] text-[0.58rem] font-bold tracking-[1px] uppercase ${
                  product.tagKind === "new"
                    ? "bg-[var(--coyote)]"
                    : product.tagKind === "hit"
                      ? "bg-[#a85a3c]"
                      : "bg-[var(--olive)]"
                } text-white`}
              >
                {product.tag}
              </span>
            )}
          </div>

          <h2 className="font-display text-[1.7rem] sm:text-[2rem] font-bold uppercase leading-[1.05] mb-3">
            {product.name}
          </h2>

          <p className="text-[0.9rem] text-[var(--text2)] leading-[1.7] mb-6">
            {product.longDescription ?? product.description}
          </p>

          {/* Size selector — только для размерных категорий (костюмы/комплекты) */}
          {sizable && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[2px] uppercase">
                  Размер
                </div>
                <a
                  href="#size-guide"
                  className="text-[0.62rem] uppercase tracking-[1px] text-[var(--text3)] hover:text-[var(--olive-light)] transition-colors no-underline"
                >
                  Таблица размеров →
                </a>
              </div>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Выбор размера"
              >
                {SIZES.map((s) => {
                  const selected = size === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSize(s)}
                      className={`w-12 h-12 border font-mono-brand text-[0.85rem] font-bold tracking-[1px] cursor-pointer transition-all duration-200 ${
                        selected
                          ? "border-[var(--olive)] bg-[var(--olive)] text-white scale-105"
                          : "border-[var(--border-brand)] bg-[var(--bg3)] text-[var(--text2)] hover:border-[var(--olive-dark)] hover:text-[var(--text)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {!size && (
                <p className="text-[0.65rem] text-[var(--text3)] mt-2">
                  * Выберите размер — он будет указан в заявке.
                </p>
              )}
            </div>
          )}

          {/* Specs */}
          {product.specs && product.specs.length > 0 && (
            <div className="mb-6">
              <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[2px] uppercase mb-3">
                Характеристики
              </div>
              <dl className="grid grid-cols-2 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="bg-[var(--bg3)] p-3 flex flex-col gap-1"
                  >
                    <dt className="text-[0.62rem] uppercase tracking-[1px] text-[var(--text3)]">
                      {s.label}
                    </dt>
                    <dd className="text-[0.85rem] font-bold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[2px] uppercase mb-3">
                Ключевые особенности
              </div>
              <ul className="space-y-3">
                {product.features.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[var(--bg3)] border border-[var(--border-brand)] text-base">
                      {f.icon}
                    </div>
                    <div>
                      <div className="font-display text-[0.95rem] font-bold uppercase tracking-[0.5px] mb-0.5">
                        {f.title}
                      </div>
                      <div className="text-[0.78rem] text-[var(--text2)] leading-[1.55]">
                        {f.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-auto pt-4 border-t border-[var(--border-brand)]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-[0.62rem] uppercase tracking-[1px] text-[var(--text3)]">
                  Цена
                </div>
                <div className="font-mono-brand text-[1.1rem] font-bold">
                  {product.price}
                </div>
              </div>
              {product.leadTime && (
                <div className="text-right">
                  <div className="text-[0.62rem] uppercase tracking-[1px] text-[var(--text3)]">
                    Срок изготовления
                  </div>
                  <div className="text-[0.85rem] text-[var(--olive-light)] font-bold">
                    {product.leadTime}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleOrder}
                disabled={sizable && !size}
                className={`flex-1 py-3 px-4 border text-[0.72rem] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                  sizable && !size
                    ? "border-[var(--border-brand)] bg-[var(--bg3)] text-[var(--text3)] cursor-not-allowed"
                    : "bg-[var(--olive)] border-[var(--olive)] text-white hover:bg-[var(--olive-light)]"
                }`}
              >
                Заказать{sizable && size ? ` · ${size}` : ""}
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-pressed={fav}
                className={`px-4 py-3 border cursor-pointer transition-all duration-300 flex items-center gap-2 text-[0.68rem] font-bold tracking-[1px] uppercase ${
                  fav
                    ? "border-[var(--olive)] bg-[rgba(92,107,60,0.15)] text-[var(--olive-light)]"
                    : "border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
                }`}
              >
                {fav ? "В избранном" : "В избранное"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="Поделиться товаром — скопировать ссылку"
                title="Скопировать ссылку на товар"
                className={`px-4 py-3 border cursor-pointer transition-all duration-300 flex items-center gap-2 text-[0.68rem] font-bold tracking-[1px] uppercase ${
                  copied
                    ? "border-[var(--olive)] bg-[rgba(92,107,60,0.15)] text-[var(--olive-light)]"
                    : "border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
                }`}
              >
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                )}
                {copied ? "Скопировано" : "Ссылка"}
              </button>
            </div>
            {sizable && !size && (
              <p className="text-[0.62rem] text-[var(--text3)] mt-2 text-center">
                Сначала выберите размер, чтобы оформить заявку.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cross-sell: «С этим товаром покупают» — комплект с чекбоксами */}
      <BoughtTogether product={product} onOrder={onOrder} onSelectRelated={onSelectRelated} />

      {/* Related products — только если есть колбэк переключения */}
      {onSelectRelated && <RelatedProducts currentId={product.id} onSelect={onSelectRelated} />}
    </div>
  );
}
