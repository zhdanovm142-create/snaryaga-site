/**
 * Schema.org структурированные данные для SEO.
 * Рендерится как <script type="application/ld+json"> в head страницы.
 *
 * Включает:
 * - Organization (для бренда Снаряга36)
 * - WebSite (для search action)
 * - Product[] (для каждого товара в каталоге)
 * - FAQPage (для блока вопросов-ответов)
 */
import { PRODUCTS } from "@/data/products";

// Punycode-форма снаряга36.рф — Google требует АБСОЛЮТНЫЕ URL в Product.image.
// Дублируем константу (не импортируем из layout.tsx — там цикл: layout импортирует StructuredData).
const SITE_URL = "https://xn--36-6kcao2dwaf3k.xn--p1ai";

// Варианты написания бренда — слитно и раздельно: по запросу «снаряга 36»
// раздельно сайт не находился. alternateName принимает массив (schema.org).
const BRAND_ALIASES = [
  "СНАРЯГА 36",
  "Снаряга 36",
  "снаряга 36",
  "Snaryaga36",
  "Snaryaga 36",
];

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Снаряга36",
  alternateName: BRAND_ALIASES,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.svg` },
  description:
    "Разработка и производство экипировки из экранирующих тканей для снижения заметности в инфракрасном диапазоне.",
  telephone: "+7-951-559-66-22",
  email: undefined,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Воронеж",
    addressRegion: "Воронежская область",
    addressCountry: "RU",
    streetAddress: "Купянский переулок, д. 11",
  },
  sameAs: ["https://vk.ru/club240233552"],
};

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Снаряга36",
  alternateName: BRAND_ALIASES,
  url: SITE_URL,
  inLanguage: "ru-RU",
  description:
    "Маскировка нового поколения — ИК-защитная экипировка: рюкзаки, накидки, костюмы из экранирующих тканей.",
};

const SIZABLE_CATEGORIES = new Set(["IR Suit", "Reversible Suit", "Full Kit"]);
const SIZE_VARIANTS = ["S", "M", "L", "XL", "XXL"];

const PRODUCT_LIST = PRODUCTS.map((p) => {
  // Фото: абсолютные URL (Google не принимает относительные пути в Product.image).
  // main и hover могут совпадать (фолбэки) — дедуплицируем.
  const image = Array.from(new Set([p.images.main, p.images.hover].filter(Boolean)))
    .map((src) => `${SITE_URL}${src}`);

  const sizable = SIZABLE_CATEGORIES.has(p.category);
  // Доступность по остатку: 0 = OutOfStock, иначе InStock.
  const inStock = p.stock === undefined || p.stock > 0;

  // «По запросу» НЕ превращаем в price:"0": нулевая цена — это отказ
  // в merchant listings и обман в сниппете.
  //
  // ОСОЗНАННЫЙ ТРЕЙДОФФ (ответ на P1 из Codex Review): без offers товары
  // теряют элегибельность в product snippets — Google требует хотя бы одно
  // из свойств: offers / review / aggregateRating
  // (developers.google.com/search/docs/appearance/structured-data/product-snippet).
  // Честных альтернатив для «По запросу» нет:
  //   - offers без цены → крит «Missing field price» в merchant listings
  //     (подтверждено практикой GSC, support.google.com);
  //   - фейковые review/aggregateRating → structured data spam, ручной фильтр.
  // Разметку Product оставляем: её читает Яндекс, а name/image/brand/sku
  // работают на понимание страницы. Появятся публичные цены — вернуть offers,
  // и товары станут элегибельны в обоих отчётах сразу.
  const hasPublicPrice = p.price !== "По запросу";
  const offers: Record<string, unknown> | undefined = hasPublicPrice
    ? {
        "@type": "Offer",
        priceCurrency: "RUB",
        price: p.price,
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Снаряга36" },
      }
    : undefined;

  if (offers) {
    // Остаток на складе — через inventoryLevel (ItemListElementInventory).
    if (p.stock !== undefined) {
      offers.inventoryLevel = {
        "@type": "QuantitativeValue",
        value: p.stock,
      };
    }
    // Для размерных товаров — sizeVariant + acceptedSize.
    if (sizable) {
      offers.sizeVariant = SIZE_VARIANTS;
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.longDescription ?? p.description,
    category: p.category,
    brand: { "@type": "Brand", name: "Снаряга36" },
    sku: p.id,
    image,
    ...(offers ? { offers } : {}),
  };
});

const FAQS = [
  {
    q: "Как долго работает ИК-экранирование?",
    a: "Экранирующая ткань отражает или поглощает ИК-излучение постоянно — эффект не теряется со временем.",
  },
  {
    q: "В каких диапазонах работает защита?",
    a: "Наши ткани блокируют тепловое излучение в диапазонах 3–5 мкм и 8–14 мкм. Полный заявленный диапазон — 3–14 мкм.",
  },
  {
    q: "Можно ли стирать экранирующую экипировку?",
    a: "Да. Материал выдерживает 50+ циклов стирки без потери защитных свойств. Рекомендуем деликатный режим при 30 °C.",
  },
  {
    q: "Сколько занимает изготовление заказа?",
    a: "Стандартные позиции — от 3 до 5 дней. Кастомные решения — от 2 недель.",
  },
  {
    q: "Доставляете в другие регионы?",
    a: "Да, отправляем по всей России СДЭК и Почтой России. Самовывоз — из Воронежа.",
  },
  {
    q: "Можно ли заказать индивидуальный пошив?",
    a: "Да. Мы производим костюмы, чехлы и укрытия по чертежам заказчика.",
  },
  {
    q: "Чем экранирование отличается от изоляции?",
    a: "Экранирование блокирует ИК-излучение постоянно. Изоляция лишь замедляет теплопередачу — эффект временный.",
  },
  {
    q: "СНАРЯГА36 или Снаряга 36 — как правильно?",
    a: "Правильно слитно — СНАРЯГА36: это название бренда и домена снаряга36.рф. «Снаряга 36» раздельно — тот же магазин ИК-маскировочной экипировки в Воронеже.",
  },
];

const FAQ_PAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const ALL = [ORG, WEBSITE, ...PRODUCT_LIST, FAQ_PAGE];

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ALL) }}
    />
  );
}
