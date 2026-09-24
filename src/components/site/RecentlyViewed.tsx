"use client";

import { useSyncExternalStore } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { useSiteActions } from "@/components/site/SiteContext";

const STORAGE_KEY = "sn36-recently-viewed";
const MAX_ITEMS = 4;
const EMPTY: string[] = [];

let cached: string[] | null = null;

function readFresh(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string").slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): string[] {
  if (cached === null) cached = readFresh();
  return cached;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onChange = () => callback();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onChange);
    window.addEventListener("sn36-recently-viewed-change", onChange as EventListener);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("sn36-recently-viewed-change", onChange as EventListener);
    }
  };
}

function writeRecent(ids: string[]) {
  cached = ids;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent("sn36-recently-viewed-change", { detail: ids }));
    } catch {
      /* noop */
    }
  }
  listeners.forEach((l) => l());
}

/**
 * Блок «Вы недавно смотрели» — показывает до 4 последних просмотренных товаров.
 * Записывает в localStorage id товаров при открытии ProductDetailModal.
 *
 * Использует useSyncExternalStore (как use-favorites/use-cart) — корректная
 * SSR-гидратация + подписка на изменения из других вкладок.
 */
// «Mounted»-флаг: server → false, client-гидратация → false (совпадает),
// после гидратации → true. Заменяет `typeof window`-бранч (hydration-mismatch).
const noopSubscribe = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

export default function RecentlyViewed() {
  // Колбэк из SiteActionsContext вместо пропса (page.tsx — серверный).
  const { openDetail: onQuickView } = useSiteActions();
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(noopSubscribe, getMountedClient, getMountedServer);
  const hydrated = mounted;

  const items = PRODUCTS.filter((p) => ids.includes(p.id));
  // Сохраняем порядок из ids (последний просмотренный — первый)
  items.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

  if (!hydrated || items.length === 0) return null;

  return (
    <section className="bg-[var(--bg2)] border-t border-[var(--border-brand)] py-12 px-6 sm:px-12">
      <div className="max-w-[1440px] mx-auto">
        <header className="reveal mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[3px] uppercase mb-2 flex items-center gap-3 before:content-[''] before:w-[24px] before:h-px before:bg-[var(--olive)]">
              История
            </div>
            <h2 className="font-display text-[1.5rem] sm:text-[1.8rem] font-bold uppercase tracking-[-0.5px] leading-[1.05]">
              Вы недавно смотрели
            </h2>
          </div>
          <span className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)]">
            {items.length} {pluralize(items.length, ["товар", "товара", "товаров"])}
          </span>
        </header>

        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
          {items.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onQuickView(p)}
              className="group relative bg-[var(--bg3)] p-4 text-left cursor-pointer transition-all duration-300 hover:bg-[var(--bg2)] border-none"
              aria-label={`Открыть ${p.name}`}
            >
              <div
                className="relative w-full aspect-[2/3] mb-3 overflow-hidden flex items-center justify-center bg-[var(--bg3)]"
              >
                <img
                  src={p.images.main}
                  alt={p.alt.main}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="font-mono-brand text-[0.55rem] text-[var(--olive)] tracking-[2px] uppercase mb-1">
                {p.category}
              </div>
              <div className="font-display text-[0.85rem] font-bold uppercase tracking-[0.5px] leading-tight mb-1 truncate">
                {p.name}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono-brand text-[0.72rem] font-bold text-[var(--text2)]">
                  {p.price}
                </span>
                <span className="text-[0.55rem] uppercase tracking-[1px] text-[var(--text3)] group-hover:text-[var(--olive-light)] transition-colors">
                  Открыть →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
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

/** Утилита для записи просмотренного товара (вызывается из ProductDetailModal) */
export function trackRecentlyViewed(id: string) {
  if (typeof window === "undefined") return;
  const current = getSnapshot().filter((x) => x !== id);
  const next = [id, ...current].slice(0, MAX_ITEMS);
  writeRecent(next);
}
