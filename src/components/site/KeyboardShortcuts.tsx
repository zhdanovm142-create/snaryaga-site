"use client";

import { useEffect, useState } from "react";

/**
 * Оверлей горячих клавиш.
 *
 * Нажатие «?» (Shift+/) открывает модалку со списком горячих клавиш сайта.
 * Escape закрывает. Также закрывается по клику на overlay или кнопку «×».
 *
 * Поддерживаемые шорткаты (для будущей реализации — пока справка):
 *  ?  — эта справка
 *  Esc — закрыть модалку/оверлей
 *  ←/→ — навигация по слайдеру ИК-сравнения
 *
 * Показывает также постоянный бейдж «?» в правом-нижнем углу, который
 * подсказывает о наличии шорткатов.
 */
const SHORTCUTS = [
  { keys: ["?"], desc: "Показать эту справку" },
  { keys: ["Esc"], desc: "Закрыть модалку / оверлей" },
  { keys: ["←", "→"], desc: "Двигать слайдер «до/после» в секции ИК" },
  { keys: ["Tab"], desc: "Навигация по интерактивным элементам" },
  { keys: ["Enter"], desc: "Активировать выбранный элемент" },
  { keys: ["Space"], desc: "Активировать кнопку/чекбокс" },
];

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 bg-[var(--bg3)] border border-[var(--olive-dark)] border-b-2 font-mono-brand text-[0.78rem] font-bold text-[var(--olive-light)] tracking-[1px] uppercase shadow-[0_2px_0_var(--olive-dark)]">
      {children}
    </kbd>
  );
}

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // «?» = Shift + / → e.key === "?"
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Не открываем, если фокус в input/textarea/select
        const tag = (document.activeElement?.tagName ?? "").toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Постоянный бейдж-подсказка */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Горячие клавиши (нажмите ?)"
        className="fixed bottom-6 left-6 z-[1000] w-10 h-10 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-[var(--text3)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] font-mono-brand text-[0.9rem] font-bold group"
        title="Горячие клавиши (?)"
      >
        ?
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--olive)] animate-pulse group-hover:scale-125 transition-transform" aria-hidden="true" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[2300] flex items-center justify-center p-4"
          style={{ animation: "sn-modal-in 0.25s ease" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Горячие клавиши"
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-[6px]" aria-hidden="true" />
          <div className="relative max-w-[460px] w-full bg-[var(--bg2)] border border-[var(--olive)] overflow-hidden">
            {/* Декоративная полоса */}
            <div className="h-1 bg-gradient-to-r from-[var(--olive-dark)] via-[var(--olive-light)] to-[var(--olive-dark)]" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-[rgba(13,13,13,0.6)] border border-[var(--border-brand)] text-[var(--text2)] text-[1.1rem] cursor-pointer transition-colors hover:border-[var(--olive)] hover:text-[var(--text)]"
            >
              ×
            </button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 flex items-center justify-center bg-[var(--olive)] text-white rounded-full">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />
                  </svg>
                </span>
                <div className="font-mono-brand text-[0.62rem] text-[var(--olive)] tracking-[2px] uppercase">
                  Управление
                </div>
              </div>
              <h3 className="font-display text-[1.6rem] font-bold uppercase tracking-[-0.5px] leading-[1.05] mb-5">
                Горячие
                <br />
                клавиши
              </h3>
              <ul className="space-y-3">
                {SHORTCUTS.map((s) => (
                  <li key={s.desc} className="flex items-center justify-between gap-4 py-2 border-b border-[var(--border-brand)] last:border-b-0">
                    <span className="text-[0.85rem] text-[var(--text2)]">{s.desc}</span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      {s.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-[var(--text3)] text-[0.7rem]">/</span>}
                          <KeyCap>{k}</KeyCap>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.68rem] text-[var(--text3)] text-center">
                Нажмите <KeyCap>?</KeyCap> в любой момент, чтобы открыть эту справку.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
