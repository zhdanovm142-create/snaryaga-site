"use client";

import { useEffect, useState } from "react";
import CamoSwatch, { type CamoType } from "@/components/site/CamoSwatch";

type Cam = Extract<
  CamoType,
  "moh" | "pixel" | "multicam" | "green" | "blue"
>;

const SWATCHES: { id: Cam; label: string; season: string; desc: string; img: string }[] = [
  { id: "moh", label: "Мох", season: "лето/осень", desc: "Лес, трава, листва", img: "/products-opt/cover-1.webp" },
  { id: "pixel", label: "Пиксель", season: "универсал", desc: "Цифровой паттерн, город", img: "/products-opt/cover-2.webp" },
  { id: "multicam", label: "Мультикам", season: "универсал", desc: "Смешанный рельеф", img: "/products-opt/cover-3.webp" },
  { id: "green", label: "Зелёный", season: "лето", desc: "Сплошная растительность", img: "/products-opt/cover-4.webp" },
  { id: "blue", label: "Синий", season: "город/ночь", desc: "Тёмные операции", img: "/products-opt/cover-5.webp" },
];

const MATERIALS = ["Оксфорд", "Спанбонд", "Спектра"];

/** Галерея реальных фото накидок (все 8 кадров из архива). */
const GALLERY = [
  { img: "/products-opt/cover-1.webp", label: "Мох — фронт" },
  { img: "/products-opt/cover-2.webp", label: "Пиксель — фронт" },
  { img: "/products-opt/cover-3.webp", label: "Мультикам — фронт" },
  { img: "/products-opt/cover-4.webp", label: "Зелёный — фронт" },
  { img: "/products-opt/cover-5.webp", label: "Синий — фронт" },
  { img: "/products-opt/cover-6.webp", label: "Оборот — деталь" },
  { img: "/products-opt/cover-7.webp", label: "Капюшон — крупно" },
  { img: "/products-opt/cover-8.webp", label: "Сложенный вид" },
];

