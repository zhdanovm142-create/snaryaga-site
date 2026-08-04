/**
 * Статичный манифест видео-отзывов.
 *
 * В статическом экспорте (output: 'export') нет серверного API для сканирования
 * папки /public/videos/, поэтому список видео хранится здесь как обычный массив.
 *
 * Как добавить видео:
 * 1. Положите .mp4 файл в /public/videos/ (напр. /public/videos/otzyv-1.mp4)
 * 2. Добавьте запись в массив VIDEO_META ниже — у видео появится имя автора,
 *    роль и название товара.
 *
 * Пока массив пуст — блок видео-отзывов показывает аккуратные слоты-заглушки
 * «Видео скоро появится».
 */

export interface VideoMeta {
  /** Имя файла в /public/videos/ (напр. "otzyv-1.mp4"). */
  file: string;
  name: string;
  role: string;
  product?: string;
}

/**
 * Подписи к видео. Заполняйте по мере появления видео.
 */
export const VIDEO_META: VideoMeta[] = [
  // { file: "otzyv-1.mp4", name: "Алексей М.", role: "Контрактник", product: "Рюкзак «Фантом-50»" },
  // { file: "otzyv-2.mp4", name: "Гранит", role: "Командир взвода", product: "Рюкзак «Бастион-100»" },
];

/**
 * Список путей к видео-файлам (derived from VIDEO_META).
 * Формат: ["/videos/otzyv-1.mp4", ...]
 */
export const VIDEO_SOURCES: string[] = VIDEO_META.map(
  (m) => `/videos/${encodeURIComponent(m.file)}`
);
