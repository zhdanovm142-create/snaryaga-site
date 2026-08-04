const ABOUT_FEATS = [
  {
    icon: "🏭",
    title: "Своё производство",
    desc: "Полный цикл — от разработки ткани до пошива готовых изделий в Воронеже.",
  },
  {
    icon: "🔬",
    title: "R&D лаборатория",
    desc: "Постоянное совершенствование материалов и тестирование новых решений.",
  },
  {
    icon: "🛡️",
    title: "Гарантия качества",
    desc: "Контроль на каждом этапе производства. Замена при обнаружении дефектов.",
  },
];

const STATS = [
  { v: "2019", l: "год основания" },
  { v: "5000+", l: "изделий выпущено" },
  { v: "12", l: "моделей в каталоге" },
  { v: "−97%", l: "ИК-сигнатура" },
];

export default function About() {
  return (
    <section
      id="about"
      className="bg-[var(--bg2)] border-t border-[var(--border-brand)] border-b border-[var(--border-brand)] py-16 px-12"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
          <div className="reveal">
            <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
              О компании
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05] mb-4">
              Снаряга36
            </h2>
            <div className="text-base text-[var(--text2)] leading-[1.8] space-y-4 max-w-[560px]">
              <p>
                «Снаряга36» разрабатывает и производит экипировку из экранирующих
                тканей, снижающих заметность в инфракрасном диапазоне. Продукция
                предназначена для защиты от обнаружения тепловизионными средствами.
              </p>
              <p>
                Экипировка ориентирована на применение военнослужащими в условиях
                повышенного риска. Материалы эффективно уменьшают тепловую
                сигнатуру, повышая безопасность при выполнении задач.
              </p>
            </div>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ABOUT_FEATS.map((f) => (
              <div
                key={f.title}
                className="group border border-[var(--border-brand)] bg-[var(--bg3)] p-6 transition-all duration-300 hover:border-[var(--olive-dark)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-[rgba(92,107,60,0.1)] border border-[var(--olive-dark)] mb-3 transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:border-[var(--olive)]">
                  {f.icon}
                </div>
                <div className="font-display text-[1.1rem] font-bold uppercase mb-2">
                  {f.title}
                </div>
                <div className="text-[0.85rem] text-[var(--text2)] leading-[1.7]">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border-brand)] border border-[var(--border-brand)] mb-12">
          {STATS.map((s) => (
            <div key={s.l} className="bg-[var(--bg2)] p-6 text-center">
              <div className="font-display text-[2rem] font-bold text-[var(--olive-light)] leading-none mb-1">
                {s.v}
              </div>
              <div className="font-mono-brand text-[0.58rem] uppercase tracking-[1.5px] text-[var(--text3)]">
                {s.l}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
