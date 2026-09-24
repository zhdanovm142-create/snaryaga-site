# СНАРЯГА36 — ИК-защитная экипировка

Одностраничный лендинг-магазин маскировочной экипировки (рюкзаки, костюмы,
накидки с ИК-экранированием). Полностью **статический сайт** (SSG/SPA) —
без сервера, базы данных и API-роутов. Готов к деплою на любой статический
хостинг.

---

## 🚀 Быстрый старт

```bash
# Установка зависимостей
bun install

# Запуск dev-сервера → http://localhost:3000
bun run dev

# Проверка кода
bun run lint
```

> Требуется Node.js 18+ и [Bun](https://bun.sh) (или npm/pnpm/yarn).

---

## 📦 Сборка статического экспорта

Проект настроен на `output: 'export'` — рантайм-сервер не нужен.

```bash
# Сборка в папку ./out/
bun run build
```

Результат — статичные HTML/CSS/JS файлы в `./out/`, которые можно открыть
напрямую в браузере или залить на любой хостинг.

---

## 🌐 Деплой

### GitHub Pages

1. Залейте репозиторий на GitHub
2. Settings → Pages → Source: **GitHub Actions** (или `main` / `out` folder)
3. Добавьте workflow `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

> ⚠️ Для GitHub Pages в `next.config.ts` добавьте `basePath: '/<имя-репо>'`,
> если сайт лежит не в корне домена.

### Netlify / Cloudflare Pages / Vercel

1. Подключите репозиторий
2. Build command: `bun run build`
3. Publish directory: `out`

---

## 🛠 Технологии

| Слой | Технология |
|------|-----------|
| Фреймворк | **Next.js 16** (App Router, Static Export) |
| Язык | TypeScript 5 |
| Стили | Tailwind CSS 4 + shadcn/ui (New York) |
| UI-компоненты | Radix UI + Lucide icons |
| Шрифты | Inter, JetBrains Mono, Oswald (Google Fonts) |
| Состояние | React hooks + `useSyncExternalStore` (без Redux/Zustand) |
| Хранилище | `localStorage` (корзина, избранное, недавно просмотренные) |
| Формы | `react-hook-form` + `fetch` к [FormSubmit.co](https://formsubmit.co) |

---

## 📁 Структура проекта

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Корневой layout (шрифты, metadata, Toaster)
│   │   ├── page.tsx            # Главная страница (сборка всех секций)
│   │   └── globals.css         # Tailwind + брендовая палитра + анимации
│   ├── components/
│   │   ├── site/               # 49 компонентов секций сайта
│   │   │   ├── Hero.tsx
│   │   │   ├── CatalogToolbar.tsx
│   │   │   ├── ProductDetailModal.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── ReviewsCarousel.tsx
│   │   │   └── ... (всего 49)
│   │   └── ui/                 # 49 shadcn/ui компонентов
│   ├── data/
│   │   ├── products.ts         # Каталог товаров (статичный массив)
│   │   └── videos.ts           # Манифест видео-отзывов
│   ├── hooks/
│   │   ├── use-cart.ts         # Корзина (localStorage)
│   │   ├── use-favorites.ts    # Избранное (localStorage)
│   │   ├── use-toast.ts
│   │   └── use-mobile.ts
│   └── lib/utils.ts            # cn() helper
├── public/
│   ├── products/               # 36 изображений товаров
│   ├── logo.svg
│   ├── hero-poster.svg
│   └── robots.txt
├── legacy/                     # Оригинальный плоский код (SSR версия)
├── worklog.md                  # Лог миграции SSR → Static Export
├── next.config.ts              # output: 'export', images.unoptimized
└── package.json
```

---

## ✨ Ключевые возможности

- **Каталог товаров** — фильтрация по категориям, поиск, сортировка, быстрый
  просмотр (HoverZoom), детальная модалка с характеристиками
- **Корзина** — добавление/удаление, изменение количества, сохраняется между
  сессиями (localStorage)
- **Избранное** — отметка товаров, отдельный drawer, сохраняется в localStorage
- **Недавно просмотренные** — до 4 последних открытых товаров
- **Формы** — оформление заказа, обратная связь, подписка на рассылку
  (отправка на email через FormSubmit.co)
- **Адаптивность** — mobile-first, hamburger-меню, touch-friendly
- **Анимации** — reveal-on-scroll, marquee, модалки, FAB-пульсация
- **SEO** — структурированные данные Schema.org (Organization, Product, FAQ),
  OpenGraph, семантический HTML
- **A11y** — ARIA-роли, keyboard-nav, focus-visible, reduced-motion

---

## ⚙️ Конфигурация

### Сменить email для форм

Формы (`OrderModal`, `Contact`, `Newsletter`) отправляют данные на
[FormSubmit.co](https://formsubmit.co) — бесплатный сервис без регистрации.

В файлах `src/components/site/{OrderModal,Contact,Newsletter}.tsx` найдите:

```ts
fetch("https://formsubmit.co/ajax/snaryaga36@mail.ru", { ... })
```

Замените `snaryaga36@mail.ru` на ваш email. При первой отправке FormSubmit
пришлёт письмо-подтверждение на этот ящик — подтвердите, и все заявки начнут
приходить туда.

### Добавить товар

Отредактируйте `src/data/products.ts` — добавьте объект в массив `PRODUCTS`:

```ts
{
  id: "new-product",
  category: "Assault Pack",
  name: "Рюкзак «Новый»",
  price: "12 900 ₽",
  description: "Краткое описание",
  images: { main: "/products/new-1.jpg", hover: "/products/new-2.jpg" },
  alt: { main: "Описание для SEO", hover: "Описание при наведении" },
}
```

Картинки положите в `public/products/`.

### Добавить видео-отзыв

1. Положите `.mp4` файл в `public/videos/` (создайте папку, если её нет)
2. Добавьте запись в `src/data/videos.ts`:

```ts
export const VIDEO_META: VideoMeta[] = [
  { file: "otzyv-1.mp4", name: "Алексей М.", role: "Контрактник", product: "Рюкзак «Тень-20»" },
];
```

### Контакты

Телефон, Telegram, WhatsApp, адрес пункта выдачи захардкожены в:
- `src/components/site/Contact.tsx` — основная форма
- `src/components/site/Footer.tsx` — подвал
- `src/components/site/LiveChat.tsx` — плавающая кнопка связи
- `src/components/site/CallFab.tsx` — кнопка быстрого звонка

---

## 🔍 SEO и индексация (снаряга36.рф)

Всё из «базового набора» уже генерируется билдером и попадает в `out/`
(и в копию `static-build/`):

| Элемент | Где генерируется | Что в итоге |
|---------|------------------|-------------|
| `<title>`, `<meta description>`, keywords, OG, Twitter | `src/app/layout.tsx` (`export const metadata`) | В `<head>` каждой страницы |
| Canonical + `og:url` | `metadataBase` в `layout.tsx` | `https://xn--36-6kcao2dwaf3k.xn--p1ai/` |
| `og:image` (растровый, 1344×768) | `layout.tsx` | `/products/ir-after.png` — превью для ВК/Telegram |
| Schema.org JSON-LD (Organization, Product×14, FAQPage) | `src/components/site/StructuredData.tsx` | Блок `<script type="application/ld+json">` |
| `robots.txt` + директива `Sitemap:` | `public/robots.txt` | Копируется билдером как есть |
| `sitemap.xml` | `src/app/sitemap.ts` | Генерируется при `next build` → `out/sitemap.xml` |

Сайт — статический экспорт (`output: 'export'`): весь контент предрендерен
в HTML, JS-рендеринг не мешает роботам видеть текст. `noindex` нигде нет.

### После деплоя — обязательные ручные шаги

1. **Яндекс.Вебмастер** (webmaster.yandex.ru) → добавить `https://снаряга36.рф`
   → подтвердить права (DNS или HTML-файл) → «Индексирование» →
   «Переобход страниц» → отправить `/` → «Файлы Sitemap» → добавить
   `/sitemap.xml`.
2. **Google Search Console** (search.google.com/search-console) → добавить
   ресурс (домен или URL-prefix) → отправить `https://снаряга36.рф/sitemap.xml`
   → «Проверка URL» → запросить индексирование главной.
3. **Коды верификации через meta-теги** (если не хотите DNS/файл):
   в `src/app/layout.tsx` раскомментируйте блок и подставьте коды:

   ```ts
   verification: {
     yandex: "<код из Яндекс.Вебмастер>",
     google: "<код из Google Search Console>",
   },
   ```

   Затем `bun run build` и обновить `static-build/`.
4. **Локальные сигналы**: Яндекс.Карты + 2ГИС с ссылкой на сайт,
   ссылка в шапке профилей ВК/Telegram (VK-сообщество уже указано
   в JSON-LD `Organization.sameAs`).

Проверка индексации: в поиске ввести `site:снаряга36.рф`
или `site:xn--36-6kcao2dwaf3k.xn--p1ai`.

---

## 📜 Скрипты

| Команда | Действие |
|---------|----------|
| `bun run dev` | Dev-сервер на :3000 с HMR |
| `bun run optimize:images` | Конвертация `public/products/*.jpg|png` → `products-opt/*.webp` (sharp, q82, max 1280px) |
| `bun run optimize:videos` | Сжатие видео через ffmpeg (CRF 28, без звука, faststart) |
| `bun run build` | `optimize:images` + `optimize:videos` + статическая сборка в `./out/` |
| `bun run start` | Локальный продакшн-сервер (для теста сборки) |
| `bun run lint` | ESLint проверка |

Оба скрипта оптимизации идемпотентны и безопасно пропускают то, что уже
сжато. Если ffmpeg не установлен, сборка не падает — видео остаются как есть.
Скрипт картинок удаляет исходники из `public/products/` после успешной
конверсии (оригиналы остаются в git-истории), чтобы статик-экспорт не тащил
неиспользуемые JPG. Исключения: `ir-after.png` (og:image для соцсетей),
`*-poster.*` (постеры видео), а исходники, для которых WebP выходит тяжелее
JPG, остаются без изменений.

---

## ⚡ Производительность (оптимизация статик-экспорта)

Архитектурные решения, ускоряющие первоначальную загрузку:

1. **Серверный page.tsx.** Главная — Server Component; весь интерактивный слой
   (Nav, модалки, корзина, избранное, тосты, deep-link `#product-*`) вынесен в
   `SiteChrome` + `SiteActionsContext`. Секции берут действия из контекста
   (`useSiteActions()`), а не пропсами — пропс-прокидывание через серверную
   границу невозможно. Чисто презентационные секции (Marquee, Categories,
   Tech, Compare, Guarantees, SizeGuide, About, Charity, SectionDivider,
   Footer) вообще не попадают в клиентский JS.
2. **Ленивые секции ниже фолда.** CatalogToolbar, RecentlyViewed, Poncho,
   Suits, BurgerChooser, IrCompare, Faq, ReviewsCarousel, Newsletter, Contact
   подключены через `next/dynamic` — их HTML по-прежнему пререндерится (SEO
   не страдает), но JS грузится отдельными чанками по мере скролла; на месте
   секции на долю секунды виден процедурный скелетон в теме сайта.
3. **Изображения — WebP на этапе сборки.** Продуктовые фото конвертируются
   скриптом (см. Скрипты) до сборки: 11.4 МБ → 8.3 МБ, с ограничением ширины
   1280px. Код ссылается на `/products-opt/*.webp`.
4. **Видео-фасады.** Ни одно видео не грузится при открытии страницы:
   - Hero: `<video>` монтируется только после `requestIdleCallback` (LCP —
     лёгкий постер), проявляется по событию `playing`;
   - Tech: `LazyVideo` (IntersectionObserver, запас 300px) монтирует и
     запускает ролик при приближении блока, ставит на паузу при уходе;
   - IrCompare: `preload="none"` — ролики качаются только в зоне видимости;
   - плюс все ролики пересжаты ffmpeg (−30–45% веса, без аудиодорожки).
5. **Процедурные свотчи камуфляжа.** `CamoSwatch` рисует расцветки («Мох»,
   «Пиксель», «Мультикам»…) CSS-градиентами — 0 байт вместо миниатюр;
   превью-сцена накидок грузит только активное фото, а не все пять слоёв.
6. **Шрифты.** Inter / JetBrains Mono / Oswald через `next/font/google`
   (self-hosted, `display: swap`, кириллица) — без блокировки рендера и FOUT
   с системными шрифтами.

---

## 📚 Legacy (оригинальный код)

В папке `legacy/` сохранён оригинальный плоский код репозитория до миграции
(SSR/ISR версия с Prisma + SQLite + API-роутами + WebSocket). См.
`legacy/README.md` — там есть таблица соответствия старых путей новым.

Подробный лог миграции (этапы T01–T09) — в `worklog.md`.

---

## 📄 Лицензия

Частный проект. Все права на контент и изображения принадлежат СНАРЯГА36.
