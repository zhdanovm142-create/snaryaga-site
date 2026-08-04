"use client";

import { useMemo } from "react";
import { PRODUCTS, type Product } from "@/data/products";

interface Props {
  onQuickView: (p: Product) => void;
  onOrder: (name: string) => void;
}

/**
 * Матрица подбора костюма «Бугор».
 *
 * Отображает все костюмы линейки (IR Suit + Reversible Suit) в виде
 * горизонтальной таблицы-карточек, по которой удобно сравнить ключевые
 * параметры подбора: покрытие, слои экрана, реверс, вес, срок, применение.
 *
 * Рекомендованные модели (recommended:true) подсвечиваются оливковой
 * рамкой и бейджем «Рекомендуем». Клик по карточке открывает детали,
 * кнопка «Заказать» — открывает форму заявки.
 *
 * Данные тянутся из PRODUCTS (coverage/layers/reversible/useCase) —
 * новая секция автоматически подхватит будущие модели.
 */
export default function BurgerChooser({ onQuickView, onOrder }: Props) {
  const suits = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => p.category === "IR Suit" || p.category === "Reversible Suit"
      ),
    []
  );

  // Извлекаем вес из specs (напр. "1,6 кг") для отображения в матрице.
  const weightOf = (p: Product): string =>
    p.specs?.find((s) => s.label === "Вес")?.value ?? "—";

  return (
    <section id="burger-chooser" className="sn-section !pt-0">
      <header className="reveal mb-12">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Подбор модели
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Какой
            <br />
            «Бугор» ваш?
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Сравните все модели линейки по покрытию, числу слоёв экрана,
            реверсу и сроку. Рекомендованные отмечены отдельно — это
            сбалансированный выбор под типовые задачи.
          </p>
        </div>
      </header>

      {/* Legend */}
      <div className="reveal flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-[0.7rem] uppercase tracking-[1px] text-[var(--text3)]">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-[var(--olive)] bg-[rgba(92,107,60,0.18)]" />
          Рекомендуем
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[var(--olive)]" />1 слой экрана
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[var(--olive)] relative">
            <span className="absolute inset-0 bg-[var(--olive-dark)] opacity-60" />
          </span>
          2 слоя экрана
        </span>
        <span className="flex items-center gap-2">
          <span className="font-mono-brand text-[var(--coyote-light)]">↔</span>
          Реверс (олива/койот)
        </span>
      </div>

      {/* Matrix — горизонтальный скролл на мобиле */}
      <div className="reveal overflow-x-auto -mx-4 px-4 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 min-w-[760px]">
          {suits.map((s) => {
            const rec = s.recommended === true;
            return (
              <div
                key={s.id}
                role="button"
                tabIndex={0}
                onClick={() => onQuickView(s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onQuickView(s);
                  }
                }}
                className={`group relative text-left bg-[var(--bg2)] border p-4 flex flex-col gap-3 transition-all duration-300 hover:bg-[var(--bg3)] cursor-pointer focus:outline-none focus-visible:border-[var(--olive)] ${
                  rec
                    ? "border-[var(--olive)] bg-[rgba(92,107,60,0.10)]"
                    : "border-[var(--border-brand)] hover:border-[var(--olive-dark)]"
                }`}
                aria-label={`Подробнее о ${s.name}`}
              >
                {/* Recommended badge */}
                {rec && (
                  <span className="absolute -top-2 left-3 px-2 py-[0.15rem] bg-[var(--olive)] text-white text-[0.52rem] font-bold tracking-[1px] uppercase font-mono-brand z-[2]">
                    Рекомендуем
                  </span>
                )}

                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[var(--bg3)]">
                  <img
                    src={s.images.main}
                    alt={s.alt.main}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-transparent to-transparent" />
                  {s.reversible && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[var(--coyote)] text-white text-[0.5rem] font-bold tracking-[0.5px] uppercase font-mono-brand">
                      ↔ реверс
                    </span>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="font-mono-brand text-[0.52rem] text-[var(--olive-light)] tracking-[1px] uppercase mb-0.5">
                      {s.category === "Reversible Suit" ? "Двусторонний" : "ИК-костюм"}
                    </div>
                    <div className="font-display text-[0.78rem] font-bold uppercase leading-tight text-white">
                      {s.name.replace("Костюм ", "")}
                    </div>
                  </div>
                </div>

                {/* Layers indicator (visual bars) */}
                <div className="flex items-center gap-1.5">
                  {[1, 2].map((n) => (
                    <span
                      key={n}
                      className={`h-1.5 flex-1 ${
                        (s.layers ?? 1) >= n
                          ? "bg-[var(--olive)]"
                          : "bg-[var(--border-brand)]"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="font-mono-brand text-[0.55rem] text-[var(--text3)] tracking-[1px] uppercase ml-1">
                    {(s.layers ?? 1)} слой
                  </span>
                </div>

                {/* Coverage */}
                <div>
                  <div className="font-mono-brand text-[0.52rem] text-[var(--text3)] tracking-[1px] uppercase mb-1">
                    Покрытие
                  </div>
                  <div className="text-[0.72rem] text-[var(--text2)] leading-tight">
                    {s.coverage ?? "—"}
                  </div>
                </div>

                {/* Weight + lead time */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-brand)]">
                  <div>
                    <div className="font-mono-brand text-[0.5rem] text-[var(--text3)] tracking-[1px] uppercase">
                      Вес
                    </div>
                    <div className="text-[0.78rem] font-bold font-mono-brand">
                      {weightOf(s)}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-brand text-[0.5rem] text-[var(--text3)] tracking-[1px] uppercase">
                      Срок
                    </div>
                    <div className="text-[0.78rem] font-bold text-[var(--olive-light)]">
                      {s.leadTime ?? "—"}
                    </div>
                  </div>
                </div>

                {/* Use case */}
                <div className="text-[0.7rem] text-[var(--text2)] leading-tight italic border-l-2 border-[var(--olive-dark)] pl-2">
                  {s.useCase ?? ""}
                </div>

                {/* Order button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrder(s.name);
                  }}
                  className="mt-auto w-full py-2 bg-transparent border border-[var(--olive)] text-[var(--olive-light)] text-[0.6rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive)] hover:text-white"
                >
                  Заказать
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="reveal mt-4 text-[0.78rem] text-[var(--text3)]">
        * Не знаете, что выбрать? «Средний Бугор» — сбалансированный универсал
        для большинства задач. Для работы в разных рельефах — двусторонние
        модели. Нажмите на карточку для полного описания и выбора размера.
      </p>
    </section>
  );
}
