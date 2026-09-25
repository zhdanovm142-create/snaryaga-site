# SEO: канонический домен, sitemap, редиректы

Канонический домен сайта — **снаряга36.рф** (punycode: `xn--36-6kcao2dwaf3k.xn--p1ai`).
Все служебные URL (canonical, og:url, sitemap.xml, robots.txt, JSON-LD) используют
punycode-форму, т.к. формат требует ASCII.

## 1. Канонический вид

| Что | Значение |
|---|---|
| Отображение бренда | СНАРЯГА36 / Снаряга36 |
| Домен | снаряга36.рф |
| Punycode | `xn--36-6kcao2dwaf3k.xn--p1ai` |
| Canonical главной | `https://xn--36-6kcao2dwaf3k.xn--p1ai/` |
| Canonical контактов | `https://xn--36-6kcao2dwaf3k.xn--p1ai/contact/` |

Якорь `#contact` — это позиция на главной, а **не отдельный URL**. В sitemap
якоря, `?utm_*`, `http://`, `www`, `index.html` и дубли на кириллице не попадают.

## 2. Sitemap и robots

- `src/app/sitemap.ts` — генерирует `out/sitemap.xml` при сборке.
  В карте только реальные страницы (200 OK): `/` и `/contact/`.
  Новая страница добавляется сюда **только после** того, как реально существует.
- `public/robots.txt` — открытая индексация + директива
  `Sitemap: https://xn--36-6kcao2dwaf3k.xn--p1ai/sitemap.xml`.

## 3. ОБЯЗАТЕЛЬНЫЕ 301-редиректы на сервере (nginx)

⚠️ Проверено 2026-09-25: `https://www.xn--36-6kcao2dwaf3k.xn--p1ai/` отвечает
**200**, а не 301 — это дубль главной в глазах поисковиков. Нужна настройка на
сервере (в репозитории её сделать нельзя). Целевой конфиг:

```nginx
# --- Варианты написания домена -> канонический host ---
server {
    listen 443 ssl;
    server_name www.xn--36-6kcao2dwaf3k.xn--p1ai;
    # ... ssl_certificate / ssl_certificate_key те же, что у основного;
    #     для www обязателен ОТДЕЛЬНЫЙ сертификат (SAN) или wildcard
    return 301 https://xn--36-6kcao2dwaf3k.xn--p1ai$request_uri;
}

server {
    listen 80;
    server_name xn--36-6kcao2dwaf3k.xn--p1ai www.xn--36-6kcao2dwaf3k.xn--p1ai;
    # HTTP -> HTTPS
    return 301 https://xn--36-6kcao2dwaf3k.xn--p1ai$request_uri;
}

# --- Основной server: убрать /index.html и слеш-дубли ---
server {
    listen 443 ssl;
    server_name xn--36-6kcao2dwaf3k.xn--p1ai;
    root /var/www/snaryaga-site;

    # /index.html -> /
    if ($request_uri = /index.html) {
        return 301 /;
    }
    # /contact -> /contact/ (nginx и так отдаёт 301 для каталога без слеша,
    # правило ниже — страховка при absolute_redirect off)
    absolute_redirect on;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
}
```

После настройки проверить:

```bash
curl -sI http://xn--36-6kcao2dwaf3k.xn--p1ai/            | head -3   # 301 -> https
curl -sI https://www.xn--36-6kcao2dwaf3k.xn--p1ai/       | head -3   # 301 -> без www
curl -sI https://xn--36-6kcao2dwaf3k.xn--p1ai/index.html | head -3   # 301 -> /
curl -sI https://xn--36-6kcao2dwaf3k.xn--p1ai/contact    | head -3   # 301 -> /contact/
curl -sI https://xn--36-6kcao2dwaf3k.xn--p1ai/contact/   | head -3   # 200
```

Если используется другой хостинг (не nginx) — то же правило одним предложением:
**любой адрес, кроме канонического, отдаёт 301 на канонический**, канонический — 200.

## 4. Панели вебмастеров

Метатеги верификации уже в билде (`src/app/layout.tsx`):
`google-site-verification` и `yandex-verification`, плюс файл-валидатор
`public/yandex_40b673b993338f11.html`.

### Яндекс.Вебмастер (webmaster.yandex.ru)
1. Добавить сайт `https://xn--36-6kcao2dwaf3k.xn--p1ai/` (именно https-версию).
2. Отправить `sitemap.xml` на переобход; после деплоя нажать «Переобход страниц»
   для `/` и `/contact/`.
3. Справочник организаций: добавить/подтвердить организацию (Воронеж,
   Купянский пер., 11; телефон; график) — влияет на сниппет и карточку.
4. Регион сайта: Воронеж (Настройки → Регион).
5. В «Представление в поиске» — проверить, что не создано быстрых ссылок на
   дубли (www/кириллица), при появлении — убрать после настройки 301.

### Google Search Console (search.google.com/search-console)
1. Ресурс Domain `xn--36-6kcao2dwaf3k.xn--p1ai` (DNS-верификация) либо
   URL-prefix https-версии (метатег уже есть).
2. Sitemaps → отправить `https://xn--36-6kcao2dwaf3k.xn--p1ai/sitemap.xml`.
3. Проверка URL: `/` и `/contact/` → «Запросить индексирование».
4. Через 1–2 недели: Отчёты → Страницы — убедиться, что нет «дубликатов без
   canonical» по www/http-версиям.

## 5. Варианты написания бренда (white-hat)

Используются **в контенте и разметке одной и той же страницы** — не отдельными
страницами и не отдельными URL:

- title/description/keywords (layout.tsx + contact/page.tsx);
- `alternateName` в JSON-LD Organization/WebSite (StructuredData.tsx);
- FAQ «СНАРЯГА36 или Снаряга 36 — как правильно?» (видимый текст + FAQPage);
- подпись в футере «© … СНАРЯГА36 (Снаряга 36)».

### Что НЕЛЬЗЯ
- Не создавать страницы под `снаряга 36`, `снаряга-36`, `snaryaga36` и т.п. —
  это дубли/дорвеи.
- Не добавлять в sitemap якоря, `utm`, http/www-варианты, верхний регистр,
  кириллический дубль домена.
- Не использовать скрытый текст, переспам ключами, клоакинг, ссылочные схемы.
- Метки вида `-снаряга36` — это не домены; в URL/canonical их не существует.
- `snaryaga36.ru` не использовать, пока домен реально не куплен и не настроен
  301 на канонический.

## 6. Чеклист проверки после деплоя

- [ ] `GET /sitemap.xml` → 200, содержит `/` и `/contact/`, punycode-домен
- [ ] `GET /robots.txt` → 200, есть строка `Sitemap:`
- [ ] `GET /` → 200, в HTML: canonical, og:url, JSON-LD Organization (email,
      contactPoint, sameAs), google/yandex verification
- [ ] `GET /contact/` → 200, canonical `/contact/`, JSON-LD ContactPage
- [ ] `GET /contact` → 301 на `/contact/`
- [ ] `www` → 301 на канонический (после правки nginx, см. §3)
- [ ] Локальная проверка сборки: `node scripts/verify-static.mjs out` и
      `node scripts/verify-static.mjs static-build` — все PASS
