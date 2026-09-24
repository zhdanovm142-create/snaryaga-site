"use client";

import { createContext, useContext } from "react";
import type { Product } from "@/data/products";

/**
 * Действия сайта, доступные секциям без прокидывания пропсов через сервер.
 *
 * Раньше page.tsx был "use client" и держал состояние модалок, а колбэки
 * (onOrder, onQuickView, onSubmitted…) шли пропсами вниз через ВСЕ секции —
 * из-за этого весь лендинг превращался в один клиентский бандл.
 *
 * Теперь page.tsx — серверный компонент, а секции берут действия отсюда.
 * Провайдер живёт в SiteChrome (см. ниже по дереву рендера).
 */
export interface SiteActions {
  /** Открыть модалку заказа по названию товара. */
  openOrder: (name: string) => void;
  /** Открыть модалку деталей товара. */
  openDetail: (product: Product) => void;
  /** Открыть выдвижную панель избранного. */
  openFavorites: () => void;
  /** Открыть корзину. */
  openCart: () => void;
  /** Показать всплывающее уведомление. */
  showToast: (message: string) => void;
}

export const SiteActionsContext = createContext<SiteActions | null>(null);

export function useSiteActions(): SiteActions {
  const ctx = useContext(SiteActionsContext);
  if (!ctx) {
    // Достижимо только при ошибке композиции: секция отрендерена вне SiteChrome.
    throw new Error(
      "useSiteActions должен вызываться внутри <SiteChrome> (провайдер SiteActionsContext)."
    );
  }
  return ctx;
}
