"use client";

import { useEffect, useState } from "react";

interface SectionDef {
  id: string;
  label: string;
}

/**
 * Список секций для индекса. Порядок = порядок на странице.
 * Короткие подписи, чтобы помещались в вертикальном сайдбаре.
 */
const SECTIONS: SectionDef[] = [
  { id: "categories", label: "Направления" },
  { id: "products", label: "Продукция" },
  { id: "poncho", label: "Накидки" },
  { id: "suits", label: "Костюмы" },
  { id: "burger-chooser", label: "Подбор" },
  { id: "tech", label: "Технологии" },
  { id: "compare", label: "Сравнение" },
  { id: "ir-compare", label: "Камера/Тепловизор" },
  { id: "guarantees", label: "Гарантии" },
  { id: "faq", label: "Вопросы" },
  { id: "about", label: "О компании" },
  { id: "reviews", label: "Видео-отзывы" },
  { id: "contact", label: "Контакты" },
];

/**
 * Sticky вертикальный индекс секций справа (десктоп только).
 * Показывает текущую секцию, кликабельные точки с тултипом-подписью.
 * Скрывается, если viewport < 1280px.
 */
export default function SectionIndex() {
  const [active, setActive] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Не показываем на маленьких экранах
    const checkViewport = () => setVisible(window.innerWidth >= 1280);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onScroll = () => {
      const offset = window.innerHeight * 0.35; // 35% от высоты — точка активации
      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          current = s.id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  if (!visible) return null;

  return (
    <nav
      aria-label="Быстрая навигация по разделам"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[900] hidden xl:flex flex-col gap-3"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center justify-end gap-2 no-underline"
          >
            <span
              className={`font-mono-brand text-[0.6rem] uppercase tracking-[1.5px] transition-all duration-300 ${
                isActive
                  ? "text-[var(--olive-light)] opacity-100 translate-x-0"
                  : "text-[var(--text3)] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`relative flex items-center justify-center transition-all duration-300 ${
                isActive ? "w-3 h-3" : "w-2 h-2"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[var(--olive-light)] scale-100"
                    : "bg-[var(--text3)] group-hover:bg-[var(--olive)] scale-100"
                }`}
              />
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full bg-[var(--olive-light)] animate-ping opacity-40"
                  aria-hidden="true"
                />
              )}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
