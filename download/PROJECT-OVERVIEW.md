# PROJECT OVERVIEW — СНАРЯГА36 (для агентов)

> Документ-ориентир для AI-агентов и разработчиков. Описывает проект целиком:
> назначение, стек, архитектуру, карту файлов, механики, производительность,
> SEO, пайплайн сборки, деплой и регламент работы. Обновляется при крупных
> изменениях. Актуальная версия: сборка VERIFY-4, 2026-09-24.

---

## 1. Что это за проект

Одностраничный лендинг-магазин **СНАРЯГА36** (снаряга36.рф) — разработка и
производство **ИК-защитной экипировки** (пончо, костюмы, рюкзаки из
экранирующих тканей, скрывающих человека от тепловизионных средств наблюдения).

- **Домен:** `снаряга36.рф`, везде в коде — punycode
  `xn--36-6kcao2dwaf3k.xn--p1ai` (robots.txt, sitemap, canonical, og:url
  обязаны быть в ASCII).
- **Формат:** лендинг + витрина каталога + корзина/заказ без онлайн-оплаты
  (заявки), один URL `/` — весь контент на главной, якоря и deep-link
  `#product-<id>` для модалок.
- **Хостинг:** GitHub Pages (статика из `static-build/`, флаг `.nojekyll`).

## 2. Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 16.1.x (Turbopack), React 19 |
| Язык | TypeScript (в `next.config.ts` `ignoreBuildErrors: true`) |
| Стили | Tailwind CSS 4 (`@tailwindcss/postcss`), `tw-animate-css` |
| UI-кит | shadcn/ui поверх Radix (`src/components/ui/*`, ~45 компонентов) |
| Пакетный менеджер | Bun (скрипты `bun run …`, но node-скрипты запускаются и через node) |
| Шрифты | `next/font/google`: Inter (base), Oswald (display), JetBrains Mono — сабсеты latin+cyrillic, `display: swap` |
| Иконки | lucide-react |
| Оптимизация ассетов | sharp (изображения), ffmpeg (видео) |
| Экспорт | **`output: "export"`** — чистая статика, серверного рантайма НЕТ |

Ключевое ограничение архитектуры: **статический экспорт**. `next/image`
не работает в рантайме (`images.unoptimized: true`), API-роутов нет,
все данные — локальные (`src/data/*`), состояние — localStorage.

## 3. Карта файлов

```
/home/z/my-project/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # шрифты, <html lang="ru">, весь <metadata>
│   │   │                     # (title/description/canonical/OG/Twitter/
│   │   │                     #  keywords/icons/verification), SITE_URL,
│   │   │                     # StructuredData, Toaster
│   │   ├── page.tsx          # СЕРВЕРНЫЙ компонент главной: порядок секций,
│   │   │                     # next/dynamic для 10 клиентских секций + скелетоны
│   │   ├── sitemap.ts        # metadata-роут → out/sitemap.xml (force-static,
│   │   │                     # lastmod = время сборки)
│   │   ├── globals.css       # тема: CSS-переменные (--olive, --coyote, --bg…),
│   │   │                     # сниппеты .sn-section и пр.
│   ├── components/
│   │   ├── site/             # ~50 компонентов сайта (см. §4 и §5)
│   │   └── ui/               # shadcn/ui — не редактировать точечно,
│   │                         # регенерировать через shadcn CLI
│   ├── data/
│   │   ├── products.ts       # 14 товаров: Product{id,name,price,category,
│   │   │                     # images[], specs[], features[], tags}, CATEGORY_LABELS,
│   │   │                     # CATEGORY_ORDER (Assault/Patrol/Heavy Pack…)
│   │   └── videos.ts         # VIDEO_META — метаданные всех mp4
│   ├── hooks/
│   │   ├── use-cart.ts       # CartLine, useCart() → localStorage sn36-cart
│   │   ├── use-favorites.ts  # useFavorites() → sn36-favorites
│   │   ├── use-mobile.ts, use-toast.ts
│   └── lib/utils.ts          # cn() (clsx + tailwind-merge)
├── scripts/
│   ├── optimize-images.mjs   # sharp: products/*.{jpg,jpeg,png} → products-opt/*.webp
│   ├── optimize-videos.mjs   # ffmpeg CRF 28, -an, +faststart, кэш .video-opt-cache.json
│   └── verify-static.mjs     # 25 авто-проверок билда (SEO/ассеты/perf)
├── public/                   # favicon.ico+svg, иконки PNG, logo.svg, hero.mp4,
│   │                         # tech-ir.mp4, постеры, robots.txt,
│   │                         # yandex_40b673b993338f11.html (верификация Яндекса)
│   ├── products/             # 6 файлов: og:image ir-after.png, постеры,
│   │                         # mp4-ролики ИК-сравнения, leggings-1.jpg (исключение)
│   └── products-opt/         # 38 webp — ЕДИНСТВЕННЫЙ источник фото товаров
├── out/                      # результат `next build` (не править руками)
├── static-build/             # артефакт деплоя = out/ + .nojekyll
├── worklog.md                # ОБЩИЙ журнал агентов (append-only, §11)
└── next.config.ts            # output:"export", unoptimized images,
                              # trailingSlash:true
```

