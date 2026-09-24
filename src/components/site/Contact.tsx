"use client";

import { useState } from "react";

import { useSiteActions } from "@/components/site/SiteContext";

const PRODUCT_OPTIONS = [
  "Рюкзак 20 литров",
  "Рюкзак 50 литров",
  "Рюкзак 100 литров",
  "Костюм «Малый Бугор»",
  "Костюм «Средний Бугор»",
  "Костюм «Большой Бугор»",
  "Костюм двусторонний",
  "Накидка маскировочная",
  "Чехол на рюкзак ИК",
  "Чулки ИК",
  "Комплект «Полно»",
  "Индивидуальный пошив",
];

const QUICK_CONTACTS = [
  { href: "https://t.me/snaryaga36", label: "Telegram", short: "@snaryaga36", color: "#2aabee" },
  { href: "https://wa.me/79515596622", label: "WhatsApp", short: "+7 951 559-66-22", color: "#25d366" },
];

/** Маска для российского телефона: +7 (XXX) XXX-XX-XX */
function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").replace(/^[78]/, "7").slice(0, 11);
  if (digits.length === 0) return "";
  let out = "+7";
  if (digits.length > 1) out += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 4) out += `) ${digits.slice(4, 7)}`;
  if (digits.length >= 7) out += `-${digits.slice(7, 9)}`;
  if (digits.length >= 9) out += `-${digits.slice(9, 11)}`;
  return out;
}

function validatePhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length === 11;
}

