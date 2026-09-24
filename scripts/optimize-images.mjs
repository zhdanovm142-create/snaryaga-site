/**
 * Build-time оптимизация изображений для статического экспорта.
 *
 * next/image с output:'export' не сжимает картинки в рантайме (нет Node-сервера),
 * поэтому конвертируем их ДО сборки: public/products/*.{jpg,jpeg,png} →
 * public/products-opt/*.webp (quality 82, max ширина 1280px).
 *
 * Экономика: JPG-фото 300–550 КБ → WebP ~60–120 КБ (−60–80%).
 *
 * Правила безопасности:
 *  — видео (*.mp4) и видео-постеры (*-poster.*) не трогаем;
 *  — /products/ir-after.png не конвертируем: это og:image для соцсетей
 *    (VK/Telegram ненадёжно понимают WebP в Open Graph);
 *  — исходники удаляются из public/ после успешной конверсии, чтобы статик-билд
 *    не тащил неиспользуемые JPG (оригиналы остаются в git-истории).
 *
 * Запуск: bun run optimize:images (или node scripts/optimize-images.mjs)
 * Идемпотентен: повторный запуск ничего не ломает и не конвертирует дважды.
 */

import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync, statSync, unlinkSync } from "fs";
import { join, extname, basename } from "path";

const inputDir = join(process.cwd(), "public", "products");
const outputDir = join(process.cwd(), "public", "products-opt");

// Всё, что нельзя ни конвертировать, ни удалять.
const SKIP = new Set([
  "ir-after.png", // og:image — соцсети требуют растровый JPG/PNG
]);

// Постеры видео должны отдаваться мгновенно и до старта <video>;
// их размер и так мал — оставляем как есть.
const isPoster = (name) => /-poster\./i.test(name);

const QUALITY = 82;
const MAX_WIDTH = 1280;

if (!existsSync(inputDir)) {
  console.log("[optimize-images] public/products не найден — пропуск.");
  process.exit(0);
}
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir).filter((f) =>
  /\.(jpe?g|png)$/i.test(f)
);

if (files.length === 0) {
  console.log("[optimize-images] Нет JPEG/PNG для конверсии (уже оптимизированы).");
  process.exit(0);
}

let before = 0;
let after = 0;
let converted = 0;
let removed = 0;

for (const file of files) {
  const src = join(inputDir, file);
  if (SKIP.has(file) || isPoster(file)) continue;

  const outName = basename(file, extname(file)) + ".webp";
  const dst = join(outputDir, outName);

  // Идемпотентность: если webp уже существует и новее исходника — пропускаем.
  if (
    existsSync(dst) &&
    statSync(dst).mtimeMs >= statSync(src).mtimeMs
  ) {
    continue;
  }

  const srcSize = statSync(src).size;
  try {
    const info = await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(dst);
    const dstSize = statSync(dst).size;
    // WebP тяжелее исходника? Значит исходник уже был сжат хорошо —
    // оставляем оригинал и убираем бесполезный webp.
    if (dstSize >= srcSize) {
      unlinkSync(dst);
      console.log(`  ${file}: webp не легче jpg (${(srcSize / 1024).toFixed(0)} КБ) — оставлен оригинал.`);
      continue;
    }
    before += srcSize;
    after += dstSize;
    converted++;
    const save = Math.round((1 - dstSize / srcSize) * 100);
    console.log(
      `  ${file} → products-opt/${outName}: ${(srcSize / 1024).toFixed(0)} КБ → ${(dstSize / 1024).toFixed(0)} КБ (−${save}%)`
    );

    // Исходник больше не нужен в public/ (остался в git-истории) —
    // иначе статик-экспорт скопирует его в out/ без пользы.
    unlinkSync(src);
    removed++;
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message} — исходник сохранён.`);
  }
}

const totalSave =
  before > 0 ? Math.round((1 - after / before) * 100) : 0;
console.log(
  `[optimize-images] Конвертировано: ${converted}, удалено исходников: ${removed}. ` +
    `${(before / 1024 / 1024).toFixed(1)} МБ → ${(after / 1024 / 1024).toFixed(1)} МБ (−${totalSave}%).`
);
