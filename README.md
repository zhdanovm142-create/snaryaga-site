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

## 📜 Скрипты

| Команда | Действие |
|---------|----------|
| `bun run dev` | Dev-сервер на :3000 с HMR |
| `bun run build` | Статическая сборка в `./out/` |
| `bun run start` | Локальный продакшн-сервер (для теста сборки) |
| `bun run lint` | ESLint проверка |

---

## 📚 Legacy (оригинальный код)

В папке `legacy/` сохранён оригинальный плоский код репозитория до миграции
(SSR/ISR версия с Prisma + SQLite + API-роутами + WebSocket). См.
`legacy/README.md` — там есть таблица соответствия старых путей новым.

Подробный лог миграции (этапы T01–T09) — в `worklog.md`.

---

## 📄 Лицензия

Частный проект. Все права на контент и изображения принадлежат СНАРЯГА36.
