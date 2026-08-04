"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sn36-cart";

export interface CartLine {
  id: string;
  name: string;
  price: string;
  image: string;
  /** Количество */
  qty: number;
}

const EMPTY: CartLine[] = [];

let cached: CartLine[] | null = null;

function readFresh(): CartLine[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (x): x is CartLine =>
        x &&
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        typeof x.price === "string" &&
        typeof x.image === "string" &&
        typeof x.qty === "number" &&
        x.qty > 0
    );
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): CartLine[] {
  if (cached === null) cached = readFresh();
  return cached;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

const listeners = new Set<() => void>();

function notify() {
  cached = null;
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onChange = () => callback();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onChange);
    window.addEventListener("sn36-cart-change", onChange as EventListener);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("sn36-cart-change", onChange as EventListener);
    }
  };
}

function writeCart(lines: CartLine[]) {
  cached = lines;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      window.dispatchEvent(new CustomEvent("sn36-cart-change", { detail: lines }));
    } catch {
      /* noop */
    }
  }
  listeners.forEach((l) => l());
}

/**
 * Корзина (отдельно от избранного). Хранится в localStorage.
 * useSyncExternalStore — корректная SSR-гидратация + подписка на изменения.
 */
// «Mounted»-флаг через useSyncExternalStore: server → false, client → true.
// Во время гидратации useSyncExternalStore использует getServerSnapshot (false),
// что совпадает с серверным рендером — БЕЗ hydration-mismatch.
const noopSubscribe = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // mounted: false на сервере И во время гидратации на клиенте (совпадает),
  // true — после гидратации. Заменяет прежний `typeof window`-бранч.
  const mounted = useSyncExternalStore(noopSubscribe, getMountedClient, getMountedServer);
  const hydrated = mounted;

  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const add = useCallback((item: Omit<CartLine, "qty">, qty = 1) => {
    const current = getSnapshot();
    const existing = current.find((l) => l.id === item.id);
    const next = existing
      ? current.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l))
      : [...current, { ...item, qty }];
    writeCart(next);
  }, []);

  const remove = useCallback((id: string) => {
    writeCart(getSnapshot().filter((l) => l.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      writeCart(getSnapshot().filter((l) => l.id !== id));
      return;
    }
    writeCart(getSnapshot().map((l) => (l.id === id ? { ...l, qty } : l)));
  }, []);

  const inc = useCallback((id: string) => {
    writeCart(
      getSnapshot().map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
    );
  }, []);

  const dec = useCallback((id: string) => {
    const current = getSnapshot();
    const existing = current.find((l) => l.id === id);
    if (!existing) return;
    if (existing.qty <= 1) {
      writeCart(current.filter((l) => l.id !== id));
    } else {
      writeCart(current.map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l)));
    }
  }, []);

  const clear = useCallback(() => writeCart(EMPTY), []);

  return {
    lines,
    count,
    hydrated,
    add,
    remove,
    setQty,
    inc,
    dec,
    clear,
  };
}
