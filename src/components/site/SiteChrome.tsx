"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import Nav from "@/components/site/Nav";
import ReadingProgress from "@/components/site/ReadingProgress";
import SectionIndex from "@/components/site/SectionIndex";
import OrderModal from "@/components/site/OrderModal";
import ProductDetailModal from "@/components/site/ProductDetailModal";
import FavoritesDrawer from "@/components/site/FavoritesDrawer";
import CartDrawer from "@/components/site/CartDrawer";
import CookieConsent from "@/components/site/CookieConsent";
import Toast from "@/components/site/Toast";
import CallFab from "@/components/site/CallFab";
import BackToTop from "@/components/site/BackToTop";
import LiveChat from "@/components/site/LiveChat";
import KeyboardShortcuts from "@/components/site/KeyboardShortcuts";
import { useScrollReveal } from "@/components/site/use-scroll";
import {
  SiteActionsContext,
  type SiteActions,
} from "@/components/site/SiteContext";

/**
 * Клиентская «обвязка» страницы: навигация, оверлеи, состояние модалок.
 *
 * Раньше всем этим управлял page.tsx с "use client" — из-за этого ВЕСЬ
 * лендинг (включая чисто презентационные секции) попадал в клиентский бандл.
 *
 * Теперь: page.tsx — серверный компонент, секции рендерятся на сервере,
 * а SiteChrome оборачивает их в провайдер действий (SiteContext) и добавляет
 * интерактивный слой: Nav, модалки, корзина, избранное, тосты, FAB-кнопки.
 * Дочерние секции (children) приходят готовыми из серверного page.tsx —
 * их JS не попадает в бандл.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  useScrollReveal();

  const [orderProduct, setOrderProduct] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openOrder = useCallback((name: string) => {
    setOrderProduct(name);
  }, []);
  const closeOrder = useCallback(() => setOrderProduct(null), []);
  const openDetail = useCallback((p: Product) => setDetailProduct(p), []);
  const closeDetail = useCallback(() => setDetailProduct(null), []);
  const openFavorites = useCallback(() => setFavoritesOpen(true), []);
  const closeFavorites = useCallback(() => setFavoritesOpen(false), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const showToast = useCallback((msg: string) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Deep-link: при загрузке с #product-{id} открываем модалку товара.
  // setState в effect здесь оправдан — это разовая реакция на URL-hash при
  // первичной загрузке (mount), не подписка на меняющийся стор.
  useEffect(() => {
    const hash = window.location.hash;
    const m = hash.match(/^#product-(.+)$/);
    if (!m) return;
    const p = PRODUCTS.find((pr) => pr.id === m[1]);
    if (p) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetailProduct(p);
      // Снимаем hash, чтобы при закрытии модалки он не висел.
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const actions: SiteActions = {
    openOrder,
    openDetail,
    openFavorites,
    openCart,
    showToast,
  };

  return (
    <SiteActionsContext.Provider value={actions}>
      <div className="min-h-screen flex flex-col bg-[var(--bg)]">
        <ReadingProgress />
        <Nav onOpenFavorites={openFavorites} onOpenCart={openCart} />
        <SectionIndex />
        {children}

        <CallFab />
        <BackToTop />
        <LiveChat />

        <OrderModal
          productName={orderProduct}
          onClose={closeOrder}
          onSubmitted={showToast}
        />
        <ProductDetailModal
          product={detailProduct}
          onClose={closeDetail}
          onOrder={(name) => {
            closeDetail();
            openOrder(name);
          }}
          onSelectRelated={openDetail}
        />
        <FavoritesDrawer
          open={favoritesOpen}
          onClose={closeFavorites}
          onOrder={(name) => {
            closeFavorites();
            openOrder(name);
          }}
        />
        <CartDrawer
          open={cartOpen}
          onClose={closeCart}
          onOrder={(name) => {
            closeCart();
            openOrder(name);
          }}
        />
        <CookieConsent />
        <KeyboardShortcuts />
        <Toast message={toast} onDismiss={dismissToast} />
      </div>
    </SiteActionsContext.Provider>
  );
}
