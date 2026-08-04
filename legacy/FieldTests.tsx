/**
 * Лента полевых испытаний / новостей.
 *
 * Серверный компонент. Показывает 3 карточки-хроники с датами, тегами
 * и кратким описанием испытаний/обновлений. Имитация блога/новостей без
 * CMS — данные захардкожены (легко заменить на CMS/API позже).
 *
 * Размещается после About, перед Contact.
 */

const POSTS = [
  {
    date: "Июль 2025",
    tag: "Испытания",
    tagColor: "olive",
    title: "Костюм «Большой Бугор» в ночных засадах",
    excerpt:
      "Полевые испытания двустороннего костюма на полигоне. Тепловизор 2-го поколения не обнаружил оператора на дистанции 150 м. Подробности — в отчёте.",
    stat: "150 м",
    statLabel: "дистанция обнаружения",
  },
  {
    date: "Май 2025",
    tag: "Материал",
    tagColor: "coyote",
    title: "Новая экранирующая ткань: 50+ циклов стирки",
    excerpt:
      "R&D-лаборатория завершила тестирование обновлённой ткани. Защитные свойства сохраняются после 50 циклов стирки при 30 °C — без деградации слоёв.",
    stat: "50+",
    statLabel: "циклов стирки",
  },
  {
    date: "Март 2025",
    tag: "Линейка",
    tagColor: "olive",
    title: "Запуск двусторонних костюмов «Бугор»",
    excerpt:
      "Добавлены две двусторонние модели — Средний и Большой Бугор с реверсом олива/койот. Смена маскировки под рельеф за секунды, без переодевания.",
    stat: "2",
    statLabel: "новые модели",
  },
];

export default function FieldTests() {
  return (
    <section id="field-tests" className="sn-section !pt-0">
      <header className="reveal mb-10">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Хроника
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Полевые
            <br />
            испытания
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Тестируем материалы и готовые изделия в реальных условиях.
            Здесь — хроника обновлений, отчётов и новых разработок.
          </p>
        </div>
      </header>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
        {POSTS.map((p) => {
          const isOlive = p.tagColor === "olive";
          return (
            <article
              key={p.title}
              className="group relative bg-[var(--bg2)] p-6 flex flex-col transition-all duration-300 hover:bg-[var(--bg3)] cursor-pointer overflow-hidden"
            >
              {/* Дата + тег */}
              <div className="flex items-center justify-between mb-4">
                <time className="font-mono-brand text-[0.62rem] uppercase tracking-[2px] text-[var(--text3)]">
                  {p.date}
                </time>
                <span
                  className={`px-2 py-0.5 text-[0.55rem] font-bold tracking-[1px] uppercase font-mono-brand border ${
                    isOlive
                      ? "text-[var(--olive-light)] border-[var(--olive-dark)] bg-[rgba(92,107,60,0.1)]"
                      : "text-[var(--coyote-light)] border-[#8b7355] bg-[rgba(139,115,85,0.1)]"
                  }`}
                >
                  {p.tag}
                </span>
              </div>

              {/* Крупная цифра-стат */}
              <div className="mb-3">
                <div
                  className={`font-display text-[2.4rem] font-bold leading-none ${
                    isOlive ? "text-[var(--olive-light)]" : "text-[var(--coyote-light)]"
                  }`}
                >
                  {p.stat}
                </div>
                <div className="font-mono-brand text-[0.55rem] uppercase tracking-[1.5px] text-[var(--text3)] mt-1">
                  {p.statLabel}
                </div>
              </div>

              {/* Заголовок */}
              <h3 className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px] mb-2 leading-tight">
                {p.title}
              </h3>

              {/* Описание */}
              <p className="text-[0.82rem] text-[var(--text2)] leading-[1.6] mb-4 flex-1">
                {p.excerpt}
              </p>

              {/* Читать далее */}
              <div className="flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[1px] uppercase text-[var(--olive-light)] group-hover:gap-2.5 transition-all">
                Читать отчёт
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              {/* Декоративная полоса слева при hover */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-[3px] origin-y scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${
                  isOlive ? "bg-[var(--olive)]" : "bg-[var(--coyote)]"
                }`}
                aria-hidden="true"
              />
            </article>
          );
        })}
      </div>

      <p className="reveal mt-5 text-center text-[0.78rem] text-[var(--text3)]">
        * Полные отчёты испытаний предоставляем по запросу. Подпишитесь на
        рассылку, чтобы получать уведомления о новых тестах.
      </p>
    </section>
  );
}
