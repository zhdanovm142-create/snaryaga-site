"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";

interface Props {
  onOrder?: (name: string) => void;
  onQuickView?: (p: Product) => void;
}

/**
 * Секция «Костюмы» — витрина линейки «Бугор».
 *
 * Тянутся все товары категорий IR Suit и Reversible Suit из каталога.
 * Клик по карточке открывает lightbox с увеличенным изображением.
 * Кнопки «Детали» / «Заказать» прокидываются наружу через props.
 *
 * Заменяет прежние градиентные заглушки — теперь показываем реальные
 * изображения костюмов из /public/products/.
 */
export default function Suits({ onOrder, onQuickView }: Props) {
  const [lightbox, setLightbox] = useState<Product | null>(null);

  // Костюмы: IR Suit + Reversible Suit, в порядке каталога.
  const suits = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => p.category === "IR Suit" || p.category === "Reversible Suit"
      ),
    []
  );

  return (
    <section id="suits" className="sn-section !pt-0">
      <header className="reveal mb-16">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Линейка «Бугор»
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Костюмы
            <br />
            «Бугор»
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Маскировочные ИК-костюмы на базе экранирующих тканей. Полное
            подавление тепловой сигнатуры в диапазонах 3–5 и 8–14 мкм. Малый,
            средний, большой — с двусторонними вариантами олива/койот. Кликните
            фото для увеличения.
          </p>
        </div>
      </header>

      <div className="reveal grid grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
        {suits.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setLightbox(s)}
            aria-label={`Открыть фото: ${s.name}`}
            className="relative aspect-[3/4] overflow-hidden flex items-center justify-center group cursor-pointer text-left bg-[var(--bg3)] transition-all duration-300 hover:bg-[var(--bg2)]"
          >
            {/* Изображение костюма */}
            <img
              src={s.images.main}
              alt={s.alt.main}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {/* Затемнение снизу для читаемости подписи */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.92)] via-[rgba(0,0,0,0.15)] to-transparent z-[1]" />
            {/* Сетка-оверлей */}
            <div
              className="absolute inset-0 opacity-20 z-[1] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(92,107,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,0.08) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            {/* Number badge */}
            <div className="absolute top-3 left-3 z-[2] w-8 h-8 flex items-center justify-center bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive-dark)] font-mono-brand text-[0.7rem] text-[var(--olive-light)]">
              {String(i + 1).padStart(2, "0")}
            </div>
            {/* Reversible badge */}
            {s.category === "Reversible Suit" && (
              <div className="absolute top-3 right-3 z-[2] px-2 py-1 bg-[var(--coyote)] text-white text-[0.55rem] font-bold tracking-[1px] uppercase font-mono-brand">
                реверс
              </div>
            )}
            {/* Zoom icon (hover) */}
            <div className="absolute bottom-16 right-3 z-[2] w-8 h-8 flex items-center justify-center bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--border-brand)] text-[var(--text2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </div>
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-[2]">
              <div className="font-mono-brand text-[0.6rem] text-[var(--olive-light)] tracking-[1px] uppercase mb-1">
                {s.category === "Reversible Suit" ? "Двусторонний" : "ИК-костюм"}
                {s.capacity ? ` · ${s.capacity}` : ""}
              </div>
              <div className="text-[0.85rem] text-[var(--text)] font-display font-bold uppercase leading-tight">
                {s.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.92)] backdrop-blur-[8px] z-[2100] flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.name}
          style={{ animation: "sn-modal-in 0.3s ease" }}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Закрыть"
            className="absolute top-6 right-6 w-10 h-10 bg-[var(--bg2)] border border-[var(--border-brand)] flex items-center justify-center cursor-pointer text-[var(--text2)] text-[1.3rem] transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--text)]"
          >
            ×
          </button>
          <div
            className="max-w-[720px] w-full grid md:grid-cols-2 gap-0 border border-[var(--olive-dark)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden bg-[var(--bg3)]">
              <img
                src={lightbox.images.main}
                alt={lightbox.alt.main}
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent" />
            </div>
            <div className="bg-[var(--bg2)] p-6 sm:p-8 flex flex-col">
              <div className="font-mono-brand text-[0.6rem] text-[var(--olive-light)] tracking-[2px] uppercase mb-2">
                {lightbox.category === "Reversible Suit"
                  ? "Двусторонний ИК-костюм"
                  : "ИК-костюм"}
                {lightbox.capacity ? ` · ${lightbox.capacity}` : ""}
              </div>
              <h3 className="font-display text-[1.5rem] font-bold uppercase tracking-[0.5px] mb-3">
                {lightbox.name}
              </h3>
              <p className="text-[0.85rem] text-[var(--text2)] leading-[1.7] mb-5 flex-1">
                {lightbox.longDescription ?? lightbox.description}
              </p>
              <div className="flex gap-2 pt-4 border-t border-[var(--border-brand)]">
                {onQuickView && (
                  <button
                    type="button"
                    onClick={() => {
                      onQuickView(lightbox);
                      setLightbox(null);
                    }}
                    className="flex-1 py-2.5 px-4 bg-transparent border border-[var(--border-brand)] text-[var(--text2)] text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
                  >
                    Детали
                  </button>
                )}
                {onOrder && (
                  <button
                    type="button"
                    onClick={() => {
                      onOrder(lightbox.name);
                      setLightbox(null);
                    }}
                    className="flex-1 py-2.5 px-4 bg-[var(--olive)] text-white border border-[var(--olive)] text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)]"
                  >
                    Заказать
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
