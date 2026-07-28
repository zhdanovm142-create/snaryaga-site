const SCREEN_ROWS = [
  ["Принцип", "Отражение / поглощение ИК"],
  ["Время работы", "Неограниченно"],
  ["Со временем", "Эффект не теряется"],
  ["Для тепловизора", "Объект невидим"],
];

const THERMO_ROWS = [
  ["Принцип", "Замедление теплопередачи"],
  ["Время работы", "Десятки минут"],
  ["Со временем", "Контраст возвращается"],
  ["Для тепловизора", "Нужна замена / остывание"],
];

export default function Compare() {
  return (
    <section id="compare" className="sn-section">
      <header className="reveal mb-16">
        <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
          Инструкция
        </div>
        <div className="flex justify-between items-end flex-wrap gap-8">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
            Экранирование
            <br />
            или изоляция?
          </h2>
          <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
            Принципиальная разница: экранирование работает постоянно, изоляция —
            даёт лишь временную отсрочку.
          </p>
        </div>
      </header>

      <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        {/* Термоэкранирование */}
        <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-8 border-t-[3px] border-t-[var(--olive)]">
          <div className="font-mono-brand text-[0.65rem] tracking-[2px] uppercase mb-4 text-[var(--olive-light)]">
            Термоэкранирование
          </div>
          <h3 className="font-display text-[1.4rem] uppercase mb-2">
            Работает постоянно
          </h3>
          <p className="text-[0.88rem] text-[var(--text2)] leading-[1.7] mb-5">
            Экранирующая ткань отражает или поглощает ИК-излучение независимо от
            времени наблюдения. Объект становится термически нейтральным — его
            тепловой контраст с фоном полностью нивелируется.
          </p>
          <ul className="list-none p-0 m-0">
            {SCREEN_ROWS.map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between gap-4 py-[0.6rem] border-t border-[var(--border-brand)] text-[0.8rem] first:border-t-0"
              >
                <span className="text-[var(--text3)] uppercase tracking-[1px] text-[0.68rem]">
                  {k}
                </span>
                <span className="text-[var(--text)] text-right">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Термоизоляция */}
        <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-8 border-t-[3px] border-t-[var(--coyote)]">
          <div className="font-mono-brand text-[0.65rem] tracking-[2px] uppercase mb-4 text-[var(--coyote-light)]">
            Термоизоляция
          </div>
          <h3 className="font-display text-[1.4rem] uppercase mb-2">
            Временный эффект
          </h3>
          <p className="text-[0.88rem] text-[var(--text2)] leading-[1.7] mb-5">
            Термосдерживающие материалы лишь замедляют теплопередачу, но не
            блокируют её. Поверхность постепенно нагревается, тепловой контраст
            восстанавливается — объект снова становится видим.
          </p>
          <ul className="list-none p-0 m-0">
            {THERMO_ROWS.map(([k, v]) => (
              <li
                key={k}
                className="flex justify-between gap-4 py-[0.6rem] border-t border-[var(--border-brand)] text-[0.8rem] first:border-t-0"
              >
                <span className="text-[var(--text3)] uppercase tracking-[1px] text-[0.68rem]">
                  {k}
                </span>
                <span className="text-[var(--text)] text-right">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-[1.8rem]">
          <div className="w-[34px] h-[34px] rounded-full bg-[var(--olive)] text-white flex items-center justify-center font-display font-bold mb-4">
            1
          </div>
          <h4 className="font-display uppercase text-[1.1rem] mb-2">
            Термоэкранирование
          </h4>
          <p className="text-[0.85rem] text-[var(--text2)] leading-[1.7]">
            Делает объект «холодным»: полностью убирает собственное тепловое
            излучение и скрывает его от тепловизора.
          </p>
        </div>
        <div className="border border-[var(--border-brand)] bg-[var(--bg2)] p-[1.8rem]">
          <div className="w-[34px] h-[34px] rounded-full bg-[var(--olive)] text-white flex items-center justify-center font-display font-bold mb-4">
            2
          </div>
          <h4 className="font-display uppercase text-[1.1rem] mb-2">
            Накидка-корректор
          </h4>
          <p className="text-[0.85rem] text-[var(--text2)] leading-[1.7]">
            Создаёт естественный тепловой ореол вокруг объекта и размывает
            силуэт — убирает эффект «чёрного пятна» на тёплом фоне.
          </p>
          <div className="mt-3 font-mono-brand text-[0.68rem] text-[var(--olive-light)] tracking-[1px]">
            Оксфорд · Спанбонд · Спектра
          </div>
        </div>
      </div>

      <p className="reveal mt-8 text-[0.78rem] text-[var(--text3)] border-l-2 border-[var(--coyote)] pl-4">
        Ключевая задача — скрытие от тепловизионного обнаружения на всё время
        нахождения в зоне риска, с адаптацией к различному температурному фону
        среды.
      </p>

      {/* CTA: перейти к каталогу / подобрать костюм */}
      <div className="reveal mt-10 flex flex-wrap gap-3">
        <a
          href="#products"
          className="group inline-flex items-center gap-2 py-3 px-6 bg-[var(--olive)] text-white text-[0.7rem] font-bold tracking-[2px] uppercase no-underline transition-all duration-300 hover:bg-[var(--olive-light)] hover:-translate-y-0.5"
        >
          Перейти к каталогу
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href="#burger-chooser"
          className="inline-flex items-center gap-2 py-3 px-6 bg-transparent text-[var(--text)] border border-[var(--border-brand)] text-[0.7rem] font-bold tracking-[2px] uppercase no-underline transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--olive-light)] hover:-translate-y-0.5"
        >
          Подобрать костюм
        </a>
      </div>
    </section>
  );
}
