/**
 * Комплексная верификация статического билда (out/).
 *
 * Проверяет три уровня:
 *  A. SEO-набор: title/description/canonical/OG/Twitter/JSON-LD/verifications/
 *     robots.txt + Sitemap/sitemap.xml/favicon/noindex/H1/объём пререндера.
 *  B. Целостность ассетов: каждый URL, на который ссылается index.html
 *     (src/href/poster/og:image), обязан существовать на диске — ловит 404
 *     типа «leggings-1.jpg» из прошлого.
 *  C. Замеры: размеры по типам, gzip-оценка текстовых ассетов,
 *     маркеры perf-оптимизаций (preload="none", отсутствие hero.mp4 в HTML,
 *     пути /products-opt/).
 *
 * Запуск:  node scripts/verify-static.mjs  [каталог, по умолчанию out]
 * Выход:   PASS/FAIL по каждой проверке, код возврата 1 при любом FAIL.
 */

import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { gzipSync } from "zlib";

const ROOT = join(process.cwd(), process.argv[2] || "out");
const html = readFileSync(join(ROOT, "index.html"), "utf8");

let pass = 0;
let fail = 0;
const check = (name, ok, detail = "") => {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/* ---------- A. SEO ---------- */
check("A1 title", /<title>[^<]{20,}<\/title>/.test(html));
check("A2 description", /<meta name="description" content="[^"]{50,}"/.test(html));
check("A3 canonical", /<link rel="canonical" href="https:\/\/xn--36-6kcao2dwaf3k\.xn--p1ai\/"/.test(html));
check("A4 og:title+og:url", html.includes('property="og:title"') && html.includes('property="og:url"'));
check("A5 og:image растровый", /property="og:image" content="[^"]*ir-after\.png"/.test(html));
check("A6 twitter:card", html.includes('name="twitter:card" content="summary_large_image"'));
check("A7 JSON-LD Organization", html.includes('"@type":"Organization"'));
check("A8 JSON-LD Product", html.includes('"@type":"Product"'));
check("A9 JSON-LD FAQPage", html.includes('"@type":"FAQPage"'));
check("A10 google-site-verification", html.includes("S247pV9rj4NrXLqqU0EscFlY73aGiRyO-bfPHkcgorM"));
check("A11 yandex-verification", html.includes('name="yandex-verification" content="40b673b993338f11"'));
check("A12 нет noindex", !html.includes("noindex"));
check("A13 H1 пререндерен", /<h1[^>]*>\s*Невидимость(<br\/?>)?\s*<span[^>]*>в ИК-спектре<\/span>/i.test(html));
check("A14 объём пререндера > 15к симв.", html.replace(/<[^>]+>/g, "").length > 15000, `${html.replace(/<[^>]+>/g, "").length} символов`);

const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
check("A15 robots.txt + Sitemap", robots.includes("Sitemap: https://xn--36-6kcao2dwaf3k.xn--p1ai/sitemap.xml"));

const sitemapPath = join(ROOT, "sitemap.xml");
if (existsSync(sitemapPath)) {
  const sm = readFileSync(sitemapPath, "utf8");
  check("A16 sitemap.xml валиден", sm.includes("<urlset") && sm.includes("<loc>https://xn--36-6kcao2dwaf3k.xn--p1ai/</loc>") && /<lastmod>\d{4}-\d{2}-\d{2}/.test(sm));
} else check("A16 sitemap.xml существует", false);

check("A17 yandex verify-файл", existsSync(join(ROOT, "yandex_40b673b993338f11.html")));
check("A18 favicon.ico в корне", existsSync(join(ROOT, "favicon.ico")));
check("A19 favicon.svg в корне", existsSync(join(ROOT, "favicon.svg")));

/* A20–A24: отдельная страница контактов /contact/ */
const contactPath = join(ROOT, "contact", "index.html");
if (existsSync(contactPath)) {
  const contact = readFileSync(contactPath, "utf8");
  check("A20 contact: canonical /contact/", contact.includes('<link rel="canonical" href="https://xn--36-6kcao2dwaf3k.xn--p1ai/contact/"'));
  check("A21 contact: title/description с брендом", /Контакты СНАРЯГА36 \(Снаряга 36\)/.test(contact) && /Снаряга 36/.test(contact));
  check("A22 contact: JSON-LD ContactPage", contact.includes('"@type":"ContactPage"') && contact.includes('"@type":"BreadcrumbList"'));
  check("A23 contact: каналы (tel/tg/vk/wa/mail)", ["tel:+79515596622", "https://t.me/snaryaga36", "https://vk.ru/club240233552", "https://wa.me/79515596622", "mailto:info@снаряга36.рф"].every((u) => contact.includes(u)));
  check("A24 contact: FAQPage schema НЕ утекла на /contact/", !contact.includes('"@type":"FAQPage"'));
  check("A25 главная: ссылка на /contact/ в футере", html.includes('href="/contact/"'));
} else {
  check("A20 contact/index.html существует", false);
}

/* A26: sitemap содержит оба URL, без якорей/дублей */
if (existsSync(sitemapPath)) {
  const sm = readFileSync(sitemapPath, "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
  const need = [`https://xn--36-6kcao2dwaf3k.xn--p1ai/`, `https://xn--36-6kcao2dwaf3k.xn--p1ai/contact/`];
  const locsClean = locs.every((u) => u.startsWith("https://xn--36-6kcao2dwaf3k.xn--p1ai") && !u.includes("#") && !u.includes("www") && !u.includes("utm"));
  check("A26 sitemap: / и /contact/, 2 URL, без мусора", locs.length === 2 && need.every((u) => locs.includes(u)) && locsClean, `${locs.length} URL`);
} else check("A26 sitemap.xml существует", false);

/* ---------- B. Целостность ассетов ---------- */
const urls = new Set();
const re = /(?:src|href|poster|content)="(\/[^"#?]+)(?:[?#][^"]*)?"/g;
let m;
while ((m = re.exec(html)) !== null) {
  const u = m[1];
  if (/\.(js|css|webp|jpe?g|png|svg|mp4|ico|woff2?|txt|xml|html)$/.test(u)) urls.add(u);
}
const ogImg = html.match(/property="og:image" content="([^"]+)"/);
if (ogImg) urls.add(new URL(ogImg[1]).pathname);

let missing = [];
for (const u of urls) {
  const p = join(ROOT, decodeURIComponent(u));
  if (!existsSync(p)) missing.push(u);
}
check("B1 все URL из index.html существуют", missing.length === 0, missing.length ? "404: " + missing.join(", ") : `${urls.size} ссылок ок`);

/* битые ссылки внутри JS-чанков на /products-opt|/products (выборочно) */
const chunkDir = join(ROOT, "_next", "static", "chunks");
const chunkRefs = new Set();
for (const f of readdirSync(chunkDir)) {
  if (!f.endsWith(".js")) continue;
  const s = readFileSync(join(chunkDir, f), "utf8");
  const r2 = /\/(products-opt|products)\/[a-zA-Z0-9._-]+\.(webp|jpe?g|png|mp4)/g;
  let r;
  while ((r = r2.exec(s)) !== null) chunkRefs.add(r[0]);
}
const missingChunks = [...chunkRefs].filter((u) => !existsSync(join(ROOT, u)));
check("B2 ассеты из JS-чанков существуют", missingChunks.length === 0, missingChunks.length ? "404: " + missingChunks.join(", ") : `${chunkRefs.size} ссылок ок`);

/* ---------- C. Perf-маркеры и размеры ---------- */
check("C1 hero.mp4 НЕ в HTML (idle-монтаж)", !html.includes("hero.mp4"));
check("C2 preload=none у видео сравнения", html.includes('preload="none"'));
check("C3 пути /products-opt/ используются", html.includes("/products-opt/"));
check("C4 верификационные мета ×2", (html.match(/(google-site-verification|yandex-verification)/g) || []).length >= 2);

const walk = (dir, cb) => {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    f.isDirectory() ? walk(p, cb) : cb(p);
  }
};
const buckets = { html: 0, js: 0, css: 0, image: 0, video: 0, font: 0, other: 0 };
let total = 0;
walk(ROOT, (p) => {
  const sz = statSync(p).size;
  total += sz;
  if (p.endsWith(".html")) buckets.html += sz;
  else if (p.endsWith(".js")) buckets.js += sz;
  else if (p.endsWith(".css")) buckets.css += sz;
  else if (/\.(webp|jpe?g|png|svg|ico)$/.test(p)) buckets.image += sz;
  else if (p.endsWith(".mp4")) buckets.video += sz;
  else if (/\.woff2?$/.test(p)) buckets.font += sz;
  else buckets.other += sz;
});
const kb = (n) => (n / 1024).toFixed(0) + " КБ";
const mb = (n) => (n / 1048576).toFixed(1) + " МБ";
console.log("\n--- Размеры out/ ---");
console.log(`всего: ${mb(total)} | html: ${mb(buckets.html)} | js: ${mb(buckets.js)} | css: ${kb(buckets.css)} | картинки: ${mb(buckets.image)} | видео: ${mb(buckets.video)} | шрифты: ${kb(buckets.font)}`);
const gz = (p) => gzipSync(readFileSync(p)).length;
const gzHtml = gz(join(ROOT, "index.html"));
console.log(`index.html: ${kb(html.length)} raw → ${kb(gzHtml)} gzip`);

console.log(`\nИТОГО: ${pass} PASS, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
