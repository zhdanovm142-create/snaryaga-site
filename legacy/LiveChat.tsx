"use client";

import { useEffect, useState } from "react";

const PHONE = "79515596622"; // без + для ссылок
const PHONE_DISPLAY = "+7 (951) 559-66-22";

const TELEGRAM_URL = "https://t.me/+79515596622";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(
  "Здравствуйте! Хочу уточнить детали по экипировке Снаряга36."
)}`;
const VK_URL = "https://vk.ru/club240233552";

const ICONS = {
  chat: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  close: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.322-.437.887-.662 3.48-1.517 5.796-2.517 6.948-3.001 3.305-1.375 3.993-1.617 4.441-1.625z" />
    </svg>
  ),
  vk: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.365 1.26 2.179 1.818.616.42 1.084.328 1.084.328l2.178-.03s1.14-.07.6-.964c-.044-.073-.314-.661-1.618-1.869-1.366-1.265-1.183-1.06.462-3.246.998-1.328 1.398-2.14 1.273-2.487-.12-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.316.056c-.132.079-.216.263-.216.263s-.388 1.032-.904 1.91c-1.092 1.856-1.528 1.954-1.708 1.838-.416-.268-.312-1.075-.312-1.65 0-1.793.272-2.54-.53-2.733-.266-.064-.462-.106-1.142-.113-.872-.009-1.608.003-2.024.207-.278.136-.492.44-.362.457.161.022.524.098.718.362.25.34.24 1.104.24 1.104s.144 2.11-.335 2.372c-.328.18-.778-.187-1.744-1.865-.494-.859-.868-1.81-.868-1.81s-.072-.176-.2-.27c-.155-.114-.372-.15-.372-.15l-2.328.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.826 4.272 3.892 6.418c1.894 1.968 4.044 1.84 4.044 1.84h.974z" />
    </svg>
  ),
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  ),
};

interface Channel {
  id: string;
  label: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const CHANNELS: Channel[] = [
  {
    id: "phone",
    label: "Позвонить",
    desc: PHONE_DISPLAY,
    href: `tel:+${PHONE}`,
    icon: ICONS.phone,
    color: "var(--olive)",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    desc: "Быстрый ответ в чате",
    href: WHATSAPP_URL,
    icon: ICONS.whatsapp,
    color: "#25D366",
  },
  {
    id: "telegram",
    label: "Telegram",
    desc: "Напишите нам в Telegram",
    href: TELEGRAM_URL,
    icon: ICONS.telegram,
    color: "#0088cc",
  },
  {
    id: "vk",
    label: "ВКонтакте",
    desc: "Официальное сообщество",
    href: VK_URL,
    icon: ICONS.vk,
    color: "#0077FF",
  },
];

export default function LiveChat() {
  const [open, setOpen] = useState(false);

  // Появление кнопки с задержкой, чтобы не отвлекать при первой загрузке
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Popover с каналами связи */}
      {open && (
        <div
          className="fixed right-6 bottom-[8.5rem] sm:bottom-32 z-[1500] w-[300px] bg-[var(--bg2)] border border-[var(--olive-dark)] shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
          style={{ animation: "sn-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          role="dialog"
          aria-label="Каналы связи"
        >
          <header className="flex items-center justify-between p-4 border-b border-[var(--border-brand)]">
            <div>
              <div className="font-display text-[1rem] font-bold uppercase tracking-[0.5px]">
                Связаться с нами
              </div>
              <div className="text-[0.65rem] text-[var(--text3)] uppercase tracking-[1px] mt-0.5">
                Ответим за ~10 минут
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="w-7 h-7 flex items-center justify-center bg-[var(--bg)] border border-[var(--border-brand)] text-[var(--text2)] cursor-pointer transition-all hover:border-[var(--olive)] hover:text-[var(--text)]"
            >
              {ICONS.close}
            </button>
          </header>
          <ul className="p-2 space-y-1">
            {CHANNELS.map((c) => (
              <li key={c.id}>
                <a
                  href={c.href}
                  target={c.id === "phone" ? undefined : "_blank"}
                  rel={c.id === "phone" ? undefined : "noopener noreferrer"}
                  className="flex items-center gap-3 p-2.5 no-underline text-[var(--text)] hover:bg-[var(--bg3)] transition-colors group"
                >
                  <span
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[0.9rem] font-bold uppercase tracking-[0.5px] group-hover:text-[var(--olive-light)] transition-colors">
                      {c.label}
                    </span>
                    <span className="block text-[0.72rem] text-[var(--text2)] truncate">
                      {c.desc}
                    </span>
                  </span>
                  <span className="text-[var(--text3)] group-hover:text-[var(--olive-light)] transition-colors text-lg">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <footer className="p-3 border-t border-[var(--border-brand)] text-center text-[0.65rem] text-[var(--text3)]">
            Пн–Пт 9:00–18:00 · Сб 10:00–14:00
          </footer>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть каналы связи" : "Открыть каналы связи"}
        aria-expanded={open}
        className={`fixed right-6 bottom-[6.5rem] sm:bottom-24 z-[1500] w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 text-white border-none ${
          open
            ? "bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border-brand)] rotate-90"
            : "bg-[var(--olive)] hover:bg-[var(--olive-light)] hover:scale-105"
        }`}
        style={
          !open
            ? { animation: "sn-fab-pulse 2.4s ease-out infinite" }
            : undefined
        }
      >
        {open ? ICONS.close : ICONS.chat}
        {!open && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[var(--bg)]"
            aria-hidden="true"
          >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
          </span>
        )}
      </button>
    </>
  );
}
