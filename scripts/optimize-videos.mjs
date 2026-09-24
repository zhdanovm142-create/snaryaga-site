/**
 * Build-time сжатие видео через ffmpeg (если он установлен).
 *
 * Все ролики сайта — зацикленные беззвучные демо (muted loop), поэтому:
 *  — аудио-дорожка вырезается (-an): она всё равно не воспроизводится;
 *  — H.264 CRF 28: визуально неотличимо для «камерного» ИК-видео, −40–60% веса;
 *  — +faststart: moov-атом в начало файла — видео стартует до полной загрузки.
 *
 * Файлы перезаписываются на месте (имена не меняются → правки кода не нужны).
 * Защита от повторного перекодирования: кэш в scripts/.video-opt-cache.json —
 * файл перекодируется только если его размер изменился с прошлого прогона.
 * Плюс страховка: результат принимается только если он ≤ 90% исходника,
 * так что повторный CRF 28 по уже сжатому файлу не деградирует качество.
 *
 * Запуск: bun run optimize:videos (или node scripts/optimize-videos.mjs)
 * Если ffmpeg не найден — скрипт завершается с предупреждением, НЕ ломая сборку.
 */

import { execFileSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, statSync, renameSync, unlinkSync } from "fs";
import { join } from "path";

const TARGETS = [
  "public/hero.mp4",
  "public/tech-ir.mp4",
  "public/products/ir-camera.mp4",
  "public/products/ir-thermal.mp4",
];
const MIN_SIZE = 1024 * 1024; // файлы < 1 МБ уже маленькие — не трогаем

const CACHE_FILE = join(process.cwd(), "scripts", ".video-opt-cache.json");

function ffmpegCheck() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function loadCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

if (!ffmpegCheck()) {
  console.log("[optimize-videos] ffmpeg не найден — видео остаются как есть (не фатально).");
  process.exit(0);
}

const cache = loadCache();
const newCache = { ...cache };
let beforeTotal = 0;
let afterTotal = 0;

for (const rel of TARGETS) {
  const file = join(process.cwd(), rel);
  if (!existsSync(file)) continue;

  const size = statSync(file).size;
  newCache[rel] = size; // фиксируем текущий размер в любом случае

  if (size < MIN_SIZE) {
    console.log(`  ${rel}: ${(size / 1024).toFixed(0)} КБ — меньше порога, пропущен.`);
    continue;
  }
  if (cache[rel] === size) {
    console.log(`  ${rel}: уже сжат (${(size / 1024 / 1024).toFixed(1)} МБ), пропущен.`);
    continue;
  }

  const tmp = file + ".tmp.mp4";
  try {
    console.log(`  ${rel}: ${(size / 1024 / 1024).toFixed(2)} МБ → перекодирование…`);
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-i", file,
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "medium",
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        tmp,
      ],
      { stdio: "ignore" }
    );
    const newSize = statSync(tmp).size;
    // Принимаем результат, только если реально легче ≥10% — иначе это
    // повторное перекодирование уже сжатого файла: оставляем оригинал.
    if (newSize <= size * 0.9) {
      renameSync(tmp, file);
      console.log(`    → ${(newSize / 1024 / 1024).toFixed(2)} МБ (−${Math.round((1 - newSize / size) * 100)}%)`);
      beforeTotal += size;
      afterTotal += newSize;
      newCache[rel] = newSize;
    } else {
      unlinkSync(tmp);
      console.log(`    → выигрыш <10%, оставлен оригинал.`);
    }
  } catch (err) {
    if (existsSync(tmp)) unlinkSync(tmp);
    console.error(`    ✗ ${rel}: ${err.message} — файл оставлен без изменений.`);
  }
}

writeFileSync(CACHE_FILE, JSON.stringify(newCache, null, 2));

if (beforeTotal > 0) {
  console.log(
    `[optimize-videos] Итого: ${(beforeTotal / 1024 / 1024).toFixed(1)} МБ → ${(afterTotal / 1024 / 1024).toFixed(1)} МБ ` +
      `(−${Math.round((1 - afterTotal / beforeTotal) * 100)}%).`
  );
} else {
  console.log("[optimize-videos] Изменений нет.");
}
