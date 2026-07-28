const ITEMS = [
  {
    num: "01",
    icon: "🛡️",
    title: "Гарантия качества",
    desc: "Контроль на каждом этапе. Замена при обнаружении производственного дефекта.",
  },
  {
    num: "02",
    icon: "🏭",
    title: "Своё производство",
    desc: "Полный цикл в Воронеже — от ткани до готового изделия.",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Быстрое изготовление",
    desc: "Стандартные позиции от 3 дней. Кастом — от 2 недель.",
  },
  {
    num: "04",
    icon: "🚚",
    title: "Доставка по РФ",
    desc: "СДЭК, Почта России. Самовывоз — Воронеж, Купянский пер., 11.",
  },
  {
    num: "05",
    icon: "🔬",
    title: "R&D лаборатория",
    desc: "Постоянное совершенствование материалов и тестирование решений.",
  },
  {
    num: "06",
    icon: "📞",
    title: "Поддержка",
    desc: "Менеджер на связи с 9:00 до 18:00. Поможем подобрать комплект.",
  },
];

export default function Guarantees() {
  return (
    <section id="guarantees" className="bg-[var(--bg2)] border-t border-[var(--border-brand)] border-b border-[var(--border-brand)] py-16 px-6 sm:px-12">
      <div className="max-w-[1440px] mx-auto">
        <header className="reveal mb-10 flex justify-between items-end flex-wrap gap-6">
          <div>
            <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-3 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
              Почему нам доверяют
            </div>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
              Гарантии
              <br />
              и сервис
            </h2>
          </div>
          <p className="text-[0.88rem] text-[var(--text2)] max-w-[420px] leading-[1.7]">
            6 принципов работы — от контроля качества до поддержки после
            покупки. Производим сами, отвечаем за каждое изделие.
          </p>
        </header>

        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)]">
          {ITEMS.map((it) => (
            <div
              key={it.title}
              className="group relative bg-[var(--bg2)] p-6 flex gap-4 items-start transition-all duration-300 hover:bg-[var(--bg3)] cursor-default overflow-hidden"
            >
              {/* Number badge (background watermark) */}
              <span
                className="absolute top-2 right-3 font-display text-[3rem] font-bold text-[rgba(92,107,60,0.06)] leading-none pointer-events-none select-none transition-colors duration-300 group-hover:text-[rgba(92,107,60,0.12)]"
                aria-hidden="true"
              >
                {it.num}
              </span>
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[var(--bg3)] border border-[var(--border-brand)] text-2xl transition-all duration-300 group-hover:border-[var(--olive)] group-hover:bg-[var(--olive)] group-hover:text-white group-hover:scale-105">
                {it.icon}
              </div>
              <div className="relative z-[1]">
                <div className="font-display text-[1.05rem] font-bold uppercase tracking-[0.5px] mb-1">
                  {it.title}
                </div>
                <div className="text-[0.82rem] text-[var(--text2)] leading-[1.6]">
                  {it.desc}
                </div>
              </div>
              {/* Декоративная полоса снизу при hover */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-[var(--olive)] transition-all duration-400"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
