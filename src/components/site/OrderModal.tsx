"use client";

import { useEffect, useState } from "react";

interface Props {
  productName: string | null;
  onClose: () => void;
  onSubmitted: (msg: string) => void;
}

export default function OrderModal({ productName, onClose, onSubmitted }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Блокируем прокрутку body пока модалка открыта
  useEffect(() => {
    if (productName) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [productName]);

  // Закрытие по Esc
  useEffect(() => {
    if (!productName) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [productName, onClose]);

  if (!productName) return null;

  // NOTE: snaryaga36@mail.ru — placeholder email for FormSubmit.co.
  // Replace with the real site owner's inbox before going live.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/snaryaga36@mail.ru", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          contact,
          product: productName,
          _subject: `Запрос на: ${productName}`,
          _template: "table",
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSubmitted("Запрос отправлен! Менеджер свяжется с вами.");
        setName("");
        setContact("");
        onClose();
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
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-[8px] z-[2000] flex items-center justify-center p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Запрос на ${productName}`}
    >
      <div
        className="bg-[var(--bg2)] border border-[var(--border-brand)] rounded-[4px] p-12 max-w-[480px] w-full relative"
        style={{ animation: "sn-modal-in 0.3s ease" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-6 right-6 w-8 h-8 bg-[var(--bg)] border border-[var(--border-brand)] flex items-center justify-center cursor-pointer text-[var(--text2)] text-[1.1rem] transition-all duration-300 hover:border-[var(--olive)] hover:text-[var(--text)]"
        >
          ×
        </button>
        <div className="font-display text-[1.5rem] font-bold uppercase mb-2">
          Запрос на <span className="text-[var(--olive-light)]">{productName}</span>
        </div>
        <div className="text-[0.85rem] text-[var(--text3)] mb-8">
          Оставьте контакты, менеджер свяжется с вами
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван"
              className="w-full px-3 py-3 bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-[2px] text-[var(--text3)] mb-2">
              Телефон или Telegram
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="w-full px-3 py-3 bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text)] text-sm focus:outline-none focus:border-[var(--olive)] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[var(--olive)] text-white border-none rounded-[2px] text-[0.75rem] font-bold tracking-[2px] uppercase cursor-pointer transition-all duration-300 hover:bg-[var(--olive-light)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Отправка…" : "Отправить запрос"}
          </button>
          {error && (
            <div className="text-[0.7rem] text-[#d97a5c] text-center mt-1">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
