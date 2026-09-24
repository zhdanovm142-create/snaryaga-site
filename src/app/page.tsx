import dynamic from "next/dynamic";
import SiteChrome from "@/components/site/SiteChrome";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Categories from "@/components/site/Categories";
import SectionDivider from "@/components/site/SectionDivider";
import Tech from "@/components/site/Tech";
import Compare from "@/components/site/Compare";
import CompareTable from "@/components/site/CompareTable";
import Guarantees from "@/components/site/Guarantees";
import SizeGuide from "@/components/site/SizeGuide";
import About from "@/components/site/About";
import Charity from "@/components/site/Charity";
import Footer from "@/components/site/Footer";

/**
 * Процедурный скелетон для ленивых секций: на месте блока, пока браузер
 * докачивает его JS-чанк, виден тихий пульсирующий прямоугольник в теме
 * сайта. Высоты подобраны под реальную высоту секций, чтобы скролл-скип
 * не прыгал.
 */
function SectionSkeleton({ h }: { h: string }) {
  return (
    <div className="sn-section" aria-hidden="true">
      <div className={`w-full ${h} rounded-lg bg-[var(--bg2)] animate-pulse`} />
    </div>
  );
}

// Ниже фолда — клиентские секции через dynamic(): их HTML по-прежнему
// пререндерится на сервере (SEO не страдает), но JS-код грузится отдельными
// чанками по мере надобности, а не одним монолитным бандлом сверху.
const CatalogToolbar = dynamic(() => import("@/components/site/CatalogToolbar"), {
  loading: () => <SectionSkeleton h="min-h-[70vh]" />,
});
const RecentlyViewed = dynamic(() => import("@/components/site/RecentlyViewed"), {
  loading: () => <SectionSkeleton h="h-40" />,
});
const Poncho = dynamic(() => import("@/components/site/Poncho"), {
  loading: () => <SectionSkeleton h="min-h-[70vh]" />,
});
const Suits = dynamic(() => import("@/components/site/Suits"), {
  loading: () => <SectionSkeleton h="min-h-[70vh]" />,
});
const BurgerChooser = dynamic(() => import("@/components/site/BurgerChooser"), {
  loading: () => <SectionSkeleton h="min-h-[60vh]" />,
});
const IrCompare = dynamic(() => import("@/components/site/IrCompare"), {
  loading: () => <SectionSkeleton h="h-[60vh]" />,
});
const Faq = dynamic(() => import("@/components/site/Faq"), {
  loading: () => <SectionSkeleton h="h-96" />,
});
const ReviewsCarousel = dynamic(() => import("@/components/site/ReviewsCarousel"), {
  loading: () => <SectionSkeleton h="h-96" />,
});
const Newsletter = dynamic(() => import("@/components/site/Newsletter"), {
  loading: () => <SectionSkeleton h="h-64" />,
});
const Contact = dynamic(() => import("@/components/site/Contact"), {
  loading: () => <SectionSkeleton h="min-h-[60vh]" />,
});

/**
 * Главная страница — СЕРВЕРНЫЙ компонент.
 *
 * Что изменилось и зачем:
 *  — Раньше файл начинался с "use client" и импортировал все 30+ секций:
 *    браузер получал один огромный JS-бандл, включая код секций, до которых
 *    пользователь мог не доскроллить.
 *  — Теперь интерактивный слой (Nav, модалки, корзина, тосты, deep-link)
 *    вынесен в SiteChrome, а секции — серверные: их JS вообще не отдаётся
 *    браузеру, только готовый HTML.
 *  — Действия (заказ, быстрый просмотр, тосты) секции берут из
 *    SiteActionsContext вместо пропсов — пропс-прокидывание через сервер
 *    невозможно в RSC, да оно и не нужно.
 *  — Тяжёлые клиентские секции ниже фолда подключены через next/dynamic:
 *    HTML пререндерится (SEO цел), JS грузится лениво, на месте секции —
 *    процедурный скелетон.
 */
export default function Home() {
  return (
    <SiteChrome>
      <main className="flex-1">
        <Hero />
        <Marquee />
        <Categories />
        <CatalogToolbar />
        <RecentlyViewed />
        <Poncho />
        <Suits />
        <BurgerChooser />
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
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </SiteChrome>
  );
}
