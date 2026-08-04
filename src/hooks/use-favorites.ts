"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sn36-favorites";
const EMPTY: string[] = [];

/* ------------------------------------------------------------------ */
/* Module-level store: cache + subscribers + read/write helpers.       */
/* Using useSyncExternalStore avoids setState-in-effect lint error and  */
/* handles SSR hydration correctly (server returns EMPTY, client        */
/* re-renders with real snapshot after mount).                          */
/* ------------------------------------------------------------------ */

let cached: string[] | null = null;

function readFresh(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string")
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

function notify() {
  cached = null; // invalidate cache
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onChange = () => callback();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onChange);
    window.addEventListener("sn36-favorites-change", onChange as EventListener);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("sn36-favorites-change", onChange as EventListener);
    }
  };
}

function writeFavorites(ids: string[]) {
  cached = ids;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent("sn36-favorites-change", { detail: ids }));
    } catch {
      /* noop */
    }
  }
  listeners.forEach((l) => l());
}

/* ------------------------------------------------------------------ */

// «Mounted»-флаг через useSyncExternalStore: server → false, client → true.
// Во время гидратации useSyncExternalStore использует getServerSnapshot (false),
// что совпадает с серверным рендером — БЕЗ hydration-mismatch.
const noopSubscribe = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

/**
 * Глобальный (без context) доступ к избранному через localStorage + storage-event.
 * Используем useSyncExternalStore для корректной работы с SSR и авто-подписки
 * на изменения из других вкладок/компонентов.
 */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // mounted: false на сервере И во время гидратации на клиенте (совпадает),
  // true — после гидратации. Заменяет прежний `typeof window`-бранч, который
  // вызывал hydration-mismatch (сервер рендерил «—», клиент — «0 товаров»).
  const mounted = useSyncExternalStore(noopSubscribe, getMountedClient, getMountedServer);
  const hydrated = mounted;

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((id: string) => {
    const current = getSnapshot();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeFavorites(next);
  }, []);

  const clearFavorites = useCallback(() => {
    writeFavorites(EMPTY);
  }, []);

  return {
    favorites,
    count: favorites.length,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    hydrated,
  };
}
