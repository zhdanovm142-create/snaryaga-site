"use client";

import { useMemo, useState } from "react";
import {
  PRODUCTS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Product,
} from "@/data/products";

export type SortKey = "default" | "capacity" | "name";
export type FilterCategory = "all" | string;
export type ViewMode = "grid" | "list";

interface Props {
  onOrder: (productName: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCartToast: (productName: string) => void;
}

/** Извлекаем объём из capacity (напр. "20L" → 20) для сортировки */
function capacityToNumber(c?: string): number {
  if (!c) return 0;
  const m = c.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Кнопки фильтра строятся динамически из категорий, реально присутствующих
 * в каталоге. Порядок — из CATEGORY_ORDER, подписи — из CATEGORY_LABELS.
 * Вычисляется один раз на уровне модуля (PRODUCTS — константа).
 */
function buildFilterLabels(): { id: FilterCategory; label: string }[] {
  const present = new Set(PRODUCTS.map((p) => p.category));
  const list: { id: FilterCategory; label: string }[] = [
    { id: "all", label: "Все" },
  ];
  for (const cat of CATEGORY_ORDER) {
    if (present.has(cat)) {
      list.push({ id: cat, label: CATEGORY_LABELS[cat] ?? cat });
    }
  }
  // Категории, которых нет в CATEGORY_ORDER (на будущее) — в конец.
  for (const cat of present) {
    if (!CATEGORY_ORDER.includes(cat)) {
      list.push({ id: cat, label: CATEGORY_LABELS[cat] ?? cat });
    }
  }
  return list;
}

const FILTER_LABELS = buildFilterLabels();

const SORT_LABELS: { id: SortKey; label: string }[] = [
  { id: "default", label: "По умолчанию" },
  { id: "capacity", label: "По объёму" },
  { id: "name", label: "По названию" },
];

export default function CatalogToolbar({
  onOrder,
  onQuickView,
  onAddToCartToast,
}: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [view, setView] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // Filter by category
    if (filter !== "all") {
      list = list.filter((p) => p.category === filter);
    }

    // Filter by search query (по name, description, longDescription)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.longDescription ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.capacity ?? "").toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "capacity":
        list.sort(
          (a, b) => capacityToNumber(a.capacity) - capacityToNumber(b.capacity)
        );
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "ru"));
        break;
      default:
        // default — порядок из PRODUCTS
        break;
    }

    return list;
  }, [query, filter, sort]);

  return (
    <section
      id="products"
      className="bg-[var(--bg2)] border-t border-[var(--border-brand)] border-b border-[var(--border-brand)]"
    >
      <div className="sn-section">
        <header className="reveal mb-10">
          <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
            Продукция
          </div>
          <div className="flex justify-between items-end flex-wrap gap-8">
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
              Каталог
              <br />
              экипировки
            </h2>
            <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
              Наведите курсор, чтобы увидеть детали конструкции и реальный цвет
              материала. Нажмите на карточку для подробного описания.
            </p>
          </div>
        </header>

        {/* Toolbar: search + filters + sort */}
        <div className="reveal mb-8 space-y-4">
          {/* Search row */}
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none"
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию, описанию, объёму…"
              aria-label="Поиск товаров"
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--text3)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[var(--text3)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Filters + sort row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)] mr-1">
                Категория:
              </span>
              {FILTER_LABELS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 border ${
                    filter === f.id
                      ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                      : "bg-transparent border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive-dark)] hover:text-[var(--text)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)]"
              >
                Сортировка:
              </label>
              <div className="relative">
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-[0.72rem] font-bold tracking-[1px] uppercase px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-[var(--olive)] transition-colors"
                >
                  {SORT_LABELS.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[var(--bg)]">
                      {s.label}
                    </option>
                  ))}
                </select>
                <span
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text3)]"
                  aria-hidden="true"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Results count + View toggle */}
          <div className="flex items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)]">
            <span>
              Найдено: <span className="text-[var(--text2)] font-bold">{filtered.length}</span>{" "}
              {pluralize(filtered.length, ["товар", "товара", "товаров"])}
            </span>
            <div className="flex items-center gap-4">
              {(query || filter !== "all" || sort !== "default") && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                    setSort("default");
                  }}
                  className="text-[var(--olive-light)] hover:text-[var(--text)] transition-colors cursor-pointer bg-transparent border-none underline-offset-2 hover:underline"
                >
                  Сбросить фильтры
                </button>
              )}
              {/* Grid/List view toggle — только когда есть товары */}
              {filtered.length > 0 && (
                <div className="flex items-center gap-1 border border-[var(--border-brand)] bg-[var(--bg)]" role="group" aria-label="Вид каталога">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-pressed={view === "grid"}
                    aria-label="Вид: плитка"
                    title="Вид: плитка"
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer border-none ${
                      view === "grid"
                        ? "bg-[var(--olive)] text-white"
                        : "bg-transparent text-[var(--text3)] hover:text-[var(--text)]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-pressed={view === "list"}
                    aria-label="Вид: список"
                    title="Вид: список"
                    className={`w-8 h-8 flex items-center justify-center transition-all duration-200 cursor-pointer border-none ${
                      view === "list"
                        ? "bg-[var(--olive)] text-white"
                        : "bg-transparent text-[var(--text3)] hover:text-[var(--text)]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <circle cx="3.5" cy="6" r="1" />
                      <circle cx="3.5" cy="12" r="1" />
                      <circle cx="3.5" cy="18" r="1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products grid or empty state */}
        {filtered.length === 0 ? (
          <div className="border border-[var(--border-brand)] bg-[var(--bg3)] p-12 text-center">
            <div className="text-4xl mb-4 opacity-40">🔍</div>
            <div className="font-display text-[1.2rem] uppercase mb-2">
              Ничего не найдено
            </div>
            <p className="text-[0.85rem] text-[var(--text3)] mb-4">
              Попробуйте изменить поисковый запрос или сбросить фильтры.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
                setSort("default");
              }}
              className="py-2.5 px-5 bg-[var(--olive)] text-white border-none text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer hover:bg-[var(--olive-light)] transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className={view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]"
            : "flex flex-col gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]"
          }>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                view={view}
                onOrder={onOrder}
                onQuickView={onQuickView}
                onAddToCartToast={onAddToCartToast}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ProductCard — вынесен в модуль для переиспользования */
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { StarIcon } from "@/components/ui/icons";
import BlurImage from "./BlurImage";
import HoverZoom from "./HoverZoom";

/**
 * Локальные изображения (в /public/products/) имеют собственный тёмный фон
 * студии — для них НЕ применяем mix-blend-multiply/grayscale (иначе они
 * превращаются в грязные тёмные силуэты). Внешние CDN-PNG рюкзаков —
 * прозрачные, для них сохраняем оливковый фон-сетку + multiply-обработку.
 */
function isLocalImage(src: string): boolean {
  return src.startsWith("/products/") || src.startsWith("/hero");
}

function ProductCard({
  p,
  view,
  onOrder,
  onQuickView,
  onAddToCartToast,
}: {
  p: Product;
  view: ViewMode;
  onOrder: (n: string) => void;
  onQuickView: (p: Product) => void;
  onAddToCartToast: (name: string) => void;
}) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const { add } = useCart();
  const fav = hydrated && isFavorite(p.id);
  const [added, setAdded] = useState(false);
  const isList = view === "list";

  const tagClass =
    p.tagKind === "new"
      ? "bg-[var(--coyote)]"
      : p.tagKind === "hit"
        ? "bg-[#a85a3c]"
        : "bg-[var(--olive)]";
  const tagExtra = p.tagKind === "hit" ? " sn-tag-hit" : p.tagKind === "new" ? " sn-tag-new" : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    add({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images.main,
    });
    setAdded(true);
    onAddToCartToast(p.name);
    setTimeout(() => setAdded(false), 1200);
  };

  // Локальное изображение (со своим фоном) vs CDN-PNG (прозрачный).
  const localImg = isLocalImage(p.images.main);

  // Контейнер одинаковый для всех фото — тёмный фон, без оливковой сетки.
  // Фильтры (grayscale/multiply) убраны — пользователь видит оригинальное фото.
  const containerStyle: React.CSSProperties = { backgroundColor: "var(--bg3)" };

  const mainImgClass = localImg
    ? "absolute inset-0 w-full h-full object-contain transition-all duration-700 z-[2] opacity-100 group-hover:opacity-0 group-hover:scale-105"
    : "absolute inset-0 w-full h-full object-contain transition-all duration-700 z-[2] opacity-100 group-hover:opacity-0 group-hover:scale-110";
  const hoverImgClass = localImg
    ? "absolute inset-0 w-full h-full object-contain transition-all duration-700 z-[1] opacity-0 group-hover:opacity-100 group-hover:scale-105"
    : "absolute inset-0 w-full h-full object-contain transition-all duration-700 z-[1] opacity-0 group-hover:opacity-100 group-hover:scale-105";

  // List view: горизонтальная карточка — фото слева (фикс. ширина), контент справа.
  if (isList) {
    return (
      <article className="reveal group sn-scope-card bg-[var(--bg2)] p-4 sm:p-6 transition-all duration-400 cursor-pointer relative hover:bg-[var(--bg3)] flex flex-col sm:flex-row gap-5 sm:gap-8">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(p.id);
          }}
          aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={fav}
          className={`absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-[rgba(13,13,13,0.6)] backdrop-blur-sm border border-[var(--border-brand)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] ${
            fav ? "text-[var(--olive-light)]" : "text-[var(--text3)]"
          }`}
        >
          <StarIcon filled={fav} />
        </button>

        <HoverZoom src={p.images.main} alt={p.alt.main} hoverSrc={p.images.hover}>
          <div
            className="relative w-full sm:w-[200px] sm:flex-shrink-0 aspect-square overflow-hidden flex items-center justify-center cursor-pointer"
            onClick={() => onQuickView(p)}
            style={containerStyle}
          >
            <BlurImage src={p.images.main} alt={p.alt.main} className={mainImgClass} />
            <BlurImage src={p.images.hover} alt={p.alt.hover} className={hoverImgClass} />
            {localImg && (
              <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent opacity-60" aria-hidden="true" />
            )}
            {p.tag && (
              <div className={`absolute top-3 left-3 px-2 py-[0.2rem] ${tagClass}${tagExtra} text-[0.55rem] font-bold tracking-[1px] uppercase z-10 flex items-center gap-1`}>
                {p.tagKind === "hit" && (
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                )}
                {p.tag}
              </div>
            )}
          </div>
        </HoverZoom>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="font-mono-brand text-[0.6rem] text-[var(--olive)] tracking-[2px] uppercase mb-1.5">
            {p.category}
          </div>
          <h3 className="font-display text-[1.3rem] font-bold uppercase tracking-[0.5px] mb-2 leading-tight">
            {p.name}
          </h3>
          <p className="text-[0.85rem] text-[var(--text2)] leading-[1.65] mb-3 line-clamp-2 sm:line-clamp-3">
            {p.description}
          </p>
          {/* Ключевые характеристики в list-режиме — первые 3 spec */}
          {p.specs && p.specs.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-[0.72rem]">
              {p.specs.slice(0, 3).map((s) => (
                <span key={s.label} className="text-[var(--text3)]">
                  <span className="font-mono-brand uppercase tracking-[1px] text-[0.6rem]">{s.label}:</span>{" "}
                  <span className="text-[var(--text2)] font-bold">{s.value}</span>
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-[var(--border-brand)] mt-auto">
            <div className="font-mono-brand text-[0.95rem] font-bold">{p.price}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onQuickView(p)}
                className="py-2 px-3 bg-transparent border border-[var(--border-brand)] text-[var(--text2)] text-[0.62rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
                aria-label={`Подробнее о ${p.name}`}
              >
                Детали
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Добавить ${p.name} в корзину`}
                className={`py-2 px-[1.2rem] border text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                  added
                    ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                    : "bg-transparent border-[var(--olive)] text-[var(--olive-light)] hover:bg-[var(--olive)] hover:text-white"
                }`}
              >
                {added ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Добавлено
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    В корзину
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="reveal group sn-scope-card bg-[var(--bg2)] p-6 sm:p-8 transition-all duration-400 cursor-pointer relative hover:bg-[var(--bg3)] flex flex-col">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(p.id);
        }}
        aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
        aria-pressed={fav}
        className={`absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-[rgba(13,13,13,0.6)] backdrop-blur-sm border border-[var(--border-brand)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] ${
          fav ? "text-[var(--olive-light)]" : "text-[var(--text3)]"
        }`}
      >
        <StarIcon filled={fav} />
      </button>

      <HoverZoom src={p.images.main} alt={p.alt.main} hoverSrc={p.images.hover}>
        <div
          className="relative w-full aspect-square mb-6 overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => onQuickView(p)}
          style={containerStyle}
        >
          <BlurImage
            src={p.images.main}
            alt={p.alt.main}
            className={mainImgClass}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          <BlurImage
            src={p.images.hover}
            alt={p.alt.hover}
            className={hoverImgClass}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
          {/* Виньетка для локальных фото — улучшает читаемость подписи снизу */}
          {localImg && (
            <div
              className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent opacity-60"
              aria-hidden="true"
            />
          )}
          {p.tag && (
            <div
              className={`absolute top-4 left-4 px-2.5 py-[0.3rem] ${tagClass}${tagExtra} text-[0.6rem] font-bold tracking-[1px] uppercase z-10 flex items-center gap-1`}
            >
              {p.tagKind === "hit" && (
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              )}
              {p.tag}
            </div>
          )}
          <div className="absolute inset-0 flex items-end justify-center pb-3 z-[3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="px-3 py-1.5 bg-[rgba(13,13,13,0.85)] backdrop-blur-sm border border-[var(--olive)] text-[var(--olive-light)] text-[0.6rem] font-bold tracking-[1px] uppercase font-mono-brand">
              Быстрый просмотр
            </span>
          </div>
        </div>
      </HoverZoom>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="font-mono-brand text-[0.6rem] text-[var(--olive)] tracking-[2px] uppercase">
            {p.category}
          </div>
        </div>
        <h3 className="font-display text-[1.2rem] font-bold uppercase tracking-[0.5px] mb-2 leading-tight min-h-[2.4rem]">
          {p.name}
        </h3>
        <p className="text-[0.82rem] text-[var(--text2)] leading-[1.6] mb-6 flex-1 line-clamp-3">
          {p.description}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-[var(--border-brand)]">
          <div className="font-mono-brand text-[0.9rem] font-bold">{p.price}</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onQuickView(p)}
              className="py-2 px-3 bg-transparent border border-[var(--border-brand)] text-[var(--text2)] text-[0.62rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
              aria-label={`Подробнее о ${p.name}`}
            >
              Детали
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Добавить ${p.name} в корзину`}
              className={`py-2 px-[1.2rem] border text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                added
                  ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                  : "bg-transparent border-[var(--olive)] text-[var(--olive-light)] hover:bg-[var(--olive)] hover:text-white"
              }`}
            >
              {added ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Добавлено
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  В корзину
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
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