export default function Poncho() {
  const [cam, setCam] = useState<Cam>("moh");
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Лайтбокс закрывается по Escape — как модалки деталей/заказа.
  // Раньше закрыть его можно было только кликом по крестику/фону,
  // из-за чего открытый лайтбокс «невидимо» блокировал страницу для
  // клавиатурного пользователя.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const current = SWATCHES.find((s) => s.id === cam)!;

  return (
    <section id="poncho" className="sn-section">
      <header className="reveal mb-16">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Накидки
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Маскировочные
            <br />
            накидки
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Двусторонние накидки для визуальной маскировки и коррекции теплового
            фона. Пять расцветок под задачу и сезон — реальные фото тканей.
          </p>
        </div>
      </header>

      <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Preview stage — реальные фото */}
        <div className="relative aspect-[3/4] border border-[var(--border-brand)] overflow-hidden bg-[var(--bg3)] group">
          <span className="absolute top-4 left-4 z-[3] px-3 py-[0.4rem] bg-[rgba(13,13,13,0.8)] border border-[var(--olive)] font-mono-brand text-[0.65rem] text-[var(--olive-light)] tracking-[1px] uppercase">
            ⇄ Двусторонняя
          </span>
          {/* Season badge (top-right) — updates with selection */}
          <span className="absolute top-4 right-4 z-[3] px-3 py-[0.4rem] bg-[rgba(13,13,13,0.8)] border border-[var(--olive-dark)] font-mono-brand text-[0.6rem] text-[var(--olive-light)] tracking-[1px] uppercase flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--olive)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
            </span>
            {current.season}
          </span>

          {/* Реальные фото — рендерится только АКТИВНАЯ расцветка (одна
              картинка вместо пяти, стопкой грузившихся при появлении секции).
              Смена расцветки: remount кадра с fade-in — прежний кросс-фейд
              пяти слоёв не стоит 4 лишних загрузки. */}
          <img
            key={current.id}
            src={current.img}
            alt={`Накидка «${current.label}» — ${current.desc}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain animate-in fade-in duration-500"
          />

          {/* Сетка-оверлей для тактильного вида */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "100% 3px",
              mixBlendMode: "multiply",
            }}
            aria-hidden="true"
          />
          {/* Description overlay (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-[3] bg-gradient-to-t from-[rgba(0,0,0,0.88)] to-transparent">
            <div className="font-mono-brand text-[0.58rem] text-[var(--olive-light)] tracking-[1.5px] uppercase mb-0.5">
              Текущая расцветка
            </div>
            <div className="font-display text-[1.2rem] font-bold uppercase text-white leading-tight">
              {current.label}
            </div>
            <div className="text-[0.78rem] text-[var(--text2)]">
              {current.desc}
            </div>
          </div>
          {/* Zoom hint on hover */}
          <button
            type="button"
            onClick={() => setLightbox(current.img)}
            aria-label="Увеличить фото накидки"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] w-12 h-12 flex items-center justify-center bg-[rgba(13,13,13,0.7)] backdrop-blur-sm border border-[var(--olive)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--olive-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
            </svg>
          </button>
        </div>

        {/* Description + swatches */}
        <div>
          <h3 className="font-display text-[1.8rem] font-bold uppercase leading-[1.05]">
            Камуфляж +
            <br />
            коррекция фона
          </h3>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8] mt-4 mb-4">
            Накидки из материалов{" "}
            <b className="text-[var(--text)]">Оксфорд, Спанбонд, Спектра</b>{" "}
            скрывают силуэт и цвет в видимом диапазоне, а за счёт собственного
            нагрева размывают тепловой контур в ИК. Используются самостоятельно
            или поверх экранирующего слоя —{" "}
            <b className="text-[var(--text)]">
              не нарушают работу термоэкранирования
            </b>
            .
          </p>

          {/* Material tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {MATERIALS.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg3)] border border-[var(--border-brand)] font-mono-brand text-[0.6rem] text-[var(--text2)] tracking-[1px] uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--olive)]" aria-hidden="true" />
                {m}
              </span>
            ))}
          </div>

          <div className="flex gap-2.5 my-6 flex-wrap">
            {SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCam(s.id)}
                aria-pressed={cam === s.id}
                className={`cursor-pointer border-2 px-3 py-[0.4rem] flex items-center gap-2 bg-[var(--bg2)] text-[0.7rem] tracking-[1px] uppercase transition-all duration-300 ${
                  cam === s.id
                    ? "border-[var(--olive)] text-[var(--text)]"
                    : "border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive-dark)]"
                }`}
              >
                <CamoSwatch type={s.id} className="w-3.5 h-3.5 rounded-[2px] inline-block" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Галерея реальных фото накидок (все 8 кадров) */}
      <div className="reveal mt-12">
        <div className="font-mono-brand text-[0.6rem] text-[var(--olive)] tracking-[2px] uppercase mb-4 flex items-center gap-3">
          <span className="w-[24px] h-px bg-[var(--olive)]" />
          Фотогалерея накидок
          <span className="text-[var(--text3)] text-[0.55rem] normal-case tracking-[1px]">
            кликните для увеличения
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
          {GALLERY.map((g, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(g.img)}
              aria-label={`Фото накидки: ${g.label}`}
              className="relative aspect-[3/4] overflow-hidden bg-[var(--bg3)] group cursor-pointer"
            >
              <img
                src={g.img}
                alt={g.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <span className="font-mono-brand text-[0.5rem] text-[var(--olive-light)] tracking-[1px] uppercase leading-tight">
                  {g.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.92)] backdrop-blur-[8px] z-[2100] flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Увеличенное фото накидки"
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
          <img
            src={lightbox}
            alt="Накидка, увеличенное фото"
            className="max-w-[90vw] max-h-[85vh] object-contain border border-[var(--olive-dark)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
