import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

/**
 * GET /api/videos
 *
 * Возвращает список видеофайлов из /public/videos/.
 * Пользователь просто кладёт .mp4/.webm/.mov файлы в папку
 * /public/videos/ — они автоматически появятся в блоке видео-отзывов
 * без правки кода.
 *
 * Ответ: { videos: string[] } — массив путей вида "/videos/review-1.mp4".
 */
export async function GET() {
  const dir = join(process.cwd(), "public", "videos");
  try {
    const entries = await readdir(dir);
    const videos = entries
      .filter((f) => /\.(mp4|webm|mov|m4v|ogg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "ru", { numeric: true }))
      .map((f) => `/videos/${encodeURIComponent(f)}`);
    return NextResponse.json({ videos });
  } catch {
    // Папки пока нет — возвращаем пустой список (показываем заглушки).
    return NextResponse.json({ videos: [] });
  }
}
