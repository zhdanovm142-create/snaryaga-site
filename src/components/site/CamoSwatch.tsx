/**
 * Процедурные камуфляжные свотчи — паттерн рисуется CSS-градиентами,
 * 0 байт сетевой загрузки (вместо миниатюр-картинок).
 *
 * Зачем: превью расцветок («Мох», «Койот», «Пиксель»…) раньше рисовались
 * теми же фотографиями, что и галерея (300–450 КБ каждая). Свотчу же нужна
 * только фактура цвета — её честно воспроизводят слои radial/conic-градиентов.
 * Весят ровно ноль байт и не грузятся, а рисуются движком браузера.
 *
 * Палитра согласована с брендовыми цветами сайта (olive #5c6b3c, coyote
 * #8b7355) и с SWATCH_ICON_BG из прежней реализации Poncho.
 *
 * Использование:
 *   <CamoSwatch type="moh" className="w-3.5 h-3.5 rounded-[2px]" />
 */

export type CamoType =
  | "moh" // «Мох» — лес, трава, листва
  | "pixel" // «Пиксель» — цифровой паттерн
  | "multicam" // «Мультикам» — смешанный рельеф
  | "green" // «Зелёный» — сплошная растительность
  | "blue" // «Синий» — город/ночь
  | "olive" // Олива (базовая расцветка костюмов)
  | "coyote"; // Койот (пустынная расцветка)

export const CAMO_PATTERNS: Record<CamoType, string> = {
  // Пятнистый «мох»: тёмно-оливковая база + кляксы трёх оттенков зелёного.
  moh: [
    "radial-gradient(ellipse 9px 6px at 22% 28%, #4a5d23 0 60%, transparent 61%)",
    "radial-gradient(ellipse 11px 7px at 68% 22%, #1a251a 0 55%, transparent 56%)",
    "radial-gradient(ellipse 8px 6px at 78% 68%, #4a5d23 0 55%, transparent 56%)",
    "radial-gradient(ellipse 10px 6px at 30% 75%, #1a251a 0 55%, transparent 56%)",
    "radial-gradient(ellipse 7px 5px at 52% 50%, #4a5d23 0 55%, transparent 56%)",
    "#2d3a2d",
  ].join(", "),

  // Цифровой пиксель: два слоя checkerboard разного масштаба.
  pixel: [
    "repeating-conic-gradient(#3d4728 0% 25%, #5c6b3c 0% 50%) 0/5px 5px",
    "repeating-conic-gradient(rgba(26,37,26,0.55) 0% 25%, transparent 0% 50%) 1px 1px/10px 10px",
    "#5c6b3c",
  ].join(", "),

  // Мультикам: широкие размытые пятна койот/бурый/олива на песчаной базе.
  multicam: [
    "radial-gradient(ellipse 12px 8px at 24% 30%, #6b5335 0 60%, transparent 61%)",
    "radial-gradient(ellipse 14px 9px at 74% 18%, #5c6b3c 0 58%, transparent 59%)",
    "radial-gradient(ellipse 11px 7px at 60% 72%, #4a3a28 0 55%, transparent 56%)",
    "radial-gradient(ellipse 13px 8px at 18% 74%, #8b7355 0 58%, transparent 59%)",
    "#8b7355",
  ].join(", "),

  // «Зелёный»: глубокая сплошная растительность с лёгкой тональной игрой.
  green: [
    "radial-gradient(ellipse 14px 10px at 30% 32%, rgba(61,71,40,0.9) 0 45%, transparent 46%)",
    "radial-gradient(ellipse 12px 9px at 72% 68%, rgba(38,48,22,0.9) 0 48%, transparent 49%)",
    "#3d4728",
  ].join(", "),

  // «Синий»: город/ночь — тёмный навий с двумя теневыми пятнами.
  blue: [
    "radial-gradient(ellipse 13px 9px at 28% 34%, rgba(34,48,74,0.95) 0 45%, transparent 46%)",
    "radial-gradient(ellipse 11px 8px at 70% 70%, rgba(20,28,44,0.95) 0 48%, transparent 49%)",
    "#22304a",
  ].join(", "),

  // Олива: базовая брендовая расцветка ткани.
  olive: [
    "radial-gradient(ellipse 12px 8px at 30% 30%, rgba(92,107,60,0.85) 0 48%, transparent 49%)",
    "radial-gradient(ellipse 10px 7px at 70% 72%, rgba(60,72,38,0.85) 0 50%, transparent 51%)",
    "#5c6b3c",
  ].join(", "),

  // Койот: пустынный песочно-бурый.
  coyote: [
    "radial-gradient(ellipse 12px 8px at 30% 30%, rgba(139,115,85,0.85) 0 48%, transparent 49%)",
    "radial-gradient(ellipse 10px 7px at 70% 72%, rgba(107,83,53,0.85) 0 50%, transparent 51%)",
    "#8b7355",
  ].join(", "),
};

export default function CamoSwatch({
  type,
  className = "w-3.5 h-3.5 rounded-[2px] inline-block",
}: {
  type: CamoType;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ background: CAMO_PATTERNS[type] }}
    />
  );
}
