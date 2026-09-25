# Legacy — оригинальный исходный код snaryaga-site (SSR/ISR версия)

Эта папка содержит **оригинальный плоский код** репозитория `snaryaga-site` до
миграции на Static Export. Сохранён для истории и отката.

> ВАЖНО: содержимое этой папки не должно попадать в production build
> (она лежит вне `src/` и `public/`, сборщик Next.js её не трогает).

## Archived UI blocks (blocks/)

Здесь хранятся блоки сайта, удалённые из публичной версии, но сохранённые
для возможного возврата. Каждый блок — папка с оригинальным кодом,
`notes.md` (причина, место, зависимости, инструкция возврата) и, где
нужно, данными.

| Блок | Статус | Причина | Папка |
|---|---|---|---|
| Количество подписчиков в рассылке | archived | Не показываем публичное число подписчиков | `blocks/newsletter-subscriber-count` |
| Карточка «Прозрачность» в charity | archived | Убрана из публичной секции волонтёрской жизни | `blocks/charity-transparency-card` |
| Кубик «0 уходит на сторону» | archived | Не показываем этот показатель публично | `blocks/charity-stat-zero-away` |
| Секция «Размерная сетка» | archived | Блок не нужен для текущего выбора товара (костюмы унисекс, размер выбирается в товаре) | `blocks/size-guide-section` |

---

## Что здесь лежит (оригинальный архив миграции)

- **Плоская структура** — все `.tsx`/`.ts` файлы в корне (как было в оригинале)
- **Дубликаты** — `page.tsx` / `page (1).tsx`, `route.ts` / `route (1).ts` и т.д.
  (так лежали в репозитории — оставлены как есть)
- **Серверный код** (несовместим со статикой):
  - `server.ts` — WebSocket-сервер (socket.io) на порту 3003
  - `route.ts`, `route (1).ts`, `route (2).ts`, `route (3).ts` — API-роуты
    (`/api/videos` сканировал `/public/videos/` через `fs.readdir`)
  - `db.ts` — Prisma-клиент
  - `schema.prisma` — схема БД (User, Post — стандартный шаблон, сайтом не
    использовалась)
  - `custom.db` — SQLite-файл (не скопирован — бинарный)
- **Конфиги SSR**: `next.config.ts` с `output: 'standalone'`
- **`frontend.tsx`** — демо socket.io-чата (не часть самого сайта)
- **Скрипты сборки**: `database-runtime-build.sh`, `python-runtime-*.sh` и т.д.
- **`products.ts`** — оригинальный каталог (уже перенесён в `src/data/products.ts`)

## Чего здесь НЕТ (намеренно не скопировано)

- Изображения (`.jpg`, `.png`, `.svg`) — уже лежат в `public/products/` и `public/`
- `workspace-*.tar` — 9.8 MB архив (не нужен)
- `custom.db` — бинарная SQLite-БД
- `read_*.txt` — логи чтения (43–49 KB)
- `bun.lock` — дублирует `package.json`
- `worklog.md` — наш рабочий лог миграции

## Соответствие legacy → новая структура

| Legacy (плоский)                    | Новая структура                          |
| ----------------------------------- | ---------------------------------------- |
| `page.tsx`                          | `src/app/page.tsx`                       |
| `layout.tsx`                        | `src/app/layout.tsx`                     |
| `globals.css`                       | `src/app/globals.css`                    |
| `*.tsx` (PascalCase, секции сайта) | `src/components/site/*.tsx`              |
| `*.tsx` (lowercase, UI)            | `src/components/ui/*.tsx`                |
| `use-cart.ts`, `use-favorites.ts`   | `src/hooks/`                             |
| `use-scroll.ts`                     | `src/components/site/use-scroll.ts`      |
| `products.ts`                       | `src/data/products.ts`                   |
| — (новое)                           | `src/data/videos.ts` (заменил `/api/videos`) |
| `next.config.ts` (`standalone`)     | `next.config.ts` (`export`)              |

## Что изменилось при миграции

1. `output: 'standalone'` → `output: 'export'` (+ `images.unoptimized`)
2. Удалены все API-роуты, `db.ts`, `schema.prisma`, `server.ts`
3. `fetch('/api/videos')` в `ReviewsCarousel` → статичный `src/data/videos.ts`
4. Формы (`OrderModal`, `Contact`, `Newsletter`) → `fetch` к FormSubmit.co
5. Корзина/избранное — уже были на localStorage (без изменений)

Подробности — в `../worklog.md` (этапы T01–T09).
