/**
 * Секция доверия: сертификаты, испытания, документы.
 *
 * Серверный компонент (без стейта). Показывает 4 карточки доверия:
 * — Сертификат соответствия
 * — Протокол испытаний ИК-диапазона
 * — Патент на ткань
 * — Гарантия возврата
 *
 * Каждая карточка — с иконкой-печатью, заголовком, описанием и ссылкой
 * «Смотреть документ». Внизу — полоска с ключевыми цифрами доверия.
 *
 * Размещается после Guarantees, перед ReviewsCarousel.
 */

const CERTS = [
  {
    icon: "📜",
    title: "Сертификат соответствия",
    desc: "Продукция прошла сертификацию по техническим регламентам ЕАЭС. Документ в наличии — предоставим по запросу.",
    badge: "ЕАЭС",
  },
  {
    icon: "🔬",
    title: "Протокол испытаний ИК",
    desc: "Лабораторные испытания экранирования в диапазонах 3–5 и 8–14 мкм. Подавление сигнатуры до −97%.",
    badge: "3–14 мкм",
  },
  {
    icon: "📜",
    title: "Патент на ткань",
    desc: "Многослойная экранирующая структура защищена патентом РФ. Собственная разработка R&D-лаборатории.",
    badge: "Патент РФ",
  },
  {
    icon: "🛡️",
    title: "Гарантия и возврат",
    desc: "Замена при обнаружении заводского дефекта. Проверка качества на каждом этапе производства.",
    badge: "14 дней",
  },
];

const TRUST_STATS = [
  { v: "−97%", l: "подавление ИК" },
  { v: "50+", l: "циклов стирки" },
  { v: "5000+", l: "изделий выпущено" },
  { v: "2019", l: "год основания" },
];

export default function TrustCertificates() {
  return (
    <section id="trust" className="sn-section !pt-0">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Доверие и документы
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Подтверждённое
            <br />
            качество
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Каждый материал и изделие проходит испытания. Ниже — документы и
            гарантии, которые мы предоставляем по запросу. Прозрачность —
            основа доверия в спецэкипировке.
          </p>
        </div>
      </header>

      <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CERTS.map((c) => (
          <article
            key={c.title}
            className="group relative border border-[var(--border-brand)] bg-[var(--bg2)] p-6 transition-all duration-300 hover:border-[var(--olive-dark)] hover:-translate-y-1 flex flex-col"
          >
            {/* Печать-иконка */}
            <div className="relative w-14 h-14 mb-4 flex items-center justify-center bg-[rgba(92,107,60,0.1)] border-2 border-[var(--olive-dark)] rounded-full text-2xl transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:border-[var(--olive)] group-hover:scale-110">
              {c.icon}
              {/* Декоративные зубцы по кругу */}
              <div
                className="absolute inset-[-4px] rounded-full border border-dashed border-[var(--olive-dark)] opacity-40 group-hover:opacity-70 group-hover:rotate-45 transition-all duration-500"
                aria-hidden="true"
              />
            </div>
            <div className="font-mono-brand text-[0.55rem] text-[var(--olive-light)] tracking-[1.5px] uppercase mb-1.5 px-2 py-0.5 bg-[rgba(92,107,60,0.12)] border border-[var(--olive-dark)] self-start">
              {c.badge}
            </div>
            <h3 className="font-display text-[1rem] font-bold uppercase tracking-[0.5px] mb-2 leading-tight">
              {c.title}
            </h3>
            <p className="text-[0.78rem] text-[var(--text2)] leading-[1.6] mb-4 flex-1">
              {c.desc}
            </p>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[1px] uppercase text-[var(--olive-light)] bg-transparent border-none cursor-pointer hover:gap-2.5 transition-all self-start"
            >
              Смотреть документ
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </button>
          </article>
        ))}
      </div>

      {/* Полоса доверия с цифрами */}
      <div className="reveal mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-brand)] border border-[var(--olive-dark)]">
        {TRUST_STATS.map((s) => (
          <div key={s.l} className="bg-[rgba(92,107,60,0.06)] p-5 text-center">
            <div className="font-display text-[1.8rem] font-bold text-[var(--olive-light)] leading-none mb-1">
              {s.v}
            </div>
            <div className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <p className="reveal mt-5 text-[0.78rem] text-[var(--text3)] text-center">
        * Полный пакет документов предоставляется по запросу. Свяжитесь с нами
        через форму контактов — отправим сканы в течение рабочего дня.
      </p>
    </section>
  );
}
