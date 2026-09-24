const STEPS = [
  {
    num: "01",
    title: "Многослойный экран",
    short: "Блокировка ИК",
    desc: "Комбинация отражающих и поглощающих слоёв блокирует ИК-излучение в диапазонах 3-5 и 8-14 мкм.",
    icon: "🛡️",
  },
  {
    num: "02",
    title: "Терморегуляция",
    short: "Выравнивание температуры",
    desc: "Микрокапсулы фазового перехода выравнивают температуру поверхности ткани с окружающей средой.",
    icon: "🌡️",
  },
  {
    num: "03",
    title: "Износостойкость",
    short: "50+ циклов стирки",
    desc: "Материал выдерживает 50+ циклов стирки без потери защитных свойств. Устойчив к механическим повреждениям.",
    icon: "⚙️",
  },
  {
    num: "04",
    title: "Полевые испытания",
    short: "Тесты в реальных условиях",
    desc: "Продукция тестировалась в реальных условиях с применением тепловизионных приборов различных поколений.",
    icon: "🎯",
  },
];

export default function Tech() {
  return (
    <section id="tech" className="sn-section">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Animated IR target visual */}
        <div className="reveal aspect-square bg-[var(--bg2)] border border-[var(--border-brand)] relative overflow-hidden">
          {/* Видео-демонстрация на весь квадрат: тепловизионная съёмка с
              квадрокоптера (white-hot, HUD прибора сохранён — достоверность
              «полевых испытаний»). Без цветовых фильтров: нейтральный ч/б
              кадр с контрастом оригинала (зелёный тон убран по фидбеку —
              hue-rotate/sepia глушили контраст термограммы). Фолбэк по
              архитектуре hero: пока видео грузится — постер; если не
              загрузилось — видео-слой прозрачен и остаётся радар на фоне
              сетки, деградации нет. */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/tech-ir-poster.jpg"
            aria-label="Пример тепловизионной съёмки: человек на дороге в ИК-диапазоне"
          >
            <source src="/tech-ir.mp4" type="video/mp4" />
          </video>
          {/* Лёгкая виньетка (верх/низ темнее, центр почти прозрачный):
              тонкая, чтобы не подмешивать серый в чёрный и не гасить
              контраст white-hot-кадра; только скругляет углы под тему сайта */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,13,13,0.25) 0%, rgba(13,13,13,0.05) 45%, rgba(13,13,13,0.5) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(92,107,60,0.18) 0%, transparent 55%), radial-gradient(circle at 30% 30%, rgba(139,115,85,0.08) 0%, transparent 50%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(92,107,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[70%] h-[70%]">
              {/* ИК-кольца радара, перекрестие и сканлайн поверх видео —
                  эффект «захвата цели» тепловизором. Прозрачность колец
                  снижена (плотнее, чем на пустом фоне), чтобы читались
                  поверх живого кадра */}
              <div
                className="absolute inset-0 rounded-full border border-[rgba(122,143,82,0.6)]"
                style={{ animation: "sn-ir-pulse 3s ease-out infinite" }}
              />
              <div
                className="absolute inset-[15%] rounded-full border border-[rgba(122,143,82,0.7)]"
                style={{ animation: "sn-ir-pulse 3s ease-out infinite", animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-[30%] rounded-full border border-[rgba(122,143,82,0.8)]"
                style={{ animation: "sn-ir-pulse 3s ease-out infinite", animationDelay: "1s" }}
              />
              <div
                className="absolute inset-[45%] rounded-full border-2 border-[var(--olive-light)]"
                style={{ animation: "sn-ir-pulse 3s ease-out infinite", animationDelay: "1.5s" }}
              />
              <div className="absolute inset-[47%] rounded-full bg-[var(--olive-light)] shadow-[0_0_12px_rgba(122,143,82,0.9)]" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[rgba(122,143,82,0.5)]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[rgba(122,143,82,0.5)]" />
              <div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--olive-light)] to-transparent"
                style={{ animation: "sn-ir-scan 3s linear infinite" }}
              />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 font-display text-[5rem] font-bold text-[rgba(92,107,60,0.12)] tracking-[-3px] leading-none pointer-events-none">
            IR
          </div>
          <div className="absolute top-6 right-6 px-4 py-2 bg-[rgba(92,107,60,0.15)] border border-[rgba(92,107,60,0.3)] font-mono-brand text-[0.7rem] text-[var(--olive-light)] tracking-[1px]">
            3-14 μm Range
          </div>
          <div className="absolute bottom-6 right-6 font-mono-brand text-[0.62rem] text-[var(--text3)] tracking-[1px] text-right space-y-0.5">
            <div>SIG: <span className="text-[var(--olive-light)]">-97%</span></div>
            <div>STATUS: <span className="text-[var(--olive-light)]">MASKED</span></div>
            <div>LAYERS: <span className="text-[var(--olive-light)]">MULTI</span></div>
          </div>
        </div>

        {/* Text + Step timeline */}
        <div className="reveal">
          <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
            Технологии
          </div>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05] mb-4">
            Как работает
            <br />
            ИК-защита
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8] mb-8">
            Наши ткани используют многослойную структуру с экранирующими
            компонентами, блокирующими тепловое излучение тела и техники.
          </p>

          {/* Horizontal step timeline (desktop) / vertical (mobile) */}
          <ol className="relative list-none p-0 m-0">
            {/* Connecting line - desktop horizontal */}
            <div
              className="hidden md:block absolute top-[28px] left-[28px] right-[28px] h-px bg-gradient-to-r from-[var(--olive-dark)] via-[var(--olive)] to-[var(--olive-dark)] opacity-30 pointer-events-none"
              aria-hidden="true"
            />
            {/* Connecting line - mobile vertical */}
            <div
              className="md:hidden absolute top-0 bottom-0 left-[20px] w-px bg-gradient-to-b from-[var(--olive-dark)] via-[var(--olive)] to-[var(--olive-dark)] opacity-30 pointer-events-none"
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {STEPS.map((s) => (
                <li
                  key={s.num}
                  className="group relative bg-[var(--bg2)] border border-[var(--border-brand)] p-4 transition-all duration-300 hover:border-[var(--olive-dark)] hover:bg-[var(--bg3)]"
                >
                  <div className="flex items-start gap-3">
                    {/* Number badge */}
                    <div className="relative z-[1] w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[var(--bg)] border border-[var(--olive)] font-display font-bold text-[var(--olive-light)] text-[0.9rem] transition-all duration-300 group-hover:bg-[var(--olive)] group-hover:text-white group-hover:scale-105">
                      {s.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg" aria-hidden="true">
                          {s.icon}
                        </span>
                        <h4 className="font-display text-[0.95rem] font-bold uppercase tracking-[0.5px] leading-tight">
                          {s.title}
                        </h4>
                      </div>
                      <div className="font-mono-brand text-[0.58rem] text-[var(--olive)] tracking-[1px] uppercase mb-1.5">
                        {s.short}
                      </div>
                      <p className="text-[0.78rem] text-[var(--text2)] leading-[1.55]">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ol>

          {/* CTA: увидеть своими глазами + выбрать модель */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#ir-compare"
              className="group inline-flex items-center gap-2 py-3 px-6 bg-[var(--olive)] text-white text-[0.7rem] font-bold tracking-[2px] uppercase no-underline transition-all duration-300 hover:bg-[var(--olive-light)] hover:-translate-y-0.5"
            >
              Сравнение «до/после»
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 py-3 px-6 bg-transparent text-[var(--text)] border border-[var(--border-brand)] text-[0.7rem] font-bold tracking-[2px] uppercase no-underline transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] hover:-translate-y-0.5"
            >
              Выбрать модель
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
