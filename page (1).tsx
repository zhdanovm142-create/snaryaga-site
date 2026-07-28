"use client";

import { useCallback, useEffect, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Categories from "@/components/site/Categories";
import CatalogToolbar from "@/components/site/CatalogToolbar";
import Poncho from "@/components/site/Poncho";
import Suits from "@/components/site/Suits";
import BurgerChooser from "@/components/site/BurgerChooser";
import Tech from "@/components/site/Tech";
import Compare from "@/components/site/Compare";
import Guarantees from "@/components/site/Guarantees";
import ReviewsCarousel from "@/components/site/ReviewsCarousel";
import Faq from "@/components/site/Faq";
import SizeGuide from "@/components/site/SizeGuide";
import About from "@/components/site/About";
import Charity from "@/components/site/Charity";
import Newsletter from "@/components/site/Newsletter";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import OrderModal from "@/components/site/OrderModal";
import ProductDetailModal from "@/components/site/ProductDetailModal";
import FavoritesDrawer from "@/components/site/FavoritesDrawer";
import CartDrawer from "@/components/site/CartDrawer";
import CookieConsent from "@/components/site/CookieConsent";
import Toast from "@/components/site/Toast";
import CallFab from "@/components/site/CallFab";
import BackToTop from "@/components/site/BackToTop";
import ReadingProgress from "@/components/site/ReadingProgress";
import SectionIndex from "@/components/site/SectionIndex";
import CompareTable from "@/components/site/CompareTable";
import IrCompare from "@/components/site/IrCompare";
import LiveChat from "@/components/site/LiveChat";
import RecentlyViewed from "@/components/site/RecentlyViewed";
import SectionDivider from "@/components/site/SectionDivider";
import KeyboardShortcuts from "@/components/site/KeyboardShortcuts";
import { useScrollReveal } from "@/components/site/use-scroll";

export default function Home() {
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <ReadingProgress />
      <Nav onOpenFavorites={openFavorites} onOpenCart={openCart} />
      <SectionIndex />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Categories />
        <CatalogToolbar
          onOrder={openOrder}
          onQuickView={openDetail}
          onAddToCartToast={(name) => showToast(`${name} добавлен в корзину`)}
        />
        <RecentlyViewed onQuickView={openDetail} />
        <Poncho />
        <Suits onOrder={openOrder} onQuickView={openDetail} />
        <BurgerChooser onQuickView={openDetail} onOrder={openOrder} />
        <SectionDivider variant="diamond" />
        <Tech />
        <SectionDivider variant="line" label="Инструкция" color="coyote" />
        <Compare />
        <CompareTable />
        <IrCompare />
        <SectionDivider variant="diamond" />
        <Guarantees />
        <SectionDivider variant="tag" label="Вопросы" color="olive" />
        <SizeGuide />
        <Faq />
        <About />
        <Charity />
        <SectionDivider variant="tag" label="Отзывы" color="olive" />
        <ReviewsCarousel />
        <Newsletter onSubmitted={showToast} />
        <Contact onSubmitted={showToast} />
      </main>
      <Footer />

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
  );
}
