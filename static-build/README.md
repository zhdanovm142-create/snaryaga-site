# Static Build — собранная статика сайта СНАРЯГА36

Эта папка содержит **готовую к деплою статическую сборку** сайта,
сгенерированную командой `bun run build` (Next.js `output: 'export'`).

## 📦 Что здесь

```
static-build/
├── index.html          # Главная (и единственная) страница
├── 404.html            # Страница 404
├── _next/              # JS/CSS/шрифты (хешированные)
├── products/           # Изображения товаров
├── videos/             # Папка для видео-отзывов (пустая — добавьте .mp4)
├── logo.svg            # Фавикон
├── hero-poster.svg     # Постер hero-секции
├── robots.txt          # SEO
└── .nojekyll           # Отключает Jekyll на GitHub Pages
```

## 🚀 Как запустить локально

```bash
cd static-build

# Любой статический сервер, например:
bunx serve .
# или
python3 -m http.server 8080
# или
npx http-server -p 8080
```

Откройте `http://localhost:8080` — сайт работает полностью офлайн, без Node.js.

## 🌐 Деплой

### GitHub Pages

1. Залейте репозиторий на GitHub
2. Settings → Pages → Source: **Deploy from a branch**
3. Branch: `main` / Folder: **`/static-build`**
4. Save — сайт будет доступен по адресу
   `https://<username>.github.io/<repo>/`

> Файл `.nojekyll` уже лежит в папке — он отключает обработку Jekyll,
> чтобы папка `_next/` (начинается с подчёркивания) не игнорировалась.

### Netlify / Cloudflare Pages / Vercel

- Build command: *(пусто — сборка уже готова)*
- Publish directory: `static-build`

### Любой хостинг

Просто загрузите содержимое папки `static-build/` в корень веб-сервера
(Nginx, Apache, Caddy, S3 и т.д.).

## 🔄 Пересборка

```bash
# Из корня проекта
bun run build              # соберёт в ./out/
rm -rf static-build/
cp -r out/ static-build/   # обновить папку
```

## ⚠️ Важно

- Это **собранный артефакт** — не редактируйте файлы здесь, правьте исходники
  в `src/` и пересобирайте
- Размер ~30 MB (в основном изображения товаров в `products/`)
- Сайт работает как SPA: все данные (каталог, корзина, избранное) — в
  клиентском JS + localStorage, сервер не нужен
