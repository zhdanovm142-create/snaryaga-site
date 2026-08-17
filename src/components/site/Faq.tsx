"use client";

import { useMemo, useState } from "react";

type Topic = "tech" | "care" | "order" | "shipping";

interface QA {
  q: string;
  a: string;
  topic: Topic;
}

const FAQS: QA[] = [
  {
    q: "Как долго работает ИК-экранирование?",
    a: "Экранирующая ткань отражает или поглощает ИК-излучение постоянно — эффект не теряется со временем. Это принципиальное отличие от термоизоляции, которая даёт лишь временную отсрочку (десятки минут).",
    topic: "tech",
  },
  {
    q: "В каких диапазонах работает защита?",
    a: "Наши ткани блокируют тепловое излучение в диапазонах 3–5 мкм и 8–14 мкм — основных рабочих окнах тепловизионных приборов различных поколений. Полный заявленный диапазон — 3–14 мкм.",
    topic: "tech",
  },
  {
    q: "Чем экранирование отличается от изоляции?",
    a: "Экранирование блокирует ИК-излучение постоянно — объект становится термически нейтральным. Изоляция лишь замедляет теплопередачу: поверхность постепенно нагревается, и контраст с фоном восстанавливается. Подробное сравнение — в соответствующей секции.",
    topic: "tech",
  },
  {
    q: "Можно ли стирать экранирующую экипировку?",
    a: "Да. Материал выдерживает 30+ циклов стирки без потери защитных свойств. Рекомендуем деликатный режим при температуре 30 °C, без отбеливателей и машинной сушки.",
    topic: "care",
  },
  {
    q: "Сколько занимает изготовление заказа?",
    a: "Стандартные позиции (чехлы на рюкзаки 20/50/100 л) — от 3 до 5 дней. Костюмы «Бугор» — 4–12 дней в зависимости от модели. Кастомные решения и индивидуальный пошив — от 2 недель. Сроки согласуем с менеджером при оформлении заявки.",
    topic: "order",
  },
  {
    q: "Можно ли заказать индивидуальный пошив?",
    a: "Да. Мы производим костюмы, чехлы для техники и нестандартные укрытия по чертежам или техническому заданию заказчика. Свяжитесь с нами через форму или по телефону — обсудим детали.",
    topic: "order",
  },
  {
    q: "Доставляете в другие регионы?",
    a: "Да, отправляем по всей России СДЭК и Почтой России. Самовывоз — из пункта выдачи в Воронеже, Купянский пер., 11. Стоимость доставки рассчитывается отдельно.",
    topic: "shipping",
  },
];

const TOPIC_LABELS: { id: Topic | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "tech", label: "Технологии" },
  { id: "care", label: "Уход" },
  { id: "order", label: "Заказ" },
  { id: "shipping", label: "Доставка" },
];

function FaqItem({
  item,
  open,
  onToggle,
  index,
}: {
  item: QA;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={`border bg-[var(--bg2)] transition-all duration-300 overflow-hidden ${
        open
          ? "border-[var(--olive)] bg-[rgba(92,107,60,0.10)] shadow-[0_0_0_1px_var(--olive-dark)_inset]"
          : "border-[var(--border-brand)] hover:border-[var(--olive-dark)]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="flex items-center gap-4 min-w-0">
          <span
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-mono-brand text-[0.75rem] font-bold tracking-[1px] border transition-all duration-300 ${
              open
                ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                : "bg-transparent border-[var(--border-brand)] text-[var(--text3)]"
            }`}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px] text-[var(--text)]">
            {item.q}
          </span>
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border text-[var(--olive-light)] transition-all duration-300 ${
            open
              ? "rotate-45 border-[var(--olive)] bg-[var(--olive)] text-white"
              : "border-[var(--border-brand)]"
          }`}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="px-5 pb-5 pl-[4.25rem] text-[0.88rem] text-[var(--text2)] leading-[1.7] border-l-2 border-[var(--olive-dark)] ml-5">
          {item.a}
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | "all">("all");

  // Фильтрация по теме + поисковому запросу (по вопросу и ответу).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      if (topic !== "all" && item.topic !== topic) return false;
      if (!q) return true;
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
      );
    });
  }, [query, topic]);

  // При смене фильтра сбрасываем раскрытый вопрос на первый из результатов.
  const effectiveOpen = openIndex !== null && openIndex < filtered.length ? openIndex : 0;

  return (
    <section id="faq" className="sn-section">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Вопросы и ответы
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Частые
            <br />
            вопросы
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Не нашли ответ? Воспользуйтесь поиском или фильтром по теме. Не
            нашли нужное — напишите через форму контактов, ответим в течение
            рабочего дня.
          </p>
        </div>
      </header>

      {/* Search + topic filters */}
      <div className="reveal max-w-[920px] mx-auto mb-6 space-y-4">
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)] pointer-events-none"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenIndex(0);
            }}
            placeholder="Поиск по вопросам и ответам…"
            aria-label="Поиск по FAQ"
            className="w-full pl-10 pr-10 py-3 bg-[var(--bg2)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] transition-colors placeholder:text-[var(--text3)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Очистить поиск"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[var(--text3)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono-brand text-[0.6rem] uppercase tracking-[2px] text-[var(--text3)] mr-1">
            Тема:
          </span>
          {TOPIC_LABELS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTopic(t.id);
                setOpenIndex(0);
              }}
              aria-pressed={topic === t.id}
              className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer transition-all duration-300 border ${
                topic === t.id
                  ? "bg-[var(--olive)] border-[var(--olive)] text-white"
                  : "bg-transparent border-[var(--border-brand)] text-[var(--text2)] hover:border-[var(--olive-dark)] hover:text-[var(--text)]"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span className="ml-auto font-mono-brand text-[0.6rem] uppercase tracking-[1px] text-[var(--text3)]">
            Найдено: <span className="text-[var(--text2)] font-bold">{filtered.length}</span>
          </span>
        </div>
      </div>

      {/* Items or empty state */}
      <div className="reveal max-w-[920px] mx-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-10 text-center">
            <div className="text-3xl mb-3 opacity-40">🔍</div>
            <div className="font-display text-[1.1rem] uppercase mb-2">
              Ничего не найдено
            </div>
            <p className="text-[0.85rem] text-[var(--text3)] mb-4">
              Попробуйте изменить запрос или сбросить фильтр темы.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTopic("all");
                setOpenIndex(0);
              }}
              className="py-2.5 px-5 bg-[var(--olive)] text-white border-none text-[0.65rem] font-bold tracking-[1px] uppercase cursor-pointer hover:bg-[var(--olive-light)] transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          filtered.map((item, i) => (
            <FaqItem
              key={`${item.q}-${i}`}
              item={item}
              index={i}
              open={effectiveOpen === i}
              onToggle={() => setOpenIndex(effectiveOpen === i ? null : i)}
            />
          ))
        )}
      </div>
    </section>
  );
}