export default function Contact() {
  // Тост успеха — из SiteActionsContext (page.tsx — серверный компонент).
  const { showToast: onSubmitted } = useSiteActions();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState(PRODUCT_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneValid = validatePhone(phone);
  const nameValid = name.trim().length >= 2;

  // NOTE: snaryaga36@mail.ru — placeholder email for FormSubmit.co.
  // Replace with the real site owner's inbox before going live.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (!nameValid || !phoneValid) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/snaryaga36@mail.ru", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          phone,
          product,
          message,
          _subject: "Новая заявка с сайта Снаряга36",
          _template: "table",
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSubmitted("Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.");
        setName("");
        setPhone("");
        setProduct(PRODUCT_OPTIONS[0]);
        setMessage("");
        setTouched({ name: false, phone: false });
      } else {
        setError("Не удалось отправить. Попробуйте позже или свяжитесь через Telegram.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[var(--bg)]">
      <div className="sn-section">
        <header className="reveal mb-16">
          <div className="font-mono-brand text-[0.68rem] text-[var(--olive)] tracking-[3px] uppercase mb-4 flex items-center gap-4 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
            Контакты
          </div>
          <div className="flex justify-between items-end flex-wrap gap-8">
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold uppercase tracking-[-1px] leading-[1.05]">
              Связаться
              <br />
              с нами
            </h2>
            <p className="text-base text-[var(--text2)] max-w-[560px] leading-[1.8]">
              Запрос коммерческого предложения, технической документации или
              оформление заказа.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div className="reveal">
            {/* Quick-contact messenger strip */}
            <div className="flex gap-3 mb-6">
              {QUICK_CONTACTS.map((qc) => (
                <a
                  key={qc.label}
                  href={qc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 flex items-center gap-3 p-3 bg-[var(--bg2)] border border-[var(--border-brand)] no-underline transition-all duration-300 hover:-translate-y-0.5"
                  style={{ borderColor: undefined }}
                >
                  <span
                    className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: qc.color }}
                    aria-hidden="true"
                  >
                    {qc.label === "Telegram" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M21.94 4.5 18.6 20.06c-.25 1.1-.92 1.37-1.86.85l-5.14-3.79-2.48 2.39c-.27.27-.5.5-1.03.5l.37-5.2 9.5-8.58c.41-.37-.09-.57-.64-.2L5.07 13.1.97 11.82c-.89-.28-.91-.89.19-1.32l16.05-6.18c.74-.27 1.39.18 1.15 1.32z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607z" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-[0.78rem] font-bold uppercase tracking-[0.5px] text-[var(--text)]">
                      {qc.label}
                    </div>
                    <div className="font-mono-brand text-[0.62rem] text-[var(--text3)] truncate">
                      {qc.short}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <ul className="list-none p-0 m-0 space-y-6">
            <li className="flex gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-xl">
                📞
              </div>
              <div>
                <div className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-1">
                  Телефон
                </div>
                <a
                  href="tel:+79515596622"
                  className="text-[var(--text)] no-underline text-base hover:text-[var(--olive-light)] transition-colors"
                >
                  +7 (951) 559-66-22
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-[#5ba3ff]"
                  aria-hidden="true"
                >
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.365 1.26 2.179 1.818.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.316.056c-.132.079-.216.263-.216.263s-.388 1.032-.904 1.91c-1.092 1.856-1.528 1.954-1.708 1.838-.416-.268-.312-1.075-.312-1.65 0-1.793.272-2.54-.53-2.733-.266-.064-.462-.106-1.142-.113-.872-.009-1.608.003-2.024.207-.278.136-.492.44-.362.457.161.022.524.098.718.362.25.34.24 1.104.24 1.104s.144 2.11-.335 2.372c-.328.18-.778-.187-1.744-1.865-.494-.859-.868-1.81-.868-1.81s-.072-.176-.2-.27c-.155-.114-.372-.15-.372-.15l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.272 3.892 6.418c1.894 1.968 4.044 1.84 4.044 1.84h.974z" />
                </svg>
              </div>
              <div>
                <div className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-1">
                  Группа ВКонтакте
                </div>
                <a
                  href="https://vk.ru/club240233552"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text)] no-underline text-base hover:text-[var(--olive-light)] transition-colors"
                >
                  Официальное сообщество
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-xl">
                📍
              </div>
              <div>
                <div className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-1">
                  Адрес пункта выдачи
                </div>
                <div className="text-[var(--text)] text-base">
                  г. Воронеж, Купянский переулок, д. 11
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-xl">
                🕒
              </div>
              <div>
                <div className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-1">
                  Режим работы
                </div>
                <div className="text-[var(--text)] text-base">
                  Пн–Пт 9:00–18:00 · Сб 10:00–14:00
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-11 h-11 flex items-center justify-center bg-[var(--bg2)] border border-[var(--border-brand)] text-xl">
                🌐
              </div>
              <div>
                <div className="text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-1">
                  Сайт
                </div>
                <a
                  href="https://снаряга36.рф/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text)] no-underline text-base hover:text-[var(--olive-light)] transition-colors"
                >
                  снаряга36.рф
                </a>
              </div>
            </li>
          </ul>
          </div>

          {/* Form */}
          <div className="reveal border border-[var(--border-brand)] bg-[var(--bg2)] p-6 sm:p-8 relative overflow-hidden">
            {/* Декоративный уголок */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10" aria-hidden="true" style={{ background: "radial-gradient(circle at top right, var(--olive), transparent 70%)" }} />
            <div className="font-display text-[1.5rem] font-bold uppercase mb-2 flex items-center gap-3">
              Оставить заявку
              {/* Progress indicator */}
              <span className="ml-auto flex items-center gap-1.5">
                {[nameValid, phoneValid, message.trim().length > 0].map((ok, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${ok ? "bg-[var(--olive)] scale-110" : "bg-[var(--border-brand)]"}`}
                    aria-hidden="true"
                  />
                ))}
              </span>
            </div>
            <div className="text-[0.85rem] text-[var(--text3)] mb-8">
              Укажите контакты и мы свяжемся с вами для обсуждения деталей
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    placeholder="Иван Иванов"
                    aria-invalid={touched.name && !nameValid}
                    className={`w-full px-3 py-3 bg-[var(--bg)] border text-[var(--text)] text-sm focus:outline-none transition-colors ${
                      touched.name && !nameValid
                        ? "border-[#a85a3c] focus:border-[#a85a3c]"
                        : "border-[var(--border-brand)] focus:border-[var(--olive)]"
                    }`}
                  />
                  {touched.name && !nameValid && (
                    <div className="text-[0.68rem] text-[#d97a5c] mt-1">
                      Введите имя (минимум 2 символа)
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                    placeholder="+7 (___) ___-__-__"
                    inputMode="tel"
                    aria-invalid={touched.phone && !phoneValid}
                    className={`w-full px-3 py-3 bg-[var(--bg)] border text-[var(--text)] text-sm focus:outline-none transition-colors font-mono-brand ${
                      touched.phone && !phoneValid
                        ? "border-[#a85a3c] focus:border-[#a85a3c]"
                        : "border-[var(--border-brand)] focus:border-[var(--olive)]"
                    }`}
                  />
                  {touched.phone && !phoneValid && (
                    <div className="text-[0.68rem] text-[#d97a5c] mt-1">
                      Введите корректный номер телефона
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
                  Интересующая продукция
                </label>
                <select
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full px-3 py-3 bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] focus:shadow-[0_0_0_1px_var(--olive)] transition-all"
                >
                  {PRODUCT_OPTIONS.map((o) => (
                    <option key={o} value={o} className="bg-[var(--bg)]">
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
                  Сообщение
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите вашу задачу или требования..."
                  className="w-full px-3 py-3 bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] focus:shadow-[0_0_0_1px_var(--olive)] transition-all resize-y min-h-[120px]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[var(--olive)] text-white border-none rounded-[2px] text-[0.75rem] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Отправка…" : "Отправить заявку"}
              </button>
              {error && (
                <div className="text-[0.7rem] text-[#d97a5c] text-center">
                  {error}
                </div>
              )}
              <div className="text-[0.7rem] text-[var(--text3)] text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