## 4. Архитектура: сервер/клиент сплит

`page.tsx` — серверный компонент (без `"use client"`). Внутри `SiteChrome`
(клиентская оболочка) оборачивает серверные секции.

**Серверные секции** (JS в браузер не поставляется, только HTML):
`Hero, Marquee, Categories, Tech, Compare, CompareTable, Guarantees,
SizeGuide, About, Charity, Footer`.

**Клиентские ленивые** (`next/dynamic` + `loading:` скелетон `SectionSkeleton`,
HTML всё равно пререндерится — SEO цел):
`CatalogToolbar, RecentlyViewed, Poncho, Suits, BurgerChooser, IrCompare,
Faq, ReviewsCarousel, Newsletter, Contact`.

**Клиентская оболочка `SiteChrome`** владеет всем глобальным состоянием:
Nav + бургер, модалки (ProductDetailModal, OrderModal, CartDrawer,
FavoritesDrawer, SizeGuide), сравнение (Compare), тосты (Toast/sonner),
deep-link `#product-*`, useScrollReveal, FAB-кнопки, CookieConsent,
LiveChat, KeyboardShortcuts, ReadingProgress, BackToTop.

**Контекст действий `SiteContext`** (`useSiteActions`): openOrder /
openDetail / openFavorites / openCart / showToast. Секции вызывают действия
через контекст, а не через пропсы — прокидывание пропсов сквозь серверный
компонент невозможно в RSC.

## 5. Компоненты сайта (src/components/site) — краткий реестр

- **Hero** — первый экран, фон-видео монтируется через requestIdleCallback
  (~1.8 с fallback setTimeout), постер `hero-poster.svg` остаётся LCP.
- **Marquee** — бегущая строка преимуществ.
- **Categories** — плитки категорий каталога.
- **CatalogToolbar** — панель фильтров/сортировки каталога.
- **Poncho** — карточка пончо: кнопки расцветок рендерит **CamoSwatch**
  (процедурные CSS-паттерны мох/пиксель/мультикам/олива/койот — 0 байт
  трафика), превью-сцена показывает только активное фото (remount + fade-in),
  лайтбокс закрывается по Escape.
- **Suits / SuitConfigurator / BurgerChooser** — костюмы, конфигуратор,
  «конструктор бургера» выбора комплектации.
- **Tech** — технология: секция с LazyVideo (фасад видео).
- **LazyVideo** — IntersectionObserver (rootMargin 300px) монтирует <video>
  только у зоны видимости; play/pause по видимости.
- **Compare / CompareTable** — сравнение с обычной маскировкой (таблица).
- **IrCompare** — интерактивный слайдер «до/после» с двумя <video>
  (preload="none", играют только в зоне видимости, драг разделителя).
- **SizeGuide / SizeCalculator** — таблицы размеров и калькулятор.
- **Guarantees, Charity, About, TrustCertificates, FieldTests** — контентные
  секции доверия.
- **Faq** — аккордеон вопросов (тексты связаны с FAQPage JSON-LD).
- **ReviewsCarousel** — embla-карусель отзывов.
- **Newsletter, Contact** — подписка и контакты/карта.
- **StructuredData** — единый блок JSON-LD: Organization + Product + FAQPage.
- **SectionDivider, SectionIndex, AnimatedStat, SpecsBar, HoverZoom,
  BlurImage** — декоративные и вспомогательные.
- **CartDrawer, OrderModal, ProductDetailModal, FavoritesDrawer,
  MiniCartPreview, RecentlyViewed, RelatedProducts, BoughtTogether** —
  торговый контур (в SiteChrome).
- **Nav, BackToTop, CallFab, ReadingProgress, CookieConsent,
  CookieSettingsButton, LiveChat, KeyboardShortcuts, Toast** —
  оболочка/UX (в SiteChrome).

## 6. Данные и торговые механики

- **Каталог:** `PRODUCTS` в `src/data/products.ts` — 14 товаров, поля:
  id, name, price, category, images (пути `/products-opt/*.webp`), specs,
  features, tags («new»/«hit»). Категории: Assault Pack, Patrol Pack,
  Heavy Pack и др. (`CATEGORY_ORDER`, `CATEGORY_LABELS`).
