"use client";

import { useCallback, useEffect, useState } from "react";
import { VIDEO_META, VIDEO_SOURCES, type VideoMeta } from "@/data/videos";

/**
 * ВИДЕО-ОТЗЫВЫ
 *
 * Блок расположен в самом низу страницы (перед футером). Сюда пользователь
 * подгружает видео-отзывы ребят.
 *
 * Как добавить видео:
 * 1. Положите .mp4 файл в /public/videos/ (напр. /public/videos/otzyv-1.mp4)
 * 2. Добавьте запись в массив VIDEO_META в src/data/videos.ts — у видео
 *    появится имя автора, роль и название товара.
 *
 * Список видео читается из статичного манифеста (src/data/videos.ts) —
 * это работает в статическом экспорте без серверного API.
 *
 * Пока видео нет — блок показывает аккуратные слоты-заглушки
 * «Видео скоро появится». Никаких рейтингов и звёзд — только видео.
 */

/** Минимальное число слотов в сетке — чтобы блок не выглядел пустым. */
const MIN_SLOTS = 6;

/** Сколько слотов в одной «странице» карусели на мобильных. */
const PAGE_SIZE = 3;

interface DiscoveredVideo {
  src: string;
  name: string;
  role: string;
  product?: string;
  index: number;
}

export default function ReviewsCarousel() {
  // Список видео читается синхронно из статичного манифеста — без fetch/API.
  const videos: string[] = VIDEO_SOURCES;
  const loaded = true;
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<DiscoveredVideo | null>(null);

  // Сопоставляем файлы с метаданными.
  const metaByFile = new Map(VIDEO_META.map((m) => [m.file, m]));
  const discovered: DiscoveredVideo[] = videos.map((src, i) => {
    const file = src.split("/").pop() ?? "";
    const decoded = decodeURIComponent(file);
    const meta = metaByFile.get(decoded);
    return {
      src,
      name: meta?.name ?? `Видео-отзыв ${i + 1}`,
      role: meta?.role ?? "Полевой отзыв",
      product: meta?.product,
      index: i,
    };
  });

  // Слоты = реальные видео + заглушки до MIN_SLOTS.
  const totalSlots = Math.max(MIN_SLOTS, discovered.length);
  const slots: (DiscoveredVideo | null)[] = Array.from({ length: totalSlots }, (_, i) =>
    i < discovered.length ? discovered[i] : null
  );

  const pageCount = Math.max(1, Math.ceil(slots.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const visibleSlots = slots.slice(pageStart, pageStart + PAGE_SIZE);

  const nextPage = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prevPage = useCallback(() => setPage((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  // Закрытие лайтбокса по Esc.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const realCount = discovered.length;

  return (
    <section id="reviews" className="sn-section">
      <header className="reveal mb-12">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Видео-отзывы
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Ребята
            <br />
            о снаряжении
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Живые видео-отзывы операторов, волонтёров и охотников — реальный
            опыт использования ИК-экипировки в поле. Видео появятся здесь
            совсем скоро.
          </p>
        </div>
      </header>

      {/* Статус-строка */}
      <div className="reveal mb-8 flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(92,107,60,0.12)] border border-[var(--olive-dark)] font-mono-brand text-[0.6rem] text-[var(--olive-light)] tracking-[1px] uppercase">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--olive)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
          </span>
          {loaded
            ? realCount > 0
              ? `Загружено видео: ${realCount}`
              : "Ожидаем видео от ребят"
            : "Загрузка…"}
        </span>
        <span className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)]">
          /public/videos/
        </span>
      </div>

      {/* Сетка слотов */}
      <div className="reveal relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
          {visibleSlots.map((slot, i) => (
            <VideoSlot
              key={pageStart + i}
              slot={slot}
              number={pageStart + i + 1}
              onPlay={slot ? () => setLightbox(slot) : undefined}
            />
          ))}
        </div>

        {/* Пагинация */}
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prevPage}
              aria-label="Предыдущая страница"
              className="w-10 h-10 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-[var(--text2)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Страница ${i + 1}`}
                  aria-pressed={i === currentPage}
                  className={`h-2 transition-all duration-300 cursor-pointer border-none ${
                    i === currentPage
                      ? "w-8 bg-[var(--olive-light)]"
                      : "w-2 bg-[var(--border-brand)] hover:bg-[var(--olive-dark)]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextPage}
              aria-label="Следующая страница"
              className="w-10 h-10 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-[var(--text2)] cursor-pointer transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* CTA: пришлите своё видео */}
      <div className="reveal mt-10 border border-[var(--olive-dark)] bg-[rgba(92,107,60,0.06)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-wrap">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[var(--olive)] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px] mb-1">
            Снимите видео-отзыв — попадёте на эту страницу
          </div>
          <p className="text-[0.82rem] text-[var(--text2)] leading-[1.6]">
            Короткое видео с полевым опытом использования снаряжения — и мы
            разместим его в этом блоке. Расскажите, что брали, как показало
            себя в деле.
          </p>
        </div>
        <a
          href="#contact"
          className="py-3 px-6 bg-[var(--olive)] text-white border border-[var(--olive)] text-[0.68rem] font-bold tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] flex items-center gap-2 no-underline"
        >
          Отправить видео
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Лайтбокс для просмотра видео */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.92)] backdrop-blur-[8px] z-[2100] flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Видео-отзыв: ${lightbox.name}`}
          style={{ animation: "sn-modal-in 0.3s ease" }}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Закрыть"
            className="absolute top-6 right-6 w-10 h-10 bg-[var(--bg2)] border border-[var(--border-brand)] flex items-center justify-center cursor-pointer text-[var(--text2)] text-[1.3rem] transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--text)]"
          >
            ×
          </button>
          <div
            className="max-w-[900px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={lightbox.src}
              controls
              autoPlay
              className="w-full max-h-[78vh] bg-black border border-[var(--olive-dark)]"
            />
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-lg bg-[var(--olive)]">
                {lightbox.name.charAt(0)}
              </div>
              <div>
                <div className="font-display text-[1rem] font-bold uppercase tracking-[0.5px]">
                  {lightbox.name}
                </div>
                <div className="text-[0.7rem] text-[var(--text3)] uppercase tracking-[1px]">
                  {lightbox.role}
                </div>
              </div>
              {lightbox.product && (
                <span className="ml-auto font-mono-brand text-[0.68rem] text-[var(--olive-light)] px-2.5 py-1 bg-[rgba(92,107,60,0.12)] border border-[var(--olive-dark)]">
                  {lightbox.product}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Один слот: реальное видео (кликабельное, открывает лайтбокс) или заглушка.
 */
function VideoSlot({
  slot,
  number,
  onPlay,
}: {
  slot: DiscoveredVideo | null;
  number: number;
  onPlay?: () => void;
}) {
  if (!slot) {
    // Заглушка — видео скоро появится.
    return (
      <div
        className="relative aspect-video bg-[var(--bg3)] flex flex-col items-center justify-center text-center p-4 group"
        aria-label={`Слот ${number}: видео скоро появится`}
      >
        {/* Декоративный пунктирный контур */}
        <div
          className="absolute inset-3 border border-dashed border-[var(--border-brand)] pointer-events-none transition-colors duration-300 group-hover:border-[var(--olive-dark)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(92,107,60,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,0.6) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
        <div className="w-14 h-14 flex items-center justify-center border border-[var(--border-brand)] text-[var(--text3)] mb-3 relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <div className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)] mb-1 relative">
          Слот {String(number).padStart(2, "0")}
        </div>
        <div className="font-display text-[0.85rem] font-bold uppercase tracking-[0.5px] text-[var(--text2)] relative">
          Видео скоро появится
        </div>
      </div>
    );
  }

  // Реальное видео — миниатюра с кнопкой play, открывает лайтбокс.
  return (
    <button
      type="button"
      onClick={onPlay}
      className="relative aspect-video bg-black overflow-hidden group cursor-pointer text-left block w-full"
      aria-label={`Смотреть видео-отзыв: ${slot.name}`}
    >
      <video
        src={slot.src}
        preload="metadata"
        muted
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Затемнение для читаемости */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.1)] to-[rgba(0,0,0,0.25)]" />
      {/* Большая кнопка play по центру */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-[rgba(13,13,13,0.65)] backdrop-blur-sm border border-[var(--olive)] rounded-full transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:scale-110">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--olive-light)" className="group-hover:fill-white transition-colors" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      {/* Номер слота */}
      <div className="absolute top-3 left-3 z-[2] w-8 h-8 flex items-center justify-center bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive-dark)] font-mono-brand text-[0.7rem] text-[var(--olive-light)]">
        {String(number).padStart(2, "0")}
      </div>
      {/* Подпись автора */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-[2]">
        <div className="font-mono-brand text-[0.58rem] text-[var(--olive-light)] tracking-[1.5px] uppercase mb-0.5">
          {slot.role}
        </div>
        <div className="font-display text-[0.95rem] font-bold uppercase text-white leading-tight">
          {slot.name}
        </div>
        {slot.product && (
          <div className="mt-1.5 inline-block font-mono-brand text-[0.58rem] text-[var(--text2)] px-1.5 py-0.5 bg-[rgba(13,13,13,0.6)] border border-[var(--border-brand)]">
            {slot.product}
          </div>
        )}
      </div>
      {/* «Смотреть» при hover */}
      <div className="absolute top-3 right-3 z-[2] px-2 py-1 bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive)] text-[var(--olive-light)] text-[0.55rem] font-bold tracking-[1px] uppercase font-mono-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        ▶ Смотреть
      </div>
    </button>
  );
}
