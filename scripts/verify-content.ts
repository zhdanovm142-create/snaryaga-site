/**
 * ФАКТЧЕКЕР КОНТЕНТА для статик-билдера агентов.
 *
 * Ловит класс ошибок, который уже приводил к багам на проде:
 *   1. Ссылка на несуществующий файл (404 «отвалившихся» фоток).
 *   2. Одно фото используется РАЗНЫМИ товарами («чужое фото» —
 *      так у чехла на рюкзак оказалась фотка рюкзака Фантома).
 *   3. main === hover — «одну фотку используют» для обоих слотов
 *      (так случилось у «Фантома-50» после потери CDN).
 *   4. Битые метаданные: пустые alt, description, price, дубликаты id.
 *
 * Уровни: FAIL (блокирует PR, exit 1) и WARN (виден в каждом прогоне,
 * пока владелец не пришлёт реальные фото; гасится полем photoPending).
 *
 * Запуск: bun scripts/verify-content.ts   (bun транслирует TS на лету)
 * Часть гейта: bun run release  → build + verify-content + verify-static.
 */

import { existsSync, statSync } from "fs";
import { join, dirname } from "path";
// Bun транслирует TS-импорт на лету — парсить текст products.ts не нужно:
import { PRODUCTS } from "../src/data/products.ts";

const ROOT = process.cwd();

let pass = 0;
let warn = 0;
let fail = 0;
const log = (level, msg) => {
  if (level === "FAIL") fail++;
  else if (level === "WARN") warn++;
  else pass++;
  const mark = level === "FAIL" ? "✗" : level === "WARN" ? "⚠" : "✓";
  console.log(`${mark} [${level}] ${msg}`);
};

/** Полный путь из URL вида /products-opt/x.webp → public/products-opt/x.webp */
const toDisk = (url) => join(ROOT, "public", url.replace(/^\//, ""));

/* --- 1. Структура данных и метаданные --- */
const seenIds = new Map();
const photoOwners = new Map(); // путь фото → список товаров

for (const p of PRODUCTS) {
  const label = `${p.name} (id: ${p.id})`;

  if (seenIds.has(p.id)) {
    log("FAIL", `дубликат id «${p.id}»: ${seenIds.get(p.id)} и ${label}`);
  } else seenIds.set(p.id, label);

  for (const [field, v] of [
    ["name", p.name],
    ["price", p.price],
    ["description", p.description],
    ["longDescription", p.longDescription],
  ] as const) {
    if (!v || String(v).trim().length < 5)
      log("FAIL", `${label}: пустое/короткое поле ${field}`);
  }
  if (!p.specs?.length) log("FAIL", `${label}: пустой specs`);
  if (!p.features?.length) log("WARN", `${label}: пустой features`);

  for (const slot of ["main", "hover"] as const) {
    const url = p.images?.[slot];
    const alt = p.alt?.[slot];
    if (!url) {
      log("FAIL", `${label}: слот images.${slot} не заполнен`);
      continue;
    }
    if (!alt || !alt.trim())
      log("FAIL", `${label}: слот alt.${slot} не заполнен (доступность)`);

    const file = toDisk(url);
    if (!existsSync(file)) {
      log("FAIL", `${label}: images.${slot} → 404, файла нет: ${url}`);
    } else if (statSync(file).size === 0) {
      log("FAIL", `${label}: images.${slot} → файл 0 байт: ${url}`);
    }

    /* Карта «фото → владельцы»: одно фото у двух товаров = чужое фото */
    if (!photoOwners.has(url)) photoOwners.set(url, []);
    photoOwners.get(url).push(label);

    if (slot === "hover" && url === p.images?.main) {
      if (p.photoPending) {
        log(
          "WARN",
          `${label}: одна фотка на main+hover (photoPending — ждём второе фото от владельца)`
        );
      } else {
        log(
          "FAIL",
          `${label}: images.hover === images.main («одну фотку используют»). ` +
            `Либо добавь второе фото, либо поставь photoPending: true в products.ts`
        );
      }
    }
  }
}

/* --- 2. Чужие фото: путь принадлежит ≥2 товарам ---
 *
 * Осознанный шеринг — в allowlist: комплект показывает фото входящего в
 * него костюма; двусторонний вариант — фото того же костюма. Всё остальное
 * — WARN: реальный прецедент уже был (фотка Фантома у чехла на рюкзак).
 */
const SHARING_ALLOWLIST: Record<string, string[]> = {
  "/products-opt/suit-big-1.webp": ["komplekt-polno"],
  "/products-opt/suit-medium-1.webp": ["kostyum-sredniy-byurger-dvustoronniy"],
};

for (const [url, owners] of photoOwners) {
  if (owners.length <= 1) continue;
  const ids = owners.map((o) => (o.match(/id: ([^)]+)/) ?? [])[1]);
  const allowed = SHARING_ALLOWLIST[url];
  const legit =
    !!allowed &&
    allowed.every((a) => ids.includes(a)) &&
    owners.length === new Set(ids).size;
  if (legit) {
    log(
      "PASS",
      `фото ${url} шарится осознанно: ${owners.join(" | ")} (allowlist)`
    );
  } else {
    log(
      "WARN",
      `фото ${url} используют ${owners.length} товаров: ${owners.join(" | ")} — ` +
        `проверь: это осознанный шеринг или чужое фото? (осознанный — внеси в SHARING_ALLOWLIST)`
    );
  }
}

/* --- 3. Ассеты, на которые ссылается Poncho.tsx и другие компоненты --- */
const comps = ["Poncho.tsx", "Suits.tsx", "Categories.tsx", "BurgerChooser.tsx"];
for (const c of comps) {
  const p = join(ROOT, "src/components/site", c);
  if (!existsSync(p)) continue;
  const src = await Bun.file(p).text();
  const re = /\/products(-opt)?\/[a-zA-Z0-9._-]+\.(webp|jpg|jpeg|png)/g;
  const found = new Set(src.match(re) ?? []);
  for (const u of found) {
    if (!existsSync(toDisk(u))) log("FAIL", `${c}: 404 → ${u}`);
  }
}

/* --- Итог --- */
console.log(
  `\nТоваров проверено: ${PRODUCTS.length} | ` +
    `✓ PASS: ${pass} | ⚠ WARN: ${warn} | ✗ FAIL: ${fail}`
);
if (warn > 0)
  console.log(
    "WARN не блокирует PR, но держит в поле зрения потери контента (photoPending)."
  );
if (fail > 0) {
  console.log("\n✗ ПР БЛОКИРУЕТСЯ: исправь FAIL выше и перезапусти bun run release");
  process.exit(1);
}
console.log("Фактчек контента: OK");