- **Корзина:** `useCart()` → localStorage `sn36-cart` (JSON массив линий).
- **Избранное:** `useFavorites()` → `sn36-favorites`.
- **Недавно просмотренные:** localStorage `sn36-recent`.
- **Сравнение:** состояние в SiteChrome (Compare/CompareTable).
- **Заказ:** OrderModal — форма заявки (без оплаты); подтверждение тостом.
- **Deep-link:** открытие модалки товара по `#product-<id>`, при закрытии
  hash чистится.
- **Правка цен/товаров** = правка `products.ts` + пересборка. Позиционных
  бэкендов нет.

## 7. Производительность (что сделано и почему)

Итоговые решения — результат таска PERF-1, проверены замерами:

1. **Build-time оптимизация изображений.** `scripts/optimize-images.mjs`
   (sharp): `public/products/*.{jpg,jpeg,png}` → `products-opt/*.webp`,
   quality 82, max 1280px. 11.4 МБ → 8.3 МБ. Исходники из public/ удалены
   (остались в git-истории). Исключения: `ir-after.png` (og:image — соцсети
   ненадёжно понимают WebP в Open Graph), `*-poster.*`, случай
   «webp тяжелее jpg» → `leggings-1.jpg` остался оригиналом.
2. **Сжатие видео.** `scripts/optimize-videos.mjs` (ffmpeg CRF 28, `-an`
   — ролики беззвучные, `+faststart` — moov в начало). hero.mp4 3.9→2.1 МБ,
   tech-ir.mp4 9.0→6.9 МБ; выигрыш <10% → не перекодируем (защита от
   повторной деградации: кэш `.video-opt-cache.json` + порог 90%).
3. **Code splitting.** page.tsx — серверный компонент; 10 секций ниже фолда
   через `next/dynamic` со скелетонами; JS-чанки суммарно ~0.8 МБ (крупнейший
   224 КБ), чисто серверные секции не попадают в бандл.
4. **Процедурные свотчи.** `CamoSwatch.tsx` — CSS `repeating-linear-gradient`
   вместо `<img>`-превью расцветок: 0 сетевого трафика; в превью-сцене 1 фото
   вместо 5 слоёв.
5. **Видео-фасады.** `<video>` в DOM не попадает до необходимости:
   Hero — монтаж после idle (LCP на постере SVG), LazyVideo —
   IntersectionObserver 300px, IrCompare — `preload="none"`.
6. **Шрифты.** `next/font/google`, cyrillic-сабсеты, `display: swap`,
   автопредзагрузка — уже оптимально, не менять.

**Замеры (VERIFY-4, localhost):** первый экран ~460 КБ gzip критических
ресурсов (HTML 58 gzip + CSS 26 gzip + JS ~198 gzip + шрифты 174 КБ);
hero.mp4 грузится после idle; полный скролл — 54 запроса / 14.7 МБ
(≈13.6 МБ — видео по мере просмотра); `out/` = 24.9 МБ; DCL 347 мс,
Load 545 мс (localhost — абсолютные цифры не показывать как «скорость сайта»).
Постеры `ir-camera-poster.jpg` (183 КБ) + `ir-thermal-poster.jpg` (37 КБ)
грузятся на старте из-за пререндеренного `poster=` — известный нюанс,
можно поленить (state до IntersectionObserver) — низкий приоритет.

## 8. SEO-слой

- **layout.tsx metadata:** title с брендом в двух написаниях
  (СНАРЯГА36 / «Снаряга 36» — раздельный вариант раньше не находился),
  description, canonical `/`, keywords, icons (favicon.ico обязателен для
  Яндекса, favicon.svg предпочитается), og:image — растровый
  `/products/ir-after.png` 1344×768, twitter `summary_large_image`.
- **Верификации:** meta `google-site-verification` + `yandex-verification`
  и файл `/yandex_40b673b993338f11.html` (двойная схема — мета или файл).
  Коды владельца; при ротации менять в layout.tsx и public/.
- **robots.txt** — открыт для Googlebot/Bingbot/Яндекса + директива
  `Sitemap:` (punycode).
- **sitemap.ts** — генерирует `out/sitemap.xml` при каждой сборке,
  lastmod = время сборки (сигнал свежести для краулеров).
- **JSON-LD** (StructuredData): Organization, Product (по товарам),
  FAQPage (тексты синхронизированы с секцией Faq).
- **Пререндер:** ~144 КБ текста в index.html — краулер видит весь контент
  без JS.

## 9. Пайплайн сборки и деплой

```bash
bun install                  # deps
bun run build                # = optimize:images + optimize:videos + next build
node scripts/verify-static.mjs out        # 25/25 PASS — ОБЯЗАТЕЛЬНО
node scripts/verify-static.mjs static-build
rm -rf static-build && cp -r out static-build && touch static-build/.nojekyll
# → задеплоить static-build/ на GitHub Pages
```

