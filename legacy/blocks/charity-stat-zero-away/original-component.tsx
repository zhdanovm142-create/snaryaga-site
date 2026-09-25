const CHARITY_FEATS = [
  {
    icon: "🤝",
    title: "Сборы снаряжения",
    desc: "Комплектуем и передаём экипировку по заявкам.",
  },
  {
    icon: "📦",
    title: "Гуманитарная помощь",
    desc: "Участвуем в отправках и поддержке инициатив.",
  },
  {
    icon: "🏕️",
    title: "Сообщество",
    desc: "Открыты волонтёрам и партнёрам.",
  },
  {
    icon: "💬",
    title: "Прозрачность",
    desc: "Отчёты о направленной помощи — по запросу.",
  },
];

const IMPACT_STATS = [
  { v: "500+", l: "комплектов передано" },
  { v: "12", l: "заявок выполнено" },
  { v: "0", l: "уходит на сторону" },
];

export default function Charity() {
  return (
    <section
      id="charity"
      className="bg-[var(--bg2)] border-b border-[var(--border-brand)] py-16 px-6 sm:px-12 relative overflow-hidden"
    >
      {/* Декоративный фон */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(92,107,60,0.4) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div className="max-w-[1440px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="reveal">
            <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
              Волонтёрская жизнь команды
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05] mb-4">
              Снаряга36
              <br />
              помогает своим
            </h2>
            <div className="text-base text-[var(--text2)] leading-[1.8] space-y-4 max-w-[560px] mb-6">
              <p>
                Помимо производства, команда «Снаряга36» занимается волонтёрской
                и благотворительной деятельностью: собираем и передаём снаряжение
                туда, где оно действительно нужно.
              </p>
              <blockquote className="border-l-2 border-[var(--olive)] pl-4 italic text-[var(--text2)]">
                «Делаем снаряжение для тех, кто на передовой. Каждый комплект —
                это реальная помощь, а не отчётность».
                <footer className="not-italic text-[0.72rem] text-[var(--text3)] mt-1 uppercase tracking-[1px]">
                  — Команда Снаряга36
                </footer>
              </blockquote>
            </div>

            {/* Impact stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {IMPACT_STATS.map((s) => (
                <div
                  key={s.l}
                  className="border border-[var(--olive-dark)] bg-[rgba(92,107,60,0.08)] p-3 text-center"
                >
                  <div className="font-display text-[1.5rem] font-bold text-[var(--olive-light)] leading-none mb-1">
                    {s.v}
                  </div>
                  <div className="font-mono-brand text-[0.52rem] uppercase tracking-[1px] text-[var(--text3)] leading-tight">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 py-4 px-10 bg-transparent text-[var(--text)] border border-[var(--border-brand)] rounded-[2px] text-[0.75rem] font-bold tracking-[2px] uppercase cursor-pointer no-underline transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] hover:-translate-y-0.5"
            >
              Поддержать / Связаться
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHARITY_FEATS.map((f) => (
              <div
                key={f.title}
                className="group border border-[var(--border-brand)] bg-[var(--bg3)] p-6 transition-all duration-300 hover:border-[var(--olive-dark)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[rgba(92,107,60,0.1)] border border-[var(--olive-dark)] text-2xl mb-3 transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:border-[var(--olive)]">
                  {f.icon}
                </div>
                <div className="font-display text-[1.05rem] font-bold uppercase mb-1.5">
                  {f.title}
                </div>
                <div className="text-[0.82rem] text-[var(--text2)] leading-[1.6]">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
