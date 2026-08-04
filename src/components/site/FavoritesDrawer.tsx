"use client";

import { useEffect } from "react";
import { PRODUCTS } from "@/data/products";
import { useFavorites } from "@/hooks/use-favorites";

interface Props {
  open: boolean;
  onClose: () => void;
  onOrder: (productName: string) => void;
}

export default function FavoritesDrawer({ open, onClose, onOrder }: Props) {
  const { favorites, toggleFavorite, clearFavorites, hydrated } = useFavorites();

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[6px] z-[1900] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Избранное"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[var(--bg2)] border-l border-[var(--border-brand)] z-[2000] flex flex-col transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <header className="flex items-center justify-between p-6 border-b border-[var(--border-brand)]">
          <div>
            <div className="font-display text-[1.3rem] font-bold uppercase tracking-[1px]">
              Избранное
            </div>
            <div className="text-[0.7rem] text-[var(--text3)] uppercase tracking-[2px] mt-1">
              {hydrated ? `${items.length} ${pluralize(items.length, ["товар", "товара", "товаров"])}` : "—"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="w-9 h-9 bg-[var(--bg)] border border-[var(--border-brand)] flex items-center justify-center cursor-pointer text-[var(--text2)] text-[1.1rem] transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--text)]"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {!hydrated ? (
            <div className="text-center text-[var(--text3)] text-sm py-12">
              Загрузка…
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-4xl mb-4 opacity-50">☆</div>
              <div className="font-display text-[1.1rem] uppercase mb-2">
                Список пуст
              </div>
              <p className="text-[0.85rem] text-[var(--text3)] leading-[1.6]">
                Нажимайте на звёздочку в карточке товара, чтобы добавить его в
                избранное.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((p) => (
                <li
                  key={p.id}
                  className="flex gap-3 p-3 bg-[var(--bg3)] border border-[var(--border-brand)] hover:border-[var(--olive-dark)] transition-colors"
                >
                  <div
                    className="w-16 h-16 flex-shrink-0 bg-[var(--olive-dark)] bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${p.images.main}")`,
                      imageRendering: "auto",
                    }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono-brand text-[0.6rem] text-[var(--olive)] tracking-[2px] uppercase">
                      {p.category}
                    </div>
                    <div className="font-display text-[0.95rem] font-bold uppercase truncate">
                      {p.name}
                    </div>
                    <div className="text-[0.78rem] text-[var(--text2)] mt-1">
                      {p.price}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => onOrder(p.name)}
                        className="text-[0.62rem] font-bold tracking-[1px] uppercase px-2.5 py-1 bg-[var(--olive)] text-white border-none cursor-pointer hover:bg-[var(--olive-light)] transition-colors"
                      >
                        Заказать
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(p.id)}
                        className="text-[0.62rem] font-bold tracking-[1px] uppercase px-2.5 py-1 bg-transparent border border-[var(--border-brand)] text-[var(--text2)] cursor-pointer hover:border-[var(--coyote)] hover:text-[var(--coyote-light)] transition-colors"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="p-4 border-t border-[var(--border-brand)] flex justify-between items-center">
            <button
              type="button"
              onClick={clearFavorites}
              className="text-[0.7rem] uppercase tracking-[1px] text-[var(--text3)] hover:text-[var(--coyote-light)] transition-colors cursor-pointer bg-transparent border-none"
            >
              Очистить список
            </button>
            <button
              type="button"
              onClick={() => {
                onOrder(`Все товары из избранного (${items.length})`);
              }}
              className="text-[0.7rem] font-bold tracking-[1px] uppercase px-4 py-2 bg-[var(--olive)] text-white border-none cursor-pointer hover:bg-[var(--olive-light)] transition-colors"
            >
              Заказать всё
            </button>
          </footer>
        )}
      </aside>
    </>
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
