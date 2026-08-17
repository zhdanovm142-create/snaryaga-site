const VK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.365 1.26 2.179 1.818.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.316.056c-.132.079-.216.263-.216.263s-.388 1.032-.904 1.91c-1.092 1.856-1.528 1.954-1.708 1.838-.416-.268-.312-1.075-.312-1.65 0-1.793.272-2.54-.53-2.733-.266-.064-.462-.106-1.142-.113-.872-.009-1.608.003-2.024.207-.278.136-.492.44-.362.457.161.022.524.098.718.362.25.34.24 1.104.24 1.104s.144 2.11-.335 2.372c-.328.18-.778-.187-1.744-1.865-.494-.859-.868-1.81-.868-1.81s-.072-.176-.2-.27c-.155-.114-.372-.15-.372-.15l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.272 3.892 6.418c1.894 1.968 4.044 1.84 4.044 1.84h.974z" />
  </svg>
);

const TG_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21.94 4.5 18.6 20.06c-.25 1.1-.92 1.37-1.86.85l-5.14-3.79-2.48 2.39c-.27.27-.5.5-1.03.5l.37-5.2 9.5-8.58c.41-.37-.09-.57-.64-.2L5.07 13.1.97 11.82c-.89-.28-.91-.89.19-1.32l16.05-6.18c.74-.27 1.39.18 1.15 1.32z" />
  </svg>
);

const WA_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const MESSENGERS = [
  { href: "https://vk.ru/club240233552", label: "ВКонтакте", icon: VK_ICON, color: "#0077ff" },
  { href: "https://t.me/snaryaga36", label: "Telegram", icon: TG_ICON, color: "#2aabee" },
  { href: "https://wa.me/79003004636", label: "WhatsApp", icon: WA_ICON, color: "#25d366" },
];

import CookieSettingsButton from "./CookieSettingsButton";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border-brand)] pt-16 pb-8 px-6 sm:px-12 mt-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.2fr] gap-10 mb-12">
          {/* Бренд + соцсети */}
          <div>
            <a href="#" className="flex items-center gap-3 no-underline text-[var(--text)] mb-4" aria-label="Снаряга36 — на главную">
              <div className="w-[42px] h-[42px] bg-[var(--olive)] flex items-center justify-center font-display font-bold text-[16px] tracking-[1px]">
                С36
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-[1.3rem] tracking-[3px] uppercase leading-none">
                  Снаряга36
                </span>
                <span className="text-[0.6rem] text-[var(--text3)] tracking-[2px] uppercase mt-[3px]">
                  Маскировка от тепловизоров
                </span>
              </div>
            </a>
            <p className="text-[0.82rem] text-[var(--text3)] leading-[1.7] mb-6 max-w-[280px]">
              Разработка и производство экипировки из экранирующих тканей для
              снижения заметности в ИК-диапазоне. Воронеж, с 2019 года.
            </p>
            {/* Messenger buttons — крупные, с цветными иконками */}
            <div className="flex gap-2 mb-5">
              {MESSENGERS.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={m.label}
                  title={m.label}
                  className="group relative w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] transition-all duration-300 hover:border-[var(--olive)] hover:-translate-y-0.5 overflow-hidden"
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: m.color }}
                    aria-hidden="true"
                  />
                  <span className="relative w-5 h-5 fill-[var(--text3)] group-hover:fill-white transition-colors duration-300">
                    {m.icon}
                  </span>
                </a>
              ))}
            </div>
            {/* Режим работы */}
            <div className="flex items-center gap-2 text-[0.72rem] text-[var(--text3)]">
              <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--olive)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--olive)]" />
              </span>
              Пн–Пт 9:00–18:00 · Сб 10:00–14:00
            </div>
          </div>

          {/* Каталог */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[2px] uppercase text-[var(--text3)] mb-6 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[var(--border-brand)]">
              Каталог
            </div>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><a href="#products" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Чехлы на рюкзаки 20-50-100 л</a></li>
              <li><a href="#suits" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Костюмы «Бугор»</a></li>
              <li><a href="#burger-chooser" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Подбор костюма</a></li>
              <li><a href="#poncho" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Накидки</a></li>
              <li><a href="#size-guide" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Размерная сетка</a></li>
              <li><a href="#contact" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Индивидуальный пошив</a></li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[2px] uppercase text-[var(--text3)] mb-6 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[var(--border-brand)]">
              Информация
            </div>
            <ul className="list-none p-0 m-0 space-y-3">
              <li><a href="#tech" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Технологии</a></li>
              <li><a href="#ir-compare" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">До/после в ИК</a></li>
              <li><a href="#compare" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Сравнение характеристик</a></li>
              <li><a href="#reviews" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Отзывы</a></li>
              <li><a href="#faq" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">Вопросы и ответы</a></li>
              <li><a href="#about" className="text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)] hover:pl-1">О компании</a></li>
            </ul>
          </div>

          {/* Контакты — с иконками */}
          <div>
            <div className="text-[0.65rem] font-bold tracking-[2px] uppercase text-[var(--text3)] mb-6 flex items-center gap-2 after:content-[''] after:flex-1 after:h-px after:bg-[var(--border-brand)]">
              Контакты
            </div>
            <ul className="list-none p-0 m-0 space-y-3">
              <li>
                <a href="tel:+79003004636" className="group flex items-center gap-2.5 text-[var(--text2)] no-underline text-[0.88rem] font-bold transition-colors hover:text-[var(--olive-light)]">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] group-hover:border-[var(--olive)] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
                    </svg>
                  </span>
                  +7 (900) 300-46-36
                </a>
              </li>
              <li>
                <a href="https://t.me/snaryaga36" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)]">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] group-hover:border-[var(--olive)] transition-colors">
                    <span className="w-3.5 h-3.5 fill-[var(--text3)] group-hover:fill-[var(--olive-light)] transition-colors">{TG_ICON}</span>
                  </span>
                  @snaryaga36
                </a>
              </li>
              <li>
                <a href="mailto:info@снаряга36.рф" className="group flex items-center gap-2.5 text-[var(--text2)] no-underline text-[0.85rem] transition-colors hover:text-[var(--olive-light)]">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] group-hover:border-[var(--olive)] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  info@снаряга36.рф
                </a>
              </li>
              <li>
                <span className="group flex items-center gap-2.5 text-[var(--text3)] text-[0.85rem]">
                  <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  Воронеж, Купянский пер., 11
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Юридическая строка */}
        <div className="pt-6 border-t border-[var(--border-brand)] flex justify-between items-center flex-wrap gap-4">
          <div className="text-[0.72rem] text-[var(--text3)]">
            © 2019–{new Date().getFullYear()} СНАРЯГА36 · ИП · Воронеж · Все права защищены
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="text-[0.72rem] text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)]">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-[0.72rem] text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)]">
              Договор оферты
            </a>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
