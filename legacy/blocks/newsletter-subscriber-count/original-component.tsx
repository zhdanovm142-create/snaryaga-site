"use client";

import { useState } from "react";
import { useSiteActions } from "@/components/site/SiteContext";

const BENEFITS = [
  { icon: "🔔", text: "Уведомления о новых тестах и моделях" },
  { icon: "📦", text: "Обновления каталога и новые модели" },
  { icon: "📊", text: "Отчёты полевых испытаний первыми" },
  { icon: "✅", text: "Только полезные материалы" },
];

export default function Newsletter() {
  // Тост успеха — из SiteActionsContext (page.tsx — серверный компонент).
  const { showToast: onSubmitted } = useSiteActions();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // NOTE: snaryaga36@mail.ru — placeholder email for FormSubmit.co.
  // Replace with the real site owner's inbox before going live.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!emailValid) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/snaryaga36@mail.ru", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          _subject: "Новая подписка на рассылку",
          _template: "table",
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSubmitted("Подписка оформлена! Ждите новостей.");
        setEmail("");
        setTouched(false);
      } else {
        setError("Не удалось оформить подписку. Попробуйте позже.");
      }
    } catch {
      setError("Ошибка сети. Проверьте подключение и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--bg2)] border-t border-[var(--border-brand)] py-16 px-6 sm:px-12">
      <div className="max-w-[920px] mx-auto reveal">
        <div className="relative border border-[var(--olive-dark)] bg-gradient-to-br from-[var(--bg3)] to-[var(--bg)] p-8 sm:p-12 overflow-hidden">
          {/* Декоративная сетка */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(92,107,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,60,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Большой фоновый знак */}
          <div className="absolute -top-8 -right-8 font-display text-[12rem] font-bold text-[rgba(92,107,60,0.04)] leading-none pointer-events-none select-none">
            ✉
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
            {/* Left: title + benefits + social proof */}
            <div>
              <div className="font-mono-brand text-[0.65rem] text-[var(--olive)] tracking-[3px] uppercase mb-3 flex items-center gap-3 before:content-[''] before:w-[30px] before:h-px before:bg-[var(--olive)]">
                Рассылка
              </div>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold uppercase tracking-[-0.5px] leading-[1.05] mb-3">
                Новинки и полевые
                <br />
                тесты — на почту
              </h3>

              {/* Benefit bullets */}
              <ul className="list-none p-0 m-0 space-y-2 mb-5">
                {BENEFITS.map((b) => (
                  <li
                    key={b.text}
                    className="flex items-center gap-2.5 text-[0.85rem] text-[var(--text2)]"
                  >
                    <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[rgba(92,107,60,0.1)] border border-[var(--olive-dark)] rounded-full text-sm">
                      {b.icon}
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>

              {/* Social proof + frequency */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["#5c6b3c", "#8b7355", "#3d4728", "#6b6040"].map((c) => (
                      <span
                        key={c}
                        className="w-7 h-7 rounded-full border-2 border-[var(--bg3)] flex items-center justify-center font-mono-brand text-[0.55rem] font-bold text-white"
                        style={{ backgroundColor: c }}
                        aria-hidden="true"
                      >
                        ●
                      </span>
                    ))}
                  </div>
                  <span className="text-[0.75rem] text-[var(--text3)]">
                    <span className="text-[var(--olive-light)] font-bold">5000+</span> подписчиков
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(92,107,60,0.12)] border border-[var(--olive-dark)] font-mono-brand text-[0.55rem] text-[var(--olive-light)] tracking-[1px] uppercase">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--olive)] opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
                  </span>
                  1 письмо / месяц
                </span>
              </div>
            </div>

            {/* Right: form */}
            <form onSubmit={handleSubmit} className="w-full lg:w-[320px] space-y-3" noValidate>
              <div>
                <label className="block text-[0.62rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="you@example.com"
                  aria-invalid={touched && !emailValid}
                  className={`w-full px-4 py-3 bg-[var(--bg)] border text-[var(--text)] text-sm focus:outline-none transition-all focus:shadow-[0_0_0_1px_var(--olive)] ${
                    touched && !emailValid
                      ? "border-[#a85a3c] focus:border-[#a85a3c] focus:shadow-[0_0_0_1px_#a85a3c]"
                      : "border-[var(--border-brand)] focus:border-[var(--olive)]"
                  }`}
                />
                {touched && !emailValid && (
                  <div className="text-[0.65rem] text-[#d97a5c] mt-1">
                    Введите корректный e-mail
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="group w-full py-3.5 bg-[var(--olive)] text-white border-none text-[0.7rem] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? "Отправка…" : "Подписаться"}
                {!submitting && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {error && (
                <div className="text-[0.65rem] text-[#d97a5c] text-center">
                  {error}
                </div>
              )}
              <p className="text-[0.62rem] text-[var(--text3)] text-center leading-[1.5]">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
