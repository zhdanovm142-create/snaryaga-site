# Snaryaga-site Static Export Migration — Work Log

## Project Context
Migrating the snaryaga-site (Next.js SSR/ISR landing-store for IR-camouflage gear)
to a pure Static Export (SSG/SPA). Source repo cloned from GitHub into /tmp/snaryaga-site
(flat structure with duplicates). Target: /home/z/my-project (Next.js 16 App Router template).

Execution plan: T01 → T02 → T03 → parallel T04/T05/T06 → T07 → T08 → T09.

---
Task ID: T01
Agent: main
Task: Analyze the snaryaga-site repository and plan the static-export migration.

Work Log:
- Cloned https://github.com/zhdanovm142-create/snaryaga-site.git into /tmp/snaryaga-site
- Discovered flat file layout (all .tsx/.ts/.jpg in root) with duplicates (page.tsx / page (1).tsx, etc.)
- Read key files: next.config.ts (output:standalone), page.tsx, layout.tsx, server.ts, route.ts variants, use-cart.ts, use-favorites.ts, db.ts, schema.prisma, OrderModal/Contact/Newsletter forms, FieldTests, LiveChat, ReviewsCarousel, globals.css, products.ts
- Mapped import aliases: @/components/site/*, @/components/ui/*, @/data/products, @/hooks/*
- Key findings:
  * Cart & Favorites already use localStorage + useSyncExternalStore (no server sync)
  * Prisma/db.ts NOT used by any site component (default User/Post template only)
  * server.ts + frontend.tsx = socket.io demo, NOT part of the actual site
  * Only fetch("/api/videos") in ReviewsCarousel.tsx reads the filesystem API route
  * Forms (OrderModal, Contact, Newsletter) are stubs — call onSubmitted callback, no real submission
  * Products already a static TS array (42KB, 680 lines)
  * LiveChat is NOT websocket — just a floating button with messenger links
  * Site is always-dark themed with custom olive/coyote brand palette

Stage Summary:
- Full architecture understood. Migration is simpler than expected: site is already mostly static.
- Plan: copy all components/data/images into proper structure, set output:export, replace /api/videos
  fetch with static VIDEO_META, wire forms to FormSubmit, verify with lint + Agent Browser.

---
Task ID: T02
Agent: main
Task: Config & Build Setup — next.config.ts for static export, remove server-side files, bulk-copy all components/images/data into proper structure.

Work Log:
- Created directory structure: src/components/site/, src/data/, public/products/, public/videos/
- Bulk-copied 49 site components (PascalCase .tsx) + Toast.tsx (from "Toast (1).tsx") + use-scroll.ts into src/components/site/
- Bulk-copied 49 UI components (lowercase .tsx) into src/components/ui/ (overwriting template)
- Copied use-cart.ts + use-favorites.ts into src/hooks/ (kept template's use-toast.ts/use-mobile.ts — identical)
- Copied products.ts into src/data/products.ts
- Copied 36 product images into public/products/ (cover-*, leggings-*, poncho-*, raincoat-*, suit-*, ir-*.png)
- Copied logo.svg, hero-poster.svg, robots.txt into public/
- Removed src/app/api/ (API routes incompatible with static export)
- Removed src/lib/db.ts (Prisma client — not used by site)
- Removed prisma/ and db/ directories
- Wrote next.config.ts: output:"export", images.unoptimized:true, trailingSlash:true
- Wrote src/app/globals.css (full brand palette + animations from snaryaga)
- Wrote src/app/layout.tsx (Google fonts + StructuredData + Toaster)
- Wrote src/app/page.tsx (main page assembling all sections)

Stage Summary:
- Project structure fully assembled. next.config.ts configured for static export.
- All server-side dependencies removed (API routes, Prisma, db.ts, server.ts, middleware).
- Ready for T03 (data layer: replace /api/videos fetch in ReviewsCarousel).
- Forms still stubs (T05 will wire them to FormSubmit).
- Potential conflicts: ReviewsCarousel still fetches /api/videos (will break in static build — T03 fixes this).

---
Task ID: T05
Agent: full-stack-developer
Task: Wire OrderModal/Contact/Newsletter forms to FormSubmit.co via client-side fetch.

Work Log:
- Read worklog.md (T01-T02 context) and all 3 form components to understand structure, props, state, validation, and existing UI.
- OrderModal.tsx: added `submitting` + `error` state; converted `handleSubmit` to async with fetch POST to https://formsubmit.co/ajax/snaryaga36@mail.ru (JSON body: name, contact, product=productName, _subject=`Запрос на: ${productName}`, _template=table). On success: onSubmitted("Запрос отправлен! Менеджер свяжется с вами.") → reset fields → onClose(). On failure: setError, keep modal open. Added `disabled` + "Отправка…" text on button, error text below button in text-[#d97a5c].
- Contact.tsx: added `submitting` + `error` state; converted `handleSubmit` to async. Kept existing name/phone validation (setTouched + early return on invalid). Fetch body: name, phone, product, message, _subject="Новая заявка с сайта Снаряга36", _template=table. On success: onSubmitted("Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.") → reset all fields + touched. On failure: setError, no reset. Button: disabled + "Отправка…". Error text below button in text-[#d97a5c], above privacy note.
- Newsletter.tsx: added `submitting` + `error` state; converted `handleSubmit` to async. Kept existing email regex validation. Fetch body: email, _subject="Новая подписка на рассылку", _template=table. On success: onSubmitted("Подписка оформлена! Ждите новостей.") → reset email + touched. On failure: setError, no reset. Button: disabled + "Отправка…" (arrow svg hidden during submitting). Error text below button in text-[#d97a5c], above privacy note.
- Added comment in each file noting snaryaga36@mail.ru is a placeholder that should be replaced with the real owner's inbox.
- Preserved ALL existing Tailwind classes, CSS, validation logic, structure, "use client" directive, and onSubmitted prop pattern. Only added `disabled:opacity-60 disabled:cursor-not-allowed` to submit buttons (and `disabled:hover:translate-y-0` to Newsletter to keep its hover translate consistent when disabled).
- Ran `bun run lint` — passed with zero errors.

Stage Summary:
- All 3 site forms (OrderModal, Contact, Newsletter) now submit real data to FormSubmit.co via client-side fetch (compatible with static export — no server/API route needed).
- Each form has: loading state ("Отправка…" + disabled button), error state (red text in #d97a5c), success path (toast via onSubmitted + field reset), failure path (error shown, fields preserved).
- Existing validation, design, and UX intact. First real submission will trigger FormSubmit.co's one-time confirmation email to the inbox.
- Lint clean. Ready for T07/T08/T09 verification.

---
Task ID: T03
Agent: main
Task: Data Layer Decoupling — replace fetch('/api/videos') in ReviewsCarousel with static manifest.

Work Log:
- Created src/data/videos.ts with VideoMeta interface, VIDEO_META array, and derived VIDEO_SOURCES
- Refactored ReviewsCarousel.tsx: removed fetch("/api/videos") useEffect, imported VIDEO_META/VIDEO_SOURCES from @/data/videos
- ReviewsCarousel now reads video list synchronously from static manifest (no async, no API)
- use-scroll.ts already copied to src/components/site/ (imported as @/components/site/use-scroll)
- products.ts already in src/data/products.ts (copied in T02)

Stage Summary:
- All data is now static: products from src/data/products.ts, videos from src/data/videos.ts
- No more runtime API calls for data — fully compatible with output:'export'
- ReviewsCarousel UI unchanged (placeholder slots shown when VIDEO_META is empty)
- To add videos: drop .mp4 in public/videos/ + add entry to VIDEO_META in src/data/videos.ts

---
Task ID: T04
Agent: main
Task: Client State verification — cart & favorites on localStorage.

Work Log:
- Verified use-cart.ts (src/hooks/): uses useSyncExternalStore with getServerSnapshot returning EMPTY
- Verified use-favorites.ts (src/hooks/): same pattern, getServerSnapshot returns EMPTY
- Verified RecentlyViewed.tsx: same useSyncExternalStore pattern with SSR guard (typeof window check in readFresh)
- Verified CookieConsent.tsx: useSyncExternalStore with getConsentClient/getConsentServer
- All hooks handle SSR hydration correctly — no hydration mismatch risk
- No server-side sync — pure localStorage + custom events for cross-tab updates

Stage Summary:
- Cart, favorites, recently-viewed, cookie-consent all work client-side via localStorage
- No changes needed — code was already well-written with proper SSR guards
- All use useSyncExternalStore pattern: server renders EMPTY, client hydrates with EMPTY, then updates to real data

---
Task ID: T05
Agent: full-stack-developer (subagent)
Task: Wire OrderModal/Contact/Newsletter forms to FormSubmit.co via client-side fetch.

Work Log:
- OrderModal.tsx: added submitting/error state, async handleSubmit with fetch to formsubmit.co/ajax/snaryaga36@mail.ru
- Contact.tsx: added submitting/error state, async handleSubmit preserving existing validation
- Newsletter.tsx: added submitting/error state, async handleSubmit preserving email validation
- All forms: loading button text "Отправка…", disabled state, red error text on failure
- Email snaryaga36@mail.ru marked as placeholder (comment added to each file)
- bun run lint passes cleanly

Stage Summary:
- All 3 forms now submit to FormSubmit.co (free, no-signup form backend)
- Success: calls onSubmitted() toast + resets fields
- Failure: shows red error message, keeps form open with data intact
- UI/design preserved — only fetch logic, loading state, error display added

---
Task ID: T06
Agent: main
Task: SSR/SSG Hydration Fixes verification.

Work Log:
- Audited all 49 site components: 34 have "use client", 14 are pure presentational server components
- Checked all window/localStorage usage — all properly guarded:
  * HoverZoom: useSyncExternalStore with getCanHoverServer=false
  * RecentlyViewed: useSyncExternalStore with getServerSnapshot=EMPTY
  * CookieConsent: useSyncExternalStore with getConsentServer=null
  * Cart/Favorites: useSyncExternalStore with getServerSnapshot=EMPTY
  * ReadingProgress, BackToTop, Hero, SectionIndex: window access only inside useEffect
- Verified no server-only APIs (next/headers, next/cookies, getServerSideProps)
- Verified no ISR/revalidate/generateStaticParams usage
- Verified no dynamic imports needed (all components handle SSR via useSyncExternalStore)

Stage Summary:
- No hydration fixes needed — original code was already SSR-safe
- All client components use proper patterns: useEffect for browser APIs, useSyncExternalStore for state
- Static export will pre-render server components at build time, hydrate client components on load

---
Task ID: T07
Agent: main
Task: Integration — assemble page.tsx + layout.tsx + globals.css, verify all imports resolve.

Work Log:
- page.tsx assembles all 30+ site sections in correct order (Hero → Marquee → Categories → Catalog → ... → Footer)
- layout.tsx loads Google fonts (Inter, JetBrains_Mono, Oswald) + StructuredData + Toaster
- globals.css has full brand palette (olive/coyote/dark theme) + all keyframe animations
- Fixed relative import issues: ./use-cart, ./use-favorites → @/hooks/ (6 files), ./icons → @/components/ui/icons (1 file)
- All 49 site components + 49 UI components resolve correctly
- Page compiles in ~150-200ms, returns 200 with 329KB of rendered HTML
- All section IDs present: about, categories, compare, contact, faq, products, reviews, suits, tech, etc.

Stage Summary:
- Full page integration verified — all imports resolve, all sections render
- No module-not-found errors after import fixes
- Static export config (output:'export') works in dev mode without issues

---
Task ID: T08
Agent: main
Task: Lint + dev server verification.

Work Log:
- bun run lint passes cleanly (no errors, no warnings)
- Dev server runs on port 3000, compiles successfully
- All page loads return 200 (no 500s after import fixes)
- No hydration mismatch errors in dev log
- No server-only API usage (next/headers, next/cookies) detected
- No ISR/revalidate/generateStaticParams usage detected
- Only non-fatal 404: /hero.mp4 (optional background video, poster SVG shows as fallback)

Stage Summary:
- Code quality verified — lint clean, no runtime errors
- Static export migration complete and functional in dev mode

---
Task ID: T09
Agent: main
Task: Agent Browser end-to-end verification.

Work Log:
- Opened http://localhost:3000/ — page renders with correct title "СНАРЯГА36 — Маскировка нового поколения"
- No page errors, no console errors (only React DevTools info + HMR)
- Verified full page content: nav, hero marquee, categories, catalog with product cards, all sections
- Tested add to cart: clicked "Добавить в корзину" → cart counter updated to "1" ✓
- Tested add to favorites: clicked "Добавить в избранное" → favorites counter updated to "1" ✓
- Cart/favorites persist across page reload (localStorage verified on mobile reload — "1 товаров" shown)
- Tested product detail modal: clicked product card → modal opened "Детали: Рюкзак «Тень-20»" ✓
- Tested favorites drawer: opens/closes via nav button + Escape key ✓
- Tested contact form: filled name/phone/message → submitted → fetch executed (loading state worked) → fields preserved on FormSubmit.co activation-required response ✓
- Mobile responsiveness (iPhone 14): hamburger menu shows, cart/favorites counters visible, hero renders ✓
- Sticky footer: wrapper uses min-h-screen flex flex-col, main has flex-1, footer at bottom ✓
- Full page screenshot captured (3.1MB, desktop + mobile)

Stage Summary:
- ALL core interactions verified working in browser:
  * Cart add/counter/persistence ✓
  * Favorites add/counter/persistence ✓
  * Product detail modal open ✓
  * Favorites drawer open/close ✓
  * Contact form submit with fetch ✓
  * Mobile responsive layout ✓
  * Sticky footer ✓
- No hydration mismatches, no runtime errors
- Static export migration is COMPLETE and FULLY FUNCTIONAL

## MIGRATION COMPLETE
The snaryaga-site has been successfully migrated from SSR/ISR (Next.js standalone + Prisma + SQLite + API routes + WebSocket server) to a pure Static Export (SSG/SPA):
- output:'export' with images.unoptimized
- All data static (products.ts, videos.ts)
- Cart/favorites/recently-viewed via localStorage + useSyncExternalStore
- Forms submit to FormSubmit.co via client-side fetch
- No server runtime needed — deployable to any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.)

---
Task ID: POST-MERGE
Agent: main
Task: Add README, create PR feat/static-export → main, merge to main.

Work Log:
- Wrote comprehensive README.md (setup, build, deploy to GitHub Pages/Netlify/Cloudflare, project structure, config: change FormSubmit email, add products/videos, tech stack)
- Initial commit went to wrong branch (main) — fast-forwarded feat/static-export to include it, pushed
- Attempted PR creation: GitHub refused (422) — "feat/static-export has no history in common with main" (unrelated histories: origin/main = original flat upload, our branch = template-based)
- Solution: rebuilt feat/static-export ON TOP of origin/main using read-tree (single commit replacing all flat files with organized structure). Force-pushed.
- Created PR #2 via GitHub API: https://github.com/zhdanovm142-create/snaryaga-site/pull/2
  * mergeable: True, state: clean, 292 files changed (+16163 / -3043)
- Merged PR #2 via GitHub Merge API (merge method): merge commit d1a09fc
- Synced local main to origin/main (reset --hard)
- Verified: curl http://localhost:3000/ → HTTP 200, correct title "СНАРЯГА36 — Маскировка нового поколения", content renders

Stage Summary:
- Remote main (d1a09fc) now contains the full organized static-export code
- PR #2 created and merged (visible in repo history)
- feat/static-export branch preserved at 90ceda9 (the migration commit)
- README.md added with deploy instructions (GitHub Pages workflow included)
- Original flat code preserved in legacy/ folder
- Site verified working via curl (full e2e browser test done earlier in T09)

Final repo state on GitHub:
  main               d1a09fc (merged PR #2) ← beautiful organized static export
  feat/static-export 90ceda9 (migration commit)
  sbaryaga-gml       456dce9 (user's other branch, untouched)

---
Task ID: STATIC-BUILD
Agent: main
Task: Build static export and push to main in separate folder.

Work Log:
- Cleaned old out/ and .next/ build artifacts
- Ran `bun run build` (next build with output:'export') — compiled in 4.9s, generated 3 static pages
- Verified ./out/ contents: index.html (316KB), 404.html, _next/ (JS/CSS/fonts), products/ (images), videos/ (empty), logo.svg, hero-poster.svg, robots.txt — 30MB total
- Copied out/ → static-build/ (separate folder in repo for deployable artifact)
- Added static-build/README.md with deploy instructions (GitHub Pages, Netlify, any host)
- Added static-build/.nojekyll (disables Jekyll on GitHub Pages so _next/ folder works)
- Committed 90 files: "build: add static export to static-build/ (deployable artifact)"
- Pushed to main: d1a09fc..d3677a7

Verification (static-build/ served via python http.server on :3001):
- HTTP / → 200, title "СНАРЯГА36 — Маскировка нового поколения" ✓
- JS asset /_next/static/chunks/c39637bc9d8cb116.js → 200, 16KB ✓
- Product image /products/cover-1.jpg → 200 ✓
- Agent Browser: 16 sections rendered, footer present, nav present ✓
- No console errors, no page errors ✓
- Interactive test: clicked "Добавить в корзину" → cart counter 0→1, localStorage sn36-cart updated with product ✓
- CSS is inlined by Next.js (no separate .css files — better performance)

Stage Summary:
- static-build/ folder on main contains ready-to-deploy static site
- Works fully offline as SPA (no server needed at runtime)
- Deploy to GitHub Pages: Settings → Pages → branch main / folder /static-build
- To rebuild: `bun run build` then `cp -r out/* static-build/`

---
Task ID: SEO-VERIFY
Agent: main (Super Z sandbox)
Task: Применить SEO-план индексации к статик-билду и проверить, что билдер включает SEO-элементы в итоговую статику.

Work Log:
- Аудит: в закоммиченном static-build/ были title/description/OG/JSON-LD, НО отсутствовали sitemap.xml, canonical, og:url, og:image, а robots.txt был без директивы Sitemap
- layout.tsx: добавлены metadataBase (punycode xn--36-6kcao2dwaf3k.xn--p1ai), alternates.canonical, og:url, og:image=/products/ir-after.png (растровый, 1344x768), twitter:card=summary_large_image, закомментированный блок verification для Яндекс/Google
- public/robots.txt: добавлена директива Sitemap (punycode), поясняющие комментарии
- src/app/sitemap.ts: новый metadata-роут — генерирует out/sitemap.xml при next build (force-static)
- Пересборка: bun install && bun run build — OK, 4 статических роута (/, /_not-found, /sitemap.xml)
- Верификация out/ скриптом scripts-копии: 27/27 PASS (title, description, canonical, og:*, JSON-LD Organization/Product/FAQPage, нет noindex, предрендеренный контент ~17.7k символов, robots.txt с Sitemap, sitemap.xml валидный с lastmod)
- Песочница: python http.server :8765 на out/ — /, /robots.txt, /sitemap.xml, /products/ir-after.png, /logo.svg → все HTTP 200; agent-browser: title корректный, 18 секций, H1 «НЕВИДИМОСТЬ В ИК-СПЕКТРЕ», JSON-LD в DOM, ошибок консоли нет, скриншот подтверждает рендеринг
- static-build/ заменён новой сборкой + .nojekyll; README.md дополнен разделом «SEO и индексация» с чек-листом ручных шагов

Stage Summary:
- Статик-билдер (next build) теперь включает полный SEO-набор в итоговую статику: проверено автоматически (27/27) и в headless-браузере
- Осталось вручную (вне кода): регистрация в Яндекс.Вебмастер/GSC + верификация (код в layout.tsx verification), отправка sitemap, Яндекс.Карты/2ГИС, бэклинки ВК/Telegram

---
Task ID: SEO-VERIFY-2
Agent: main (Super Z sandbox)
Task: Добавить коды верификации Яндекс.Вебмастер и Google Search Console в статик-билд.

Work Log:
- layout.tsx: заполнен блок verification — google: S247pV9rj4NrXLqqU0EscFlY73aGiRyO-bfPHkcgorM, yandex: 40b673b993338f11
- public/yandex_40b673b993338f11.html: файл верификации Яндекса (копируется билдером в корень как есть)
- bun run build → out/; проверено: оба meta-тега в <head>, файл на месте байт-в-байт, HTTP 200, прежние 27/27 SEO-проверок проходят
- static-build/ пересобран + .nojekyll

Stage Summary:
- После деплоя верификация в обеих панелях пройдёт без DNS (meta-теги) и через файл (Яндекс)

---
Task ID: PERF-1
Agent: main (Super Z sandbox)
Task: Оптимизация производительности статик-экспорта по 5-пунктовому плану владельца (изображения, code splitting, процедурные свотчи, шрифты, видео-фасады).

Work Log:
- P1 Картинки: scripts/optimize-images.mjs (sharp, WebP q82, max 1280px, идемпотентный). 39 файлов: 11.4 МБ → 8.3 МБ. Исходники удалены из public/ после конверсии (остались в git-истории). Исключения: ir-after.png (og:image), *-poster.*, случаи «webp тяжелее jpg» (leggings-1.jpg остался оригиналом — ссылка откачена на /products/leggings-1.jpg после того, как e2e поймал 404). Пути в products.ts (28) и Poncho.tsx (13) → /products-opt/*.webp.
- P5a Видео: scripts/optimize-videos.mjs (ffmpeg CRF 28, -an, +faststart, защита от повторного перекодирования через scripts/.video-opt-cache.json и правило «принимать только если легче на ≥10%»). hero.mp4 3.9→2.1 МБ, tech-ir.mp4 9.0→6.9 МБ, ir-camera.mp4 — выигрыш <10%, оставлен, ir-thermal.mp4 — ниже порога 1 МБ. Итого 13.0→9.0 МБ.
- P5b Фасады: новый LazyVideo.tsx (клиентский, IntersectionObserver rootMargin 300px, play/pause по видимости) — подключён в Tech (серверная секция). Hero: <video> монтируется только после requestIdleCallback (fallback setTimeout 1800ms) — LCP остаётся на постере. IrCompare: preload="auto" → "none" (ролики грузятся только в зоне видимости, старт/пауза уже были на IO).
- P3 Свотчи: новый CamoSwatch.tsx — процедурные CSS-паттерны (мох/пиксель/мультикам/зелёный/синий/олива/койот), 0 байт. Интегрирован в кнопки расцветок Poncho вместо цветных квадратиков; превью-сцена теперь рендерит только АКТИВНОЕ фото (было 5 слоёв-картинок), смена — remount с fade-in (animate-in из tw-animate-css).
- P2 Code splitting: page.tsx → Server Component. Новые SiteContext.tsx (useSiteActions: openOrder/openDetail/openFavorites/openCart/showToast) + SiteChrome.tsx ("use client": всё состояние модалок, deep-link #product-*, useScrollReveal, Nav, оверлеи, FAB, тосты). Потребители переведены с пропсов на контекст: CatalogToolbar, Suits, BurgerChooser, RecentlyViewed, Newsletter, Contact. 10 клиентских секций ниже фолда — через next/dynamic с процедурными скелетонами (HTML пререндерится, SEO цел). Чисто серверные секции больше не попадают в JS-бандл.
- P4 Шрифты: проверено — уже оптимально (next/font/google, display: swap, cyrillic-сабсеты, автопредзагрузка). Изменений не требуется.
- Бонус из e2e: лайтбокс Poncho не закрывался по Escape (только клик) — добавлен обработчик; открытый лайтбокс блокировал указатель по всей странице.
- eslint.config.mjs: + "static-build/**" в ignores (минифицированные бандлы давали 1795 warnings и 12 errors). bun run lint — чисто.
- Верификация dev (agent-browser): 0 ошибок страницы/консоли, 16 секций; корзина добавляет товар и открывается (localStorage sn36-cart); модалка деталей открывается/закрывается (Esc); свотч «Пиксель» переключает превью на cover-2.webp; LazyVideo: 0 видео до скролла → играет после; IrCompare — 2 ролика играют в зоне видимости, драг разделителя 50→40→36 по координатам; mobile iPhone 14 — без горизонтального скролла, счётчик корзины сохраняется.
- Билд: bun run build → out/ 26 МБ (было 32 МБ в static-build), JS-чанки 1.2 МБ суммарно, крупнейший 224 КБ; sitemap.xml/robots/SEO-мета на месте; preload="none" ×2 в статике; hero-видео в HTML отсутствует (монтируется после idle).
- static-build/ пересобран + .nojekyll; автономная проверка python http.server: /, webp, jpg, mp4, sitemap, robots — все 200; в браузере на статике: title, 16 секций, 48 webp-картинок, корзина работает, 0 ошибок.
- README.md: разделы «Скрипты» (оптимизаторы) и «Производительность» (6 архитектурных решений).

Stage Summary:
- Все 5 пунктов плана внедрены и проверены в браузере (dev + статика).
- Первоначальная загрузка: 0 видео при открытии (было 3 autoplay ≈ 17 МБ), продуктовые фото −27% веса, Poncho грузит 1 фото вместо 5, серверные секции выпали из JS-бандла, нижние секции — ленивые чанки.
- Артефакт деплоя static-build/ 32 → 26 МБ. SEO-набор (title/canonical/OG/JSON-LD/sitemap/верификации) не тронут и подтверждён в новой сборке.

---
Task ID: PERF-MEASURE-3
Agent: main (Super Z sandbox)
Task: Замер скорости/размера новой сборки + ответ про переиндексацию (Яндекс.Вебмастер / Google).

Work Log:
- agent-browser на python http.server :8766 (out/): первичная загрузка 22 запроса; HTML 422 КБ raw / 59 КБ gzip, CSS 178/26 КБ, JS 709/198 КБ (7 чанков), шрифты 174 КБ (7 woff2), DCL 347 мс, Load 545 мс (localhost)
- hero.mp4 (2.2 МБ) стартует только после idle (~1.8 с) — в критический путь не входит, подтверждено
- Полный скролл страницы: 54 запроса, 14.7 МБ (видео ≈ 13.6 МБ: hero 2.2 + tech-ir 6.9 + 2 ИК-ролика ~4.5)
- Нюанс: постеры ir-camera-poster.jpg (183 КБ) + ir-thermal-poster.jpg (37 КБ) грузятся сразу — dynamic() в Next 16 пререндерит HTML <video poster>, Chrome тянет постер при парсинге. Косметика, можно поленить позже
- Живой сайт проверен curl: live HTML 320 КБ, маркеры products-opt=0, preload="none"=0, hero.mp4 инлайном=1 → НА ПРОДАЕ СТАРАЯ SEO-СБОРКА БЕЗ PERF-1. Sitemap.xml на проде есть (lastmod 13:54Z), robots.txt с Sitemap-директивой есть, верификации не слетят (мета google+yandex подтверждены в out/)

Stage Summary:
- Новая сборка готова и измерена: старт ~460 КБ gzip критических ресурсов; деплоить static-build/ (равен out/), на проде пока старая версия
- Переиндексация: после деплоя — GSC «Проверка URL → Запросить индексирование» + Яндекс.Вебмастер «Переобход страниц»; GA переиндексацию не делает вообще

---
Task ID: VERIFY-4
Agent: main (Super Z sandbox)
Task: Повторная полная перепроверка статик-билда + ворклог для агентов + детальный разбор проекта.

Work Log:
- bun run build повторно: Turbopack OK, 4 статических роута (/, /_not-found, /sitemap.xml), оптимизаторы отработали идемпотентно ([optimize-videos] «Изменений нет»)
- Новый постоянный артефакт: scripts/verify-static.mjs — комплексный верификатор статики (25 проверок, 3 блока):
    A (SEO, 19): title/description/canonical/og:title/og:url/og:image(растровый ir-after.png)/twitter:card/JSON-LD Organization+Product+FAQPage/google+yandex verification/нет noindex/H1/объём пререндера (144 387 симв. текста)/robots.txt с Sitemap/sitemap.xml валидный с lastmod/yandex-файл/favicon.ico+favicon.svg
    B (целостность, 2): каждый URL из index.html (56 ссылок: src/href/poster/content) существует на диске; все ассеты, на которые ссылаются JS-чанки (34 ссылки /products-opt|/products), существуют — защита от регрессии типа leggings-404
    C (perf-маркеры, 4): hero.mp4 отсутствует в HTML (idle-монтаж), preload="none" у ИК-видео, пути /products-opt/ используются, verification-мета ×2
- Итог: 25/25 PASS на out/ И на static-build/ (проверка прогнана по обоим каталогам). Правка A13: H1 в DOM «Невидимость<br/><span>в ИК-спектре</span>», uppercase даёт CSS — регэксп приведён к реальной разметке
- Размеры: out/ = 24.9 МБ (html 0.5 МБ, js 0.8 МБ, css 173 КБ, картинки 8.9 МБ, видео 13.7 МБ, шрифты 369 КБ); index.html 378 КБ raw → 58 КБ gzip
- static-build/ пересобран из out/ + .nojekyll ( rm -rf && cp -r )
- Браузерный smoke (agent-browser, python :8766 → out/): title/H1/18 секций/49 img (48 webp из products-opt)/1 блок JSON-LD/lang=ru; клик «Добавить Рюкзак „Тень-20“ в корзину» → localStorage sn36-cart записан; iPhone (390px): 18 секций, горизонтального скролла нет; page errors — пусто
- Живой сайт (снаряга36.рф): по-прежнему старая SEO-сборка (products-opt=0, hero.mp4 инлайном) — static-build/ ждёт деплоя (см. Task ID PERF-MEASURE-3)

Stage Summary:
- Статик-билд подтверждён в третий раз и впервые — автоматическим повторяемым верификатором: scripts/verify-static.mjs (25/25). Агентам: перед деплоем запускать «node scripts/verify-static.mjs out»
- Для агентов создан /home/z/my-project/download/PROJECT-OVERVIEW.md — детальный разбор проекта (архитектура, карта файлов, механики, perf, SEO, пайплайн, деплой, регламент)

---
Task ID: PR-1
Agent: main (Super Z sandbox)
Task: Создать пул-реквест с результатами верификации и документации (токен владельца — из git remote).

Work Log:
- Диагностика: токен владельца уже зашит в remote URL (.git/config), репо zhdanovm142-create/snaryaga-site, GitHub Pages ВЫКЛЮЧЕН (has_pages: false), живой сайт — nginx-хостинг → деплой static-build на хостинг выполняется вне GitHub
- GitHub API: PR #22 (perf-оптимизации) уже смёржен 2026-09-24T14:41Z; origin/main содержит всю перф-работу
- Локально 3 автокоммита с мусором (skills/ песочницы, скриншоты) — НЕ пушил как есть
- Песочница автокоммитит в main и сбрасывает стейджинг → ветка+файлы+коммит+пуш выполнены одной атомарной командой
- Ветка chore/verify-and-agent-docs от origin/main: только полезное (static-build/, scripts/verify-static.mjs, scripts/.video-opt-cache.json, download/PROJECT-OVERVIEW.md, worklog.md) — 1 коммит a8ca716
- PR #23 открыт через API: https://github.com/zhdanovm142-create/snaryaga-site/pull/23

Stage Summary:
- PR #23 ждёт мержа: верификатор 25 проверок + verified static-build + PROJECT-OVERVIEW + worklog
- После мержа: выложить static-build/ на nginx-хостинг, потом переобход Яндекс.Вебмастер + GSC
- Токен из чата (ghp_HuIB...) — владелецу отозвать; в remote он не светится в чате

---
Task ID: CI-1
Agent: main (Super Z sandbox)
Task: Автопересборка static-build после каждого мержа в main (GitHub Actions).

Work Log:
- Проверена почва репо: 38 webp в public/products-opt, исходники (og png, постеры, mp4, leggings-1.jpg), bun.lock, scripts/verify-static.mjs и .video-opt-cache.json — всё трекается; out/ в .gitignore, static-build/ нет; ffmpeg предустановлен на ubuntu-latest
- Подготовлен .github/workflows/static-build.yml: push в main + workflow_dispatch (ручной запуск); bun install --frozen-lockfile → bun run build → verify-static out/ (25 проверок) → sync static-build/ + .nojekyll → повторная верификация → коммит в main «ci: автопересборка static-build после мержа [skip ci]» (защита от цикла), также коммитится .video-opt-cache.json
- permissions: contents: write; concurrency: static-build с cancel-in-progress; автор — github-actions[bot]
- ПУШ WORKFLOW ЗАБЛОКИРОВАН: PAT владельца имеет только scope «repo», а для файлов .github/workflows нужен scope «workflow» (push отклонён GitHub: refusing to allow a PAT to create or update workflow). Файл передан владельцу через комментарий PR #23 — добавить через web-UI или выдать токен с repo+workflow
- Контракт сервера: nginx отдаёт static-build/ из main → после мержа достаточно git pull

Stage Summary:
- После добавления workflow (web-UI или новый токен) и мержа PR #23 Actions сам пересобирает и коммитит свежий static-build в main; на сервере — git pull

---
Task ID: ARCH-1
Agent: main (Super Z sandbox)
Task: Удалить из публичной версии 4 блока (счётчик подписчиков, карточка «Прозрачность», кубик «0 уходит на сторону», секция #size-guide), заархивировать их в legacy/blocks с документацией, пересобрать static-build.

Work Log:
- Ветка chore/archive-ui-blocks от main (2c1f8ce); правки только в исходниках src/, не в dist
- Newsletter.tsx: удалены аватары-кружки и «5000+ подписчиков»; бейдж «1 письмо / месяц», форма и преимущества сохранены
- Charity.tsx: удалена карточка «Прозрачность» (💬) из CHARITY_FEATS; «Сообщество» растянута на её место через sm:col-span-2 (последний элемент map); удалён кубик «0 / уходит на сторону» из IMPACT_STATS; сетка статистики grid-cols-3 → grid-cols-2
- SizeGuide.tsx + SizeCalculator.tsx удалены из src (заархивированы); сняты все 4 вхождения #size-guide: page.tsx (import + <SizeGuide/>), Footer.tsx (пункт «Размерная сетка»), SectionIndex.tsx (nav «Размеры»), ProductDetailModal.tsx (ссылка «Таблица размеров →»)
- legacy/blocks/{newsletter-subscriber-count,charity-transparency-card,charity-stat-zero-away,size-guide-section}/: original-component.tsx из git show HEAD, notes.md по шаблону (статус/дата/причина/место/зависимости/инструкция возврата), size-table-data.json для размерной сетки; legacy/README.md дополнен индексной таблицей
- bun run lint: 0 errors (2 старых warning в verify-static.mjs); bun run build: OK; node scripts/verify-static.mjs out → 25 PASS, 0 FAIL
- Проверки dist: «подписчиков», «Прозрачность» (карточка), «уходит на сторону», «size-guide», «Размерная сетка», «Калькулятор размера», «Подбор размера», «Таблица размеров» — отсутствуют; единственный «5000+» в сборке — легитимный «5000+ изделий выпущено» (About/TrustCertificates); find out static-build -iname "*legacy*" — пусто
- static-build/ пересобран: rm -rf static-build && cp -r out static-build && touch .nojekyll; verify-static static-build → 25 PASS
- Agent Browser smoke (localhost, desktop 1440 + mobile 375): секций #size-guide нет, ссылок #size-guide 0, битых якорей нет, консоль чистая; charity: 3 карточки, «Сообщество» gridColumnEnd=span 2, 2 кубика по 158px в ряд; рассылка: форма+бейдж на месте, соцдоказательства нет

Stage Summary:
- Публичная версия без 4 архивированных блоков, вся документация возврата в legacy/blocks, static-build пересобран и проверен (25/25); деплой после мержа в main — git pull на сервере

---
Task ID: SEO-1 (webDevReview раунд 4)
Agent: main (Super Z sandbox)
Task: SEO-раунд по запросу владельца — обновление sitemap.xml для индексации в Яндекс.Вебмастер/GSC, сниппеты по вариантам бренда, white-hat чеклист.

Work Log:
- Диагностика LIVE (curl, 2026-09-25): sitemap/robots/canonical/og уже корректны (punycode), body пререндерен, JSON-LD есть; НО: /contact → 404, www.домен → 200 вместо 301 (дубль главной), в Organization email: undefined, sameAs без Telegram
- StructuredData.tsx: email → info@снаряга36.рф (совпадает с футером), contactPoint (sales, ru/en, RU), sameAs + t.me/snaryaga36, BRAND_ALIASES + 4 дефисных варианта; перенесён из layout.tsx в page.tsx (FAQPage только на странице с видимым FAQ — правило Google)
- НОВАЯ СТРАНИЦА src/app/contact/page.tsx (/contact/): серверный компонент, 0 клиентского JS; свой title/description/canonical/og; JSON-LD ContactPage + BreadcrumbList; каналы tel/TG/WA/VK/mailto + адрес + график; CTA → /#contact; в футере главной ссылка «Контакты (страница)»
- sitemap.ts: 2 URL — «/» (weekly, 1.0) и «/contact/» (monthly, 0.8); без якорей/utm/http/www
- SEO.md: канонические URL, готовый конфиг nginx 301 (www→canonical, http→https, /index.html→/), чеклисты Яндекс.Вебмастер + GSC, список «что НЕЛЬЗЯ»
- verify-static.mjs: 25 → 32 проверок (canonical/JSON-LD/каналы /contact/, отсутствие FAQPage на /contact/, ссылка из футера, sitemap 2 URL чистых)
- Сборка: lint 0 errors (2 старых warning в verify-static.mjs); bun run build OK; out и static-build → 32 PASS / 0 FAIL; static-build пересобран (rm -rf + cp + .nojekyll)
- agent-browser QA (localhost:8789): /contact/ desktop 1440 + mobile 375 — рендер полный, консоль чистая; футер sticky: footerBottom==vh, gap 0; переходы: футер-ссылка → /contact/, brand-линк → главная, CTA → /#contact — все работают
- 3 коммита (69ee87c fix(seo), d1ca713 feat(contact), d7781f1 build) запушены в chore/archive-ui-blocks; комментарий в PR #25: https://github.com/zhdanovm142-create/snaryaga-site/pull/25#issuecomment-5832099794

Stage Summary:
- Sitemap актуален: 2 канонических URL; сниппет-разметка усилена (email/contactPoint/алиасы); /contact/ — второй вход для роботов
- ДЕЙСТВИЯ ВЛАДЕЛЬЦА: 1) настроить 301 на nginx (SEO.md §3 — www сейчас 200!), 2) после деплоя — sitemap + переобход в Вебмастере/GSC, 3) токен отозвать
- Риски: пока PR #25 не смержен, /contact/ на LIVE нет (404 в sitemap не попадает — безопасно)

---
Task ID: BUG-1 (webDevReview раунд 5)
Agent: main (Super Z sandbox)
Task: Фикс бага каталога «карточки пропадают при выборе категорий и не возвращаются назад» (сообщение владельца + файл с описанием; файл не дошёл, симптом воспроизведён по описанию).

Work Log:
- Воспроизведение (agent-browser, static-build :8789, до фикса): Аксессуары → Все → «Найдено: 14», cards=14, visible=4; далее Бугор → Штурмовые → Все: cards=14, visible=0. Скрин download/qa/bug-before-filter.png
- Причина: карточки каталога с классом .reveal (opacity:0 до .is-visible), useScrollReveal сканирует DOM один раз при загрузке (deps []) — перемонтированные при смене фильтра узлы никто не наблюдает → opacity:0 навсегда. Тот же латентный баг у «Вы недавно смотрели» (монтируется после гидратации)
- Фикс 1: CatalogToolbar.tsx — карточки (grid+list) переведены с .reveal на CSS-анимацию .sn-card-in + каскад animationDelay index*45мс (cap 11); комментарий-предупреждение в коде
- Фикс 2: use-scroll.ts — MutationObserver (body, subtree) подхватывает динамически добавленные .reveal: во вьюпорте — сразу is-visible, ниже — в IntersectionObserver
- Фикс 3: globals.css — @keyframes sn-card-in (fill-mode both); reduced-motion покрыт существующим media-query
- QA после фикса (новая сборка, чистый профиль браузера): 9 шагов категорий туда-обратно — cards=found=visible на каждом (14/14 после каждого «Все»); поиск+категория+сброс → 14/14; grid↔list → 14/14; «Вы недавно смотрели» 2/2 reveal раскрыты после скролла; модалка товара (кнопка «Детали»!) открывается/закрывается, localStorage sn36-recently-viewed пишется; /contact/ без регрессий (canonical punycode, 0 reveal, 0 ошибок)
- Консоль 0 ошибок; скрины: bug-after-catalog/cards-grid/filter-bugor/mobile375 (desktop 1280 + mobile 375)
- lint 0 errors; build OK; verify-static out и static-build 32 PASS / 0 FAIL; static-build пересобран
- Коммит bcc196d запушен; отчёт в PR #25: https://github.com/zhdanovm142-create/snaryaga-site/pull/25#issuecomment-5832825719

Stage Summary:
- Баг каталога закрыт на двух уровнях (CSS-анимация карточек — по построению; MutationObserver — страх-net для всех динамических .reveal); попутно исправлен вечный «прыжок» невидимости «Вы недавно смотрели»
- Примечание: токен в remote — формат x-access-token:<TOKEN> (API принимает часть после двоеточия); напоминание владельцу отозвать токен
- Далее: мерж PR #25 владельцем → деплой static-build → nginx 301 (SEO.md §3) → Вебмастер/GSC
