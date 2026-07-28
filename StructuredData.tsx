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

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Снаряга36",
  alternateName: "СНАРЯГА 36",
  url: "https://снаряга36.рф/",
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
  url: "https://снаряга36.рф/",
  inLanguage: "ru-RU",
  description:
    "Маскировка нового поколения — ИК-защитная экипировка: рюкзаки, накидки, костюмы из экранирующих тканей.",
};

const SIZABLE_CATEGORIES = new Set(["IR Suit", "Reversible Suit", "Full Kit"]);
const SIZE_VARIANTS = ["S", "M", "L", "XL", "XXL"];

const PRODUCT_LIST = PRODUCTS.map((p) => {
  const sizable = SIZABLE_CATEGORIES.has(p.category);
  // Доступность по остатку: 0 = OutOfStock, иначе InStock.
  const inStock = p.stock === undefined || p.stock > 0;
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    priceCurrency: "RUB",
    price: p.price === "По запросу" ? "0" : p.price,
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: "Снаряга36" },
  };
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
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.longDescription ?? p.description,
    category: p.category,
    brand: { "@type": "Brand", name: "Снаряга36" },
    sku: p.id,
    offers,
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
