"use client";

import { useEffect } from "react";
import { useCart } from "./use-cart";

interface Props {
  open: boolean;
  onClose: () => void;
  onOrder: (productName: string) => void;
}

export default function CartDrawer({ open, onClose, onOrder }: Props) {
  const { lines, inc, dec, remove, clear, count, hydrated } = useCart();

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

  return (
    <>
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-[6px] z-[1900] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-[var(--bg2)] border-l border-[var(--border-brand)] z-[2000] flex flex-col transition-transform duration-400 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <header className="flex items-center justify-between p-6 border-b border-[var(--border-brand)]">
          <div>
            <div className="font-display text-[1.3rem] font-bold uppercase tracking-[1px]">
              Корзина
            </div>
            <div className="text-[0.7rem] text-[var(--text3)] uppercase tracking-[2px] mt-1">
              {hydrated
                ? `${count} ${pluralize(count, ["товар", "товара", "товаров"])}`
                : "—"}
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
          ) : lines.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-4xl mb-4 opacity-50">🛒</div>
              <div className="font-display text-[1.1rem] uppercase mb-2">
                Корзина пуста
              </div>
              <p className="text-[0.85rem] text-[var(--text3)] leading-[1.6]">
                Добавьте товары из каталога — нажмите «В корзину» в карточке
                товара.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li
                  key={l.id}
                  className="flex gap-3 p-3 bg-[var(--bg3)] border border-[var(--border-brand)] hover:border-[var(--olive-dark)] transition-colors"
                >
                  <div
                    className="w-16 h-16 flex-shrink-0 bg-[var(--olive-dark)] bg-cover bg-center"
                    style={{ backgroundImage: `url("${l.image}")` }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[0.95rem] font-bold uppercase truncate">
                      {l.name}
                    </div>
                    <div className="text-[0.78rem] text-[var(--text2)] mt-1">
                      {l.price}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[var(--border-brand)]">
                        <button
                          type="button"
                          onClick={() => dec(l.id)}
                          aria-label="Уменьшить количество"
                          className="w-7 h-7 flex items-center justify-center text-[var(--text2)] cursor-pointer bg-transparent border-none hover:bg-[var(--bg2)] hover:text-[var(--text)] transition-colors text-base leading-none"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono-brand text-[0.85rem]">
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => inc(l.id)}
                          aria-label="Увеличить количество"
                          className="w-7 h-7 flex items-center justify-center text-[var(--text2)] cursor-pointer bg-transparent border-none hover:bg-[var(--bg2)] hover:text-[var(--text)] transition-colors text-base leading-none"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.id)}
                        aria-label={`Удалить ${l.name} из корзины`}
                        className="text-[0.62rem] uppercase tracking-[1px] text-[var(--text3)] hover:text-[var(--coyote-light)] transition-colors cursor-pointer bg-transparent border-none"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="p-4 border-t border-[var(--border-brand)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[0.7rem] uppercase tracking-[2px] text-[var(--text3)]">
                Всего позиций
              </span>
              <span className="font-mono-brand text-[0.9rem] font-bold">
                {count}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clear}
                className="text-[0.7rem] uppercase tracking-[1px] text-[var(--text3)] hover:text-[var(--coyote-light)] transition-colors cursor-pointer bg-transparent border-none"
              >
                Очистить
              </button>
              <button
                type="button"
                onClick={() => {
                  const summary = lines
                    .map((l) => `${l.name} ×${l.qty}`)
                    .join(", ");
                  onOrder(`Оформление заказа: ${summary}`);
                }}
                className="flex-1 py-3 px-4 bg-[var(--olive)] text-white border-none text-[0.72rem] font-bold tracking-[2px] uppercase cursor-pointer hover:bg-[var(--olive-light)] transition-colors"
              >
                Оформить заказ
              </button>
            </div>
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
