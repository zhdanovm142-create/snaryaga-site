const CATS = [
  {
    num: "01 · Визуальный диапазон",
    title: "Маскировка",
    desc: "Сети, накидки, укрытия для людей и техники",
    bg: "linear-gradient(135deg,#2a3020 0%,#1a1a1a 100%)",
    stat: "400–700 нм",
    icon: "eye",
  },
  {
    num: "02 · ИК-диапазон",
    title: "Термоэкранирование",
    desc: "Полное подавление ИК, без ограничения по времени",
    bg: "linear-gradient(135deg,#1f2a1a 0%,#0d0d0d 100%)",
    stat: "3–14 мкм",
    icon: "shield",
  },
  {
    num: "03 · Временный эффект",
    title: "Термоизоляция",
    desc: "Снижают тепловой контраст, не скрывают надолго",
    bg: "linear-gradient(135deg,#2a2520 0%,#1a1a1a 100%)",
    stat: "до 40 мин",
    icon: "thermo",
  },
] as const;

const KITS = [
  {
    title: "Маскировка",
    items: [
      "Маскировочные сети",
      "Накидки (Оксфорд, Спанбонд, Спектра)",
      "Укрытия для людей и техники",
      "Классический камуфляж",
    ],
  },
  {
    title: "Термоэкранирование",
    items: [
      "Личные костюмы и накидки",
      "Чехлы и укрытия для техники",
      "Экранирующие ткани",
      "Маскировка тела, двигателей, выхлопа",
    ],
  },
  {
    title: "Термоизоляция",
    items: [
      "Термосдерживающие материалы",
      "Снижение теплопотерь и нагрева поверхности",
      "Временный эффект (без экранирования)",
      "Не делает объект невидимым надолго",
    ],
  },
] as const;

/**
 * Развёрнутые описания направлений — текстовые блоки под карточками
 * комплектов. Дают пользователю более глубокое понимание каждого
 * направления и сценариев применения.
 */
const DIRECTIONS = [
  {
    num: "01",
    title: "Маскировка — визуальный диапазон",
    body: "Классическая визуальная маскировка остаётся базой любой полевой экипировки. Сети, накидки и укрытия перекрывают диапазон 400–700 нм — то, что видит человеческий глаз и обычная оптика. Мы используем многослойные ткани с диссонирующим рисунком, разрушающие силуэт на фоне растительности, и кроим изделия так, чтобы они работали и в статике (засада), и в динамике (марш-бросок). Это направление применимо всегда, когда угроза наблюдения идёт от визуального контакта — пешего патруля, БПЛА с оптической камерой, снайпера-наблюдателя.",
  },
  {
    num: "02",
    title: "Термоэкранирование — ИК-диапазон",
    body: "Ключевая специализация «Снаряга36». Экранирующие ткани подавляют тепловое излучение тела, двигателя и нагретых поверхностей в диапазонах 3–5 и 8–14 мкм — именно тех «окон», где работают тепловизоры и ИК-камеры БПЛА. Эффект не ослабевает со временем: экранирующий слой не «выдыхается», в отличие от термоизоляции. Полное покрытие (костюм + чехол + чулки) даёт отсутствие контраста оператора с фоном на тепловизионной картинке. Это направление закрывает задачи засады, разведки, эвакуации и работы под ИК-наблюдением противника.",
  },
  {
    num: "03",
    title: "Термоизоляция — временный эффект",
    body: "Термоизоляция — отдельный класс материалов, который снижает тепловой контраст за счёт удержания тепла, а не за счёт его экранирования. Эффект ограничен по времени: до 30–40 минут в зависимости от внешних условий и физической нагрузки оператора. Применяется там, где нужно быстро «остыть» на короткой дистанции (перебежка, смена позиции) и где нет возможности нести полный экранирующий костюм. Не заменяет термоэкранирование и не делает объект невидимым надолго — это инструмент точечного применения, а не универсальное решение.",
  },
] as const;

/** Иконки-схемы направлений (stroke,currentColor — наследуют цвет карточки). */
function CatIcon({ name }: { name: string }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "eye") {
    return (
      <svg {...common}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  // thermo
  return (
    <svg {...common}>
      <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  );
}

export default function Categories() {
  return (
    <section id="categories" className="sn-section">
      <header className="reveal mb-16">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Направления
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Три направления
            <br />
            защиты
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Визуальная маскировка, полное термоэкранирование и термоизоляция —
            под разные задачи и условия.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATS.map((c) => (
          <article
            key={c.title}
            className="reveal group relative aspect-[4/5] overflow-hidden cursor-pointer border border-[var(--border-brand)] hover:border-[var(--olive-dark)] transition-colors duration-300"
          >
            <div
              className="absolute inset-0 bg-[var(--bg3)] transition-transform duration-700 group-hover:scale-105"
              style={{ background: c.bg }}
            />
            {/* Декоративная сетка */}
            <div
              className="absolute inset-0 opacity-[0.12] z-[1] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(138,162,92,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(138,162,92,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.85)] z-[2]" />

            {/* Иконка + arrow в шапке карточки */}
            <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-[3]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center border border-[rgba(138,162,92,0.4)] text-[var(--olive-light)] bg-[rgba(13,13,13,0.35)] backdrop-blur-sm transition-all duration-300 group-hover:border-[var(--olive)] group-hover:bg-[var(--olive)] group-hover:text-white">
                  <CatIcon name={c.icon} />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[rgba(13,13,13,0.55)] backdrop-blur-sm border border-[var(--border-brand)] font-mono-brand text-[0.58rem] text-[var(--olive-light)] tracking-[1px] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--olive)] animate-pulse" aria-hidden="true" />
                  {c.stat}
                </span>
              </div>
              <div className="w-10 h-10 border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-[var(--text2)] text-xl transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:border-[var(--olive)] group-hover:text-white group-hover:translate-x-1">
                →
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 z-[3]">
              <div className="font-mono-brand text-[0.65rem] text-[var(--olive-light)] tracking-[2px] mb-3">
                {c.num}
              </div>
              <h3 className="font-display text-[1.6rem] font-bold uppercase tracking-[1px] mb-2">
                {c.title}
              </h3>
              <p className="text-[0.78rem] text-[var(--text2)] leading-relaxed">
                {c.desc}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {KITS.map((k) => (
          <div
            key={k.title}
            className="border border-[var(--border-brand)] p-[1.8rem] bg-[var(--bg2)] hover:border-[var(--olive-dark)] transition-colors duration-300"
          >
            <h4 className="font-display uppercase text-[1.1rem] mb-4 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[var(--border-brand)]">
              {k.title}
            </h4>
            <ul className="list-none p-0 m-0">
              {k.items.map((it) => (
                <li
                  key={it}
                  className="text-[0.82rem] text-[var(--text2)] py-[0.4rem] border-b border-[var(--border-brand)] flex gap-2.5 before:content-['＋'] before:text-[var(--olive)]"
                >
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Развёрнутые описания направлений — текстовые блоки */}
      <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {DIRECTIONS.map((d) => (
          <article
            key={d.num}
            className="border-l-2 border-[var(--olive)] pl-6 py-2 bg-[var(--bg2)]/40"
          >
            <div className="font-mono-brand text-[0.65rem] text-[var(--olive-light)] tracking-[2px] uppercase mb-2">
              {d.num} · Направление
            </div>
            <h4 className="font-display text-[1rem] font-bold uppercase tracking-[0.5px] mb-3 text-[var(--text)]">
              {d.title}
            </h4>
            <p className="text-[0.82rem] text-[var(--text2)] leading-[1.7]">
              {d.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