- Оба оптимизатора **идемпотентны** — повторный прогон ничего не ломает.
- Если добавлены новые JPG/PNG — они конвертируются автоматически при
  `bun run build`; новые mp4 — сжимаются (если выигрыш ≥10%).
- После добавления файлов вручную в public/ проверять, что ссылки в коде
  соответствуют факту (верификатор B1/B2 ловит 404).
- **Статус деплоя (2026-09-24): на живом сайте — старая SEO-сборка.**
  Новый perf-билд готов в `static-build/`, ждёт публикации. После деплоя:
  Яндекс.Вебмастер «Переобход страниц» + GSC «Проверка URL → Запросить
  индексирование»; sitemap уже на проде.

## 10. Верификация и тесты

- **`bun run release` — ЕДИНЫЙ гейт агента** (смузли-билдер): build →
  фактчек контента → verify-static out/ → sync static-build (+ .nojekyll)
  → verify-static static-build. Одна команда до каждого PR.
- `scripts/verify-content.ts` — **фактчекер контента** (запуск с bun — он
  транслирует TS и импортирует PRODUCTS напрямую):
  - FAIL (блокирует PR): 404 картинок, файл 0 байт, `hover === main`
    без `photoPending: true`, пустые name/price/description/alt, дубликаты id
  - WARN (не блокирует, но висит до исправления): `photoPending` — фото
    утеряны, ждём от владельца; шеринг фото между товарами вне
    `SHARING_ALLOWLIST` («чужое фото»)
  - `SHARING_ALLOWLIST` — осознанные шеринги: комплект показывает фото
    входящего костюма, двусторонний костюм — фото того же костюма
- `scripts/verify-static.mjs` — 25 проверок: SEO (19), целостность ссылок
  (2), perf-маркеры (4). Код возврата 1 при любом FAIL.
- Браузерный smoke (agent-browser): title/H1/18 секций/48 webp/JSON-LD;
  добавление в корзину пишет `sn36-cart`; iPhone 390px без горизонтального
  скролла; page errors пусто.
- Урок проекта (инцидент «чехол/Фантом-50»): фото товаров изначально жили
  на CDN песочницы и были удалены — исходники не сохранили в git. Правило:
  **все фотки товаров — только в репо** (`public/products-opt/`), CDN —
  только транспорт, сразу после загрузки файл кладётся в public/ и
  коммитится. Поля `photoPending: true` в products.ts отмечают товары,
  ждущие фото от владельца (Фантом-50 вид 2, Чехол — оба фото).

## 11. Регламент для агентов

1. **worklog.md** — общий журнал, append-only. Перед работой — прочитать
   последние записи; после — добавить секцию с шаблоном: `---`, `Task ID:`,
   `Agent:`, `Task:`, `Work Log:`, `Stage Summary:`. Task ID отражает
   глобальный порядок (примеры: SEO-VERIFY-2, PERF-1, PERF-MEASURE-3, VERIFY-4).
2. **Перед каждым PR — `bun run release`** (build + фактчек контента +
   25 проверок статики + sync static-build). Пушить PR с FAIL нельзя.
3. Скрипты >10 строк сохранять в `scripts/` и запускать файлом, не inline;
   править точечно (Edit), не переписывать целиком.
4. Деливери — в `/home/z/my-project/download/`.
5. Код и комментарии — на русском (правило проекта: язык пользователя ru).
6. Не трогать: `out/` руками, `src/components/ui/*` точечно, punycode-домен
   (всегда ASCII в robots/sitemap/canonical/og).
7. Схема деплоя владельца: изменения → `bun run release` → PR с
   пересобранным static-build → мерж → `git pull` на сервере.
8. Фото товаров: только в репо (см. §10, урок про CDN). Новые фото от
   владельца → `public/products-opt/` → webp-конверсия (optimize-images
   сам подхватит исходники в public/products/) → снять `photoPending`.
9. Секреты: в чат/код не вставлять (в истории был скомпрометирован GitHub
   PAT — отозван/подлежит отзыву владельцем).

## 12. Известные нюансы и долги

- Постеры ИК-сравнения (220 КБ) грузятся на старте — ленить по желанию.
- `typescript.ignoreBuildErrors: true` — типы не блокируют сборку; держать
  в уме при рефакторинге.
- `reactStrictMode: false` — осознанно (dev-двойные эффекты мешали
  видео/скролл-логике).
- GitHub PAT упоминался в переписке — владельцу отозвать и не хранить в репо.
- Живой сайт отстаёт от репозитория до следующего деплоя — сверять маркеры
  (`/products-opt/` в HTML, отсутствие `hero.mp4` инлайном).
